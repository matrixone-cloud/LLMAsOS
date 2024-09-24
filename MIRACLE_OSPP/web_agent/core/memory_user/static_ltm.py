import os

from web_agent.config import USER_PREFERENCES_PATH
from web_agent.utils.logger import logger


def get_user_ltm():
    """
    Get the user preferences stored in the user_infomation.txt file.
    returns: str | None - The user preferences stored in the user_infomation.txt file or None if not found.
    """
    user_preferences_file_name = 'user_infomation.txt'
    user_preferences_file = os.path.join(USER_PREFERENCES_PATH, user_preferences_file_name)
    try:
        with open(user_preferences_file) as f:
            user_pref = f.read()
        logger.info(f"User preferences loaded from: {user_preferences_file}")
        return user_pref
    except FileNotFoundError:
        logger.warning(f"""User preferences file \"{user_preferences_file_name}\" not found.
To add your preferences for this agent to use, create a file called "{user_preferences_file_name}" in directory "{USER_PREFERENCES_PATH}".\n""")
        return None
