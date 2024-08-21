
from src.botnet.models.user_models import User

from src.core.services.dynamo_service import DynamoService

from CONFIG import settings

class UserTableRepo(DynamoService):
    def __init__(self):
        super().__init__(settings.PRIMARY_KEY_NAME, settings.USER_TABLE_NAME, User)
