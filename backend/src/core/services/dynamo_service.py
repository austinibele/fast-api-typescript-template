from pydantic import ValidationError
from src.core.repository.dynamo_repo import DynamoRepo

from src.core.logger import get_logger

logger = get_logger(__name__)

class DynamoService:
    def __init__(self, primary_key_name, table_name, model_class):
        self.dynamo_repo = DynamoRepo(primary_key_name, table_name)
        self.model_class = model_class

    def create_item(self, item_data: dict):
        logger.info(f"Creating item in {self.dynamo_repo.table_name}")
        try:
            item = self.model_class(**item_data)
            response = self.dynamo_repo.create_item(**item.dict())
            logger.info(f"Item created: {response}")
            return response
        except ValidationError as e:
            logger.error(f"Validation error: {e}", exc_info=True)
            return None
        except Exception as e:
            logger.error(f"Failed to create item: {e}", exc_info=True)
            return None

    def get_items(self):
        return self.dynamo_repo.get_items()

    def get_item(self, key_value: str):
        return self.dynamo_repo.get_item(key_value)

    def update_item(self, key_value: str, update_data: dict):
        logger.info(f"Updating item in {self.dynamo_repo.table_name}")
        try:
            valid_data = {key: value for key, value in update_data.items() if key in self.model_class.__fields__}
            response = self.dynamo_repo.update_item(key_value, **valid_data)
            logger.info(f"Item updated response code: {response['ResponseMetadata']['HTTPStatusCode']}")
            return response
        except ValidationError as e:
            logger.error(f"Validation error: {e}", exc_info=True)
            return None
        except Exception as e:
            logger.error(f"Failed to update item: {e}", exc_info=True)
            return None

    def delete_item(self, key_value: str):
        logger.info(f"Deleting item in {self.dynamo_repo.table_name}: {key_value}")
        try:
            res = self.dynamo_repo.delete_item(key_value)
            logger.info(f"Item deleted: {key_value}")
            return res
        except Exception as e:
            logger.error(f"Failed to delete item: {e}", exc_info=True)
            return None
