# MIRACLE
MIRACLE 一个基于Agent的系统，目标是依照用户指令完成Web操作。
在进行与用户的计划沟通后，系统将自动执行沟通后的计划。本系统目前基于AutoGen agent framework。

## 安装
要开始使用 MIRACLE，请按照以下步骤安装依赖项并配置您的环境。
### 设置
MIRACLE 使用 uv 管理 Python 虚拟环境和包依赖项。
- 安装 `uv` https://github.com/astral-sh/uv
    - macOS/Linux: `curl -LsSf https://astral.sh/uv/install.sh | sh`
    - Windows: `powershell -c "irm https://astral.sh/uv/install.ps1 | iex"`
    - 或者您可以使用 pip 进行安装：`pip install uv`
- 创建虚拟环境 `uv venv --python 3.11` (`3.10+` 应该也可以运行)
- 激活虚拟环境：`source .venv/bin/activate` (Windows: `.venv\\Scripts\\activate`)
- 生成所需的环境文件：
    ```bash
    uv pip compile pyproject.toml -o requirements.txt
    uv pip install -r requirements.txt
    ```
- 环境配置：
  通过复制提供的示例文件创建一个 .env 文件。
    ```bash
    cp .env-example .env
    ```

    - 编辑 .env 文件并设置以下变量：
        - AUTOGEN_MODEL_NAME（建议使用gpt4o）。
        - AUTOGEN_MODEL_API_KEY （LLM API 密钥）。
        - AUTOGEN_MODEL_BASE_URL （托管完成端点的 URL）。
        - AUTOGEN_MODEL_API_TYPE （建议使用azure）。
        - AUTOGEN_MODEL_API_VERSION （azure的版本）。
    - （可选） AUTOGEN_LLM_TEMPERATURE（设置 LLM 的温度。控制输出中的随机性）。
    - （可选） AUTOGEN_LLM_TOP_P（设置 top-p 值，用于控制 token 采样的多样性）。
    - BROWSER_STORAGE_DIR （使用Chrome浏览器）。请在 Chrome 中访问 chrome://version/，找到您的配置文件路径，并将 BROWSER_STORAGE_DIR 设置为该路径的值。

    - 以下是一个样例文件：
        ```bash
        AUTOGEN_MODEL_NAME= gpt4o
        AUTOGEN_MODEL_API_KEY= YOUR AZURE API
        AUTOGEN_MODEL_BASE_URL= https://XXXXXX.openai.azure.com
        AUTOGEN_MODEL_API_TYPE= azure
        AUTOGEN_MODEL_API_VERSION= YOUR API VERSION
        BROWSER_STORAGE_DIR= D:\Users\UserName\AppData\Local\Google\Chrome\User Data\Default
        ```
## 运行
### 设置环境并安装所有依赖项后，可以使用如下命令使用 MIRACLE：

```
python -m web_agent.main
```
MacOS 用户:
如果在运行上述程序时遇到 BlockingIOError (Errno 35)，请执行以下命令以避免此问题：
```
python -u -m web_agent.main
```



