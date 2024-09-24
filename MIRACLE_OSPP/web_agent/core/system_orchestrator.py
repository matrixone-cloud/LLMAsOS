import asyncio
import json
import os
import time
import multiprocessing
import web_agent.core.playwright_manager as browserManager
from web_agent.config import SOURCE_LOG_FOLDER_PATH
from web_agent.core.autogen_wrapper import AutogenWrapper
from web_agent.utils.cli_helper import async_input
from web_agent.utils.http_helper import make_post_request
from web_agent.utils.logger import logger
from web_agent.core.post_process_responses import final_reply_callback_chat_response as notify_planner_messages_ex
from web_agent.utils.ui_messagetype import MessageType

class SystemOrchestrator:
    """
    Orchestrates the system's operation, handling input from both a command prompt and a web interface,
    and coordinating between the Autogen wrapper and the Playwright manager.

    Attributes:
        agent_scenario (str): The agent scenario to use for command processing. Defaults to "user_proxy,browser_nav_agent".
        input_mode (str): The input mode of the system, determining whether command prompt input is enabled. Defaults to "GUI_ONLY".
        browser_manager (PlaywrightManager): The Playwright manager instance for web interaction.
        autogen_wrapper (AutogenWrapper): The Autogen wrapper instance for agent-based command processing.
        is_running (bool): Flag indicating whether the system is currently processing a command.
        shutdown_event (asyncio.Event): Event to wait for an exit command to be processed.
    """

    def __init__(self, agent_scenario:str="user,planner_agent,browser_nav_agent,browser_nav_executor", input_mode:str="GUI_ONLY"):
        """
        Initializes the system orchestrator with the specified agent scenario and input mode.

        Args:
            agent_scenario (str, optional): The agent scenario to use for command processing. Defaults to "user_proxy,browser_nav_agent".
            input_mode (str, optional): The input mode of the system. Defaults to "GUI_ONLY".
        """
        self.agent_scenario = agent_scenario
        self.input_mode = input_mode
        self.browser_manager = None
        self.autogen_wrapper = None
        self.is_running = False
        # self.input_mode = "confirmation_mode" # 判断要执行何种模式 还有command_mode
        self.current_plan = None
        self.user_input_mode = "confirmation_mode"
        self.current_task = None  # Store the task reference here

        if os.getenv('ORCHESTRATOR_API_KEY', None) is not None and os.getenv('ORCHESTRATOR_GATEWAY', None) is not None:
            self.__populate_orchestrator_info()
            logger.info(f"Orchestrator endpoint: {self.orchestrator_endpoint}")
        else:
            self.use_orchestrator = False

        self.__parse_user_and_browser_agent_names()
        self.shutdown_event = asyncio.Event() #waits for an exit command to be processed


    def __populate_orchestrator_info(self):
        """
        Populates the orchestrator information by retrieving the API key, gateway, and endpoint from environment variables.
        """
        self.orchestrator_api_key = os.getenv('ORCHESTRATOR_API_KEY')
        self.orchestrator_gateway = os.getenv('ORCHESTRATOR_GATEWAY')
        self.orchestrator_endpoint = f"{self.orchestrator_gateway}/api/orchestrate"
        self.use_orchestrator = True


    def __parse_user_and_browser_agent_names(self):
        """
        Parse the user and browser agent names from agent_scenario
        """
        self.agent_names = self.agent_scenario.split(',')
        for agent_name in self.agent_names:
            if 'user' in agent_name:
                self.ser_agent_name = agent_name
            else:
                self.browser_agent_name = agent_name

    async def initialize(self):
        """
        Initializes the components required for the system's operation, including the Autogen wrapper and the Playwright manager.
        """
        self.autogen_wrapper = await AutogenWrapper.create(agents_needed=self.agent_names)

        self.browser_manager = browserManager.PlaywrightManager(gui_input_mode=self.input_mode == "GUI_ONLY")
        await self.browser_manager.async_initialize()

        if self.input_mode == "GUI_ONLY":
            browser_context = await self.browser_manager.get_browser_context()
            await browser_context.expose_function('process_task', self.receive_command)
            await browser_context.expose_function("restart_command", self.restart_command)

    async def start(self):
        """
        Starts the system orchestrator, initializing components and starting the command prompt loop if necessary.
        """
        await self.initialize()

        if self.input_mode != "GUI_ONLY":
            await self.command_prompt_loop()

        await self.wait_for_exit()

    async def command_prompt_loop(self):
        """
        Continuously reads and processes commands from the command prompt until an 'exit' command is received.
        """
        while not self.is_running:
            command: str = await async_input("Enter your command (or type 'exit' to quit): ") # type: ignore
            await self.process_command(command) # type: ignore

    async def receive_command(self, command: str):
        """
        receive user instructions. due to the mode to justify which instruction should be exe 
        """
        if self.user_input_mode == "confirmation_mode":
            # 用户正在与 GPT 交互修改计划
            await self.handle_confirmation(command)
        elif self.user_input_mode == "command_mode":
            # 普通命令模式下，执行任务
            await self.process_command(command)



    async def handle_confirmation(self, user_input):
        """
        处理计划确认和修改的逻辑
        """
        if user_input.lower() == "yes":
            # 用户确认计划，回到普通命令模式并执行计划
            self.user_input_mode = "command_mode"
            user_messages = [msg["content"] for msg in self.autogen_wrapper.chat_history if msg["role"] == "user"]

            # 提取最后一条 'assistant' 消息
            assistant_messages = [msg["content"] for msg in self.autogen_wrapper.chat_history if
                                  msg["role"] == "assistant"]

            if assistant_messages:
                last_assistant_message = assistant_messages[-1]
            else:
                last_assistant_message = ""

            # 将用户消息和最后的 assistant 消息组合成一个字符串
            combined_messages = "\n".join(user_messages + [last_assistant_message])
            self.current_plan = combined_messages
            await self.execute_plan(combined_messages)
        else:
            # 用户要求修改计划，进入与 GPT 的交互
            updated_plan, gpt_reply = await self.autogen_wrapper.process_multi_turn_gpt_interaction(user_input)
            plan = updated_plan.get('plan', None)
            if plan is not None:
                notify_planner_messages_ex(plan, message_type=MessageType.PLAN)
                notify_planner_messages_ex("Do you approve this updated plan? (yes / Enter any commands you want to add)", message_type=MessageType.INFO)
            else:
                notify_planner_messages_ex(gpt_reply, message_type=MessageType.INFO)

    async def execute_plan(self, plan):
        # pass
        await self.start_command(plan)

    async def start_command(self, command: str):
        """Start the process_command function as a task."""
        if self.current_task is None or self.current_task.done():
            # Create a new task if no task is running or if the previous task is completed
            self.current_task = asyncio.create_task(self.process_command(command))
            print(f"Started process_command with command: {command}")
        else:
            print("Task is already running.")

    async def kill_command(self):
        """Kill the currently running process_command task."""

        # before using the below code, you need to add as many as possible this line of code in async funtion you can see in this project.
        # Just because the logic of killing a process due to the await signal. And the more you add the below code the faster it could run.
        # await asyncio.sleep(0.001)
        # The smallest reliably effective sleep interval is about 1 millisecond (0.001 seconds).
        # Anything below that may not be precise due to OS limitations and Python's asyncio event loop granularity.

        if self.current_task is not None and not self.current_task.done():
            print("Killing the running task...")
            self.current_task.cancel()  # Request task cancellation
            try:
                await self.current_task  # Wait for task to acknowledge cancellation
            except asyncio.CancelledError:
                print("Task has been successfully killed.")
        else:
            print("No task is currently running.")

    async def restart_command(self):
        """Restart the process_command task by killing it first if necessary."""
        await self.kill_command()  # Kill the task if it's running
        await self.reset_chat_history()
        await self.start_command(self.current_plan)  # Start a new task

    async def reset_chat_history(self):
        print("Resetting chat history...")
        pass

    async def __orchestrate_command(self, command: str):
        # 这个函数的主要作用是与编排器交互，根据编排器的响应来决定是否通知用户、终止命令执行或重构命令。如果编排器不可用或没有有效响应，则返回原始命令
        if not self.use_orchestrator:
            return command

        orch_response = make_post_request(self.orchestrator_endpoint, {"query": command}, self.orchestrator_api_key, api_key_header_name="X-API-Key") # type: ignore

        if not orch_response:
            return command

        if "user_notification" in orch_response:
            # 异步通知用户
            await self.browser_manager.notify_user(orch_response["user_notification"]) # type: ignore
        if "is_terminating" in orch_response and orch_response["is_terminating"]:
            # 命令已完成
            logger.info("Orchestrator indicated command execution completed.")
            return None
        if "reformulated_query" in orch_response:
            # 记录日志并返回重构后的命令
            logger.info(f"Orchestrator reformulated command to: {orch_response['reformulated_query']}")
            return orch_response["reformulated_query"]


    async def process_command(self, command: str):
        """
        Processes a given command, coordinating with the Autogen wrapper for execution and handling special commands like 'exit'.

        Args:
            command (str): The command to process.
        """
        try:
            logger.info(f"Received command: {command}")
            if command.lower() == 'exit':
                await self.shutdown()
                return

            if command:
                self.is_running = True
                start_time = time.time()
                current_url = await self.browser_manager.get_current_url() if self.browser_manager else None
                self.browser_manager.ui_manager.clear_conversation_history() # type: ignore
                self.browser_manager.log_user_message(command) # type: ignore
                result = None
                logger.info(f"Processing command: {command}")
                if self.autogen_wrapper:
                    await self.browser_manager.update_processing_state("processing") # type: ignore
                    orchestrated_command = await self.__orchestrate_command(command)
                    if orchestrated_command is not None:
                        result = await self.autogen_wrapper.process_command(orchestrated_command, current_url)
                    else:
                        result = await self.autogen_wrapper.process_command(command, current_url)

                    await self.browser_manager.update_processing_state("done") # type: ignore
                end_time = time.time()
                elapsed_time = round(end_time - start_time, 2)
                logger.info(f"Command \"{command}\" took: {elapsed_time} seconds.")
                await self.save_chat_messages()
                if result is not None:
                    chat_history= result.chat_history # type: ignore
                    last_message = chat_history[-1] if chat_history else None # type: ignore
                    if last_message and "terminate" in last_message and last_message["terminate"]=="yes":
                        await self.browser_manager.notify_user(last_message, "answer") # type: ignore
                self.is_running = False
                self.user_input_mode = "confirmation_mode"
                self.autogen_wrapper.clear_conversation_history()
                await self.browser_manager.notify_user(f"Task Completed ({elapsed_time}s).", "info") # type: ignore
                await self.browser_manager.command_completed(command, elapsed_time) # type: ignore
        except asyncio.CancelledError:
            print("process_command was cancelled")
            # Perform any cleanup here if necessary
            raise


    async def save_chat_messages(self):
        """
        Saves the chat messages from the Autogen wrapper's agents to a JSON file.
        """
        messages = self.autogen_wrapper.agents_map[self.browser_agent_name].chat_messages # type: ignore
        messages_str_keys = {str(key): value for key, value in messages.items()} # type: ignore
        with open(os.path.join(SOURCE_LOG_FOLDER_PATH, 'chat_messages.json'), 'w', encoding='utf-8') as f:
            json.dump(messages_str_keys, f, ensure_ascii=False, indent=4)
        logger.debug("Chat messages saved")

    async def wait_for_exit(self):
        """
        Waits for an exit command to be processed, keeping the system active in the meantime.
        """
        await self.shutdown_event.wait()  # Wait until the shutdown event is set

    async def shutdown(self):
        """
        Shuts down the system orchestrator, stopping the Playwright manager and exiting the command prompt loop.
        """
        logger.info("Shutting down System Orchestrator...")
        if self.browser_manager:
            await self.browser_manager.stop_playwright()
        self.shutdown_event.set()  # Signal the shutdown event to stop waiting in wait_for_exit
