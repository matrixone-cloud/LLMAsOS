import asyncio
import json
import os
import tempfile
import traceback
from string import Template
from time import time_ns
from typing import Any

import autogen  # type: ignore
import nest_asyncio  # type: ignore
import openai

from dotenv import load_dotenv

from web_agent.config import SOURCE_LOG_FOLDER_PATH
from web_agent.core.agents.browser_nav_agent import BrowserNavAgent
from web_agent.core.agents.high_level_planner_agent import PlannerAgent
from web_agent.core.post_process_responses import final_reply_callback_planner_agent as notify_planner_messages
from web_agent.core.prompts import LLM_PROMPTS
from web_agent.core.skills.get_url import geturl
from web_agent.utils.autogen_sequential_function_call import UserProxyAgent_SequentialFunctionExecution
from web_agent.utils.logger import logger
from web_agent.utils.response_parser import parse_response
from web_agent.utils.ui_messagetype import MessageType

nest_asyncio.apply()  # type: ignore
from openai import AzureOpenAI

class AutogenWrapper:
    """
    A wrapper class for interacting with the Autogen library.

    Args:
        max_chat_round (int): The maximum number of chat rounds.

    Attributes:
        number_of_rounds (int): The maximum number of chat rounds.
        agents_map (dict): A dictionary of the agents that are instantiated in this autogen instance.

    """

    def __init__(self, max_chat_round: int = 1000):
        self.number_of_rounds = max_chat_round

        self.agents_map: dict[str, UserProxyAgent_SequentialFunctionExecution | autogen.AssistantAgent | autogen.ConversableAgent ] | None = None

        self.config_list: list[dict[str, str]] | None = None
        self.chat_logs_dir: str = SOURCE_LOG_FOLDER_PATH
        self.chat_history = []
        self.client_chatgpt = None
        self.plan_initial = False

    @classmethod
    async def create(cls, agents_needed: list[str] | None = None, max_chat_round: int = 1000):
        """
        Create an instance of AutogenWrapper.

        Args:
            agents_needed (list[str], optional): The list of agents needed. If None, then ["user", "browser_nav_executor", "planner_agent", "browser_nav_agent"] will be used.
            max_chat_round (int, optional): The maximum number of chat rounds. Defaults to 50.

        Returns:
            AutogenWrapper: An instance of AutogenWrapper.

        """
        print(f">>> Creating AutogenWrapper with {agents_needed} and {max_chat_round} rounds.")
        if agents_needed is None:
            agents_needed = ["user", "browser_nav_executor", "planner_agent", "browser_nav_agent"]
        # Create an instance of cls
        self = cls(max_chat_round)#init AutogenWrapper class named it cls
        load_dotenv()#load .env file information
        os.environ["AUTOGEN_USE_DOCKER"] = "False"

        autogen_model_name = os.getenv("AUTOGEN_MODEL_NAME")
        if not autogen_model_name:#set default model or in .env file model
            autogen_model_name = "gpt-4-turbo"
            logger.warning(f"Cannot find AUTOGEN_MODEL_NAME in the environment variables, setting it to default {autogen_model_name}.")

        autogen_model_api_key = os.getenv("AUTOGEN_MODEL_API_KEY")#set api key
        if autogen_model_api_key is None:
            logger.warning("Cannot find AUTOGEN_MODEL_API_KEY in the environment variables.")
            if not os.getenv('OPENAI_API_KEY'):
                logger.error("Cannot find OPENAI_API_KEY in the environment variables.")
                raise ValueError("You need to set either AUTOGEN_MODEL_API_KEY or OPENAI_API_KEY in the .env file.")
            else:
                autogen_model_api_key = os.environ['OPENAI_API_KEY']
        else:
            logger.info(f"Using model {autogen_model_name} for AutoGen from the environment variables.")
        model_info = {'model': autogen_model_name, 'api_key': autogen_model_api_key}

        if os.getenv("AUTOGEN_MODEL_BASE_URL"):
            model_info["base_url"] = os.getenv("AUTOGEN_MODEL_BASE_URL") # type: ignore

        if os.getenv("AUTOGEN_MODEL_API_TYPE"):
            model_info["api_type"] = os.getenv("AUTOGEN_MODEL_API_TYPE") # type: ignore

        if os.getenv("AUTOGEN_MODEL_API_VERSION"):
            model_info["api_version"] = os.getenv("AUTOGEN_MODEL_API_VERSION") # type: ignore

        env_var: list[dict[str, str]] = [model_info]
        # write env_var information into a json file and get the file path
        with tempfile.NamedTemporaryFile(delete=False, mode='w') as temp:
            json.dump(env_var, temp)
            temp_file_path = temp.name

        self.config_list = autogen.config_list_from_json(env_or_file=temp_file_path, filter_dict={"model": {autogen_model_name}}) # type: ignore
        self.agents_map = await self.__initialize_agents(agents_needed)

        def trigger_nested_chat(manager: autogen.ConversableAgent):
            # notify_chat_response()#dropped
            content:str=manager.last_message()["content"] # type: ignore
            content_json = parse_response(content) # type: ignore
            next_step = content_json.get('next_step', None)
            plan = content_json.get('plan', None)
            if plan is not None:
                if not self.plan_initial:
                    notify_planner_messages(plan, message_type=MessageType.PLAN)
                else:
                    self.plan_initial = False

            if next_step is None:
                notify_planner_messages("Received no response, terminating..", message_type=MessageType.INFO) # type: ignore
                return False
            else:
                notify_planner_messages(next_step, message_type=MessageType.STEP) # type: ignore
                return True
        def get_url() -> str:
            return asyncio.run(geturl())

        def my_custom_summary_method(sender: autogen.ConversableAgent,recipient: autogen.ConversableAgent, summary_args: dict ) : # type: ignore
            messages_str_keys = {str(key): value for key, value in sender.chat_messages.items()} # type: ignore
            self.__save_chat_log(list(messages_str_keys.values())[0]) # type: ignore
            last_message=recipient.last_message(sender)["content"] # type: ignore
            if not last_message or last_message.strip() == "": # type: ignore
                return "I received an empty message. Try a different approach."
            elif "##TERMINATE TASK##" in last_message:
                last_message=last_message.replace("##TERMINATE TASK##", "") # type: ignore
                last_message=last_message+" "+  get_url() # type: ignore
                notify_planner_messages(last_message, message_type=MessageType.ACTION)
                return last_message #  type: ignore
            return recipient.last_message(sender)["content"] # type: ignore

        def reflection_message(recipient, messages, sender, config): # type: ignore
            last_message=messages[-1]["content"] # type: ignore
            content_json = parse_response(last_message) # type: ignore
            next_step = content_json.get('next_step', None)

            if next_step is None:
                print ("Message to nested chat returned None")
                return None
            else:
                next_step = next_step.strip() +" " + get_url() # type: ignore
                return next_step # type: ignore

        # print(f">>> Registering nested chat. Available agents: {self.agents_map}")
        self.agents_map["user"].register_nested_chats( # type: ignore
            [
                {
            "sender": self.agents_map["browser_nav_executor"],
            "recipient": self.agents_map["browser_nav_agent"],
            "message":reflection_message,
            "max_turns": self.number_of_rounds,
            "summary_method": my_custom_summary_method,
                }
            ],
            trigger=trigger_nested_chat, # type: ignore
        )

        return self


    def get_chat_logs_dir(self) -> str|None:
        """
        Get the directory for saving chat logs.

        Returns:
            str|None: The directory path or None if there is not one

        """
        return self.chat_logs_dir

    def set_chat_logs_dir(self, chat_logs_dir: str):
        """
        Set the directory for saving chat logs.

        Args:
            chat_logs_dir (str): The directory path.

        """
        self.chat_logs_dir = chat_logs_dir


    def __save_chat_log(self, chat_log: list[dict[str, Any]]):
        chat_logs_file = os.path.join(self.get_chat_logs_dir() or "", f"nested_chat_log_{str(time_ns())}.json")
        # Save the chat log to a file
        with open(chat_logs_file, "w") as file:
            json.dump(chat_log, file, indent=4)


    async def __initialize_agents(self, agents_needed: list[str]):
        """
        Instantiate all agents with their appropriate prompts/skills.

        Args:
            agents_needed (list[str]): The list of agents needed, this list must have user_proxy in it or an error will be generated.

        Returns:
            dict: A dictionary of agent instances.

        """
        agents_map: dict[str, UserProxyAgent_SequentialFunctionExecution  | autogen.ConversableAgent]= {}

        user_delegate_agent = await self.__create_user_delegate_agent()
        agents_map["user"] = user_delegate_agent
        agents_needed.remove("user")

        browser_nav_executor = self.__create_browser_nav_executor_agent()
        agents_map["browser_nav_executor"] = browser_nav_executor
        agents_needed.remove("browser_nav_executor")

        for agent_needed in agents_needed:
            if agent_needed == "browser_nav_agent":
                browser_nav_agent: autogen.ConversableAgent = self.__create_browser_nav_agent(agents_map["browser_nav_executor"] )
                agents_map["browser_nav_agent"] = browser_nav_agent
            elif agent_needed == "planner_agent":
                planner_agent = self.__create_planner_agent(user_delegate_agent)
                agents_map["planner_agent"] = planner_agent
            else:
                raise ValueError(f"Unknown agent type: {agent_needed}")
        return agents_map


    async def __create_user_delegate_agent(self) -> autogen.ConversableAgent:
        """
        Create a ConversableAgent instance.

        Returns:
            autogen.ConversableAgent: An instance of ConversableAgent.

        """
        def is_planner_termination_message(x: dict[str, str])->bool: # type: ignore
             # this function is designed to judge whether the message is shutdown message or not
             #检查消息中是否存在function字段，如果有则返回false；检查content为空或者解析失败设置should_terminate为1；如果包含terminate字段且为yes，设置should_terminate为1并通知计划者消息
             should_terminate = False
             function: Any = x.get("function", None)
             if function is not None:
                 return False

             content:Any = x.get("content", "")
             if content is None:
                content = ""
                should_terminate = True
             else:
                try:
                    content_json = parse_response(content)
                    _terminate = content_json.get('terminate', "no")
                    final_response = content_json.get('final_response', None)
                    if(_terminate == "yes"):
                        should_terminate = True
                        if final_response:
                            notify_planner_messages(final_response, message_type=MessageType.ANSWER)
                except json.JSONDecodeError:
                    logger.error("Error decoding JSON response:\n{content}.\nTerminating..")
                    should_terminate = True

             return should_terminate # type: ignore

        await asyncio.sleep(0.001) # support the interrupt

        task_delegate_agent = UserProxyAgent_SequentialFunctionExecution(
            name="user",
            llm_config=False,   #不使用LLM配置
            system_message=LLM_PROMPTS["USER_AGENT_PROMPT"],
            is_termination_msg=is_planner_termination_message, # type: ignore
            # 检测当前是否需要终止任务确保任务在适当时间结束,避免无限循环的资源消耗
            human_input_mode="NEVER",       #表示代理不会等待人工输入，这对于自动化任务非常重要
            max_consecutive_auto_reply=self.number_of_rounds,       #限制代理的连续自动回复次数，防止无限循环
        )
        return task_delegate_agent

    def __create_browser_nav_executor_agent(self):
        """
        Create a UserProxyAgent instance for executing browser control.

        Returns:
            autogen.UserProxyAgent: An instance of UserProxyAgent.

        """
        def is_browser_executor_termination_message(x: dict[str, str])->bool: # type: ignore
             tools_call:Any = x.get("tool_calls", "")
             if tools_call :
                return False
             else:
                return True

        browser_nav_executor_agent = UserProxyAgent_SequentialFunctionExecution(
            name="browser_nav_executor",
            is_termination_msg=is_browser_executor_termination_message,
            human_input_mode="NEVER",
            llm_config=None,
            max_consecutive_auto_reply=self.number_of_rounds,
            code_execution_config={
                                "last_n_messages": 1,
                                "work_dir": "tasks",
                                "use_docker": False,
                                },
        )
        print(">>> Created browser_nav_executor_agent:", browser_nav_executor_agent)
        return browser_nav_executor_agent

    def __create_browser_nav_agent(self, user_proxy_agent: UserProxyAgent_SequentialFunctionExecution) -> autogen.ConversableAgent:
        """
        Create a BrowserNavAgent instance.

        Args:
            user_proxy_agent (autogen.UserProxyAgent): The instance of UserProxyAgent that was created.

        Returns:
            autogen.AssistantAgent: An instance of BrowserNavAgent.

        """
        browser_nav_agent = BrowserNavAgent(self.config_list, user_proxy_agent) # type: ignore
        #print(">>> browser agent tools:", json.dumps(browser_nav_agent.agent.llm_config.get("tools"), indent=2))
        return browser_nav_agent.agent

    def __create_planner_agent(self, assistant_agent: autogen.ConversableAgent):
        """
        Create a Planner Agent instance. This is mainly used for exploration at this point

        Returns:
            autogen.AssistantAgent: An instance of PlannerAgent.

        """
        planner_agent = PlannerAgent(self.config_list, assistant_agent) # type: ignore
        return planner_agent.agent

    async def process_command(self, command: str, current_url: str | None = None) -> autogen.ChatResult | None:
        """
        Process a command by sending it to one or more agents.

        Args:
            command (str): The command to be processed.
            current_url (str, optional): The current URL of the browser. Defaults to None.

        Returns:
            autogen.ChatResult | None: The result of the command processing, or None if an error occurred. Contains chat log, cost(tokens/price)

        """
        current_url_prompt_segment = ""
        if current_url:
            current_url_prompt_segment = f"Current Page: {current_url}"

        prompt = Template(LLM_PROMPTS["COMMAND_EXECUTION_PROMPT"]).substitute(command=command, current_url_prompt_segment=current_url_prompt_segment)
        logger.info(f"Prompt for command: {prompt}")
        #with Cache.disk() as cache:
        try:
            if self.agents_map is None:
                raise ValueError("Agents map is not initialized.")

            result=await self.agents_map["user"].a_initiate_chat( # type: ignore
                self.agents_map["planner_agent"], # self.manager # type: ignore
                max_turns=self.number_of_rounds,
                #clear_history=True,
                message=prompt,
                silent=False,
                cache=None,
            )
            # reset usage summary for all agents after each command
            for agent in self.agents_map.values():
                if hasattr(agent, "client") and agent.client is not None:
                    agent.client.clear_usage_summary() # type: ignore
            return result
        except openai.BadRequestError as bre:
            logger.error(f"Unable to process command: \"{command}\". {bre}")
            traceback.print_exc()


    async def process_plan_command(self, command: str, current_url: str | None = None) -> autogen.ChatResult | None:
        current_url_prompt_segment = ""
        if current_url:
            current_url_prompt_segment = f"Current Page: {current_url}"

        prompt = Template(LLM_PROMPTS["COMMAND_EXECUTION_PROMPT"]).substitute(command=command,
                                                                              current_url_prompt_segment=current_url_prompt_segment)
        logger.info(f"Prompt for command: {prompt}")
        # with Cache.disk() as cache:

        if self.agents_map is None:
            raise ValueError("Agents map is not initialized.")

        result = await self.agents_map["user"].a_initiate_chat(  # type: ignore
            self.agents_map["planner_agent"],  # self.manager # type: ignore
            max_turns=self.number_of_rounds,
            # clear_history=True,
            message=prompt,
            silent=False,
             cache=None,
            )
        # reset usage summary for all agents after each command
        print(result)
        return result

    async def process_multi_turn_gpt_interaction(self, user_input: str):
        """
        处理用户与 GPT 的多轮交互，保存并使用对话上下文。
        """
        # 如果对话历史为空，构建初始系统消息

        if not self.chat_history:
            system_message = self.agents_map["planner_agent"].description
            self.chat_history.append({"role": "system", "content": system_message})

        # 添加用户输入到对话历史
        self.chat_history.append({"role": "user", "content": user_input})

        config_llm = self.agents_map["planner_agent"].llm_config
        api_type = config_llm['config_list'][0].get("api_type", "openai")
        try:
            if api_type == "azure":
                if self.client_chatgpt is None:
                    self.client_chatgpt = AzureOpenAI(
                        api_key=config_llm['config_list'][0]["api_key"],
                        azure_deployment=config_llm['config_list'][0]["model"],
                        api_version=config_llm['config_list'][0]["api_version"],
                        azure_endpoint=config_llm['config_list'][0]["base_url"]
                        )

                response = self.client_chatgpt.chat.completions.create(
                    model=config_llm['config_list'][0]["model"],
                    messages=self.chat_history,
                    max_tokens=1000,
                    seed=config_llm["seed"],
                    temperature=config_llm["temperature"],
                    top_p=config_llm["top_p"],
                    tools=config_llm["tools"]
                    )
            else:
                openai.api_key = config_llm['config_list'][0]["api_key"]

                response = openai.chat.completions.create(
                    model=config_llm['config_list'][0]["model"],
                    messages=self.chat_history,
                    max_tokens=1000,
                    temperature= 0,
                    top_p=config_llm["top_p"],
                    tools=config_llm["tools"]
                )
        except Exception as e:
            print((f"Error during GPT interaction: {str(e)}"))
            raise e
        gpt_reply = response.choices[0].message.content
        print(gpt_reply)
        reply = parse_response(gpt_reply)
        self.chat_history.append({"role": "assistant", "content": gpt_reply})

        # 返回 GPT 回复
        return reply, gpt_reply

    def clear_all_gpt_message(self):
        self.chat_history.clear()
