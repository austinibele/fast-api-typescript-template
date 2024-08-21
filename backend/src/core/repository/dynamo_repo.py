import boto3

from src.core.logger import get_logger

logger = get_logger(__name__)

class DynamoRepo:
    def __init__(self, primary_key_name, table_name):
        self.primary_key_name = primary_key_name
        self.table_name = table_name
        self.table = boto3.resource('dynamodb').Table(self.table_name)

    def create_item(self, **kwargs):
        """
        Create or replace an item in the table.
        :param kwargs: dict, key-value pairs for the item to be stored.
        """
        try:
            response = self.table.put_item(Item=kwargs)
            return response
        except Exception as e:
            logger.error(f"Failed to create item: {e}", exc_info=True)
            return None
        
    def get_items(self):
        """
        Retrieve all items from the table.
        """
        try:
            response = self.table.scan()
            return response.get('Items')
        except Exception as e:
            logger.error(f"Failed to get items: {e}", exc_info=True)
            return None

    def get_item(self, primary_key_value):
        """
        Retrieve an item from the table using the primary key.
        :param primary_key_value: str, the primary key.
        """
        try:
            response = self.table.get_item(Key={self.primary_key_name: primary_key_value})
            return response.get('Item')
        except Exception as e:
            logger.error(f"Failed to get item: {e}", exc_info=True)
            return None

    def update_item(self, primary_key_value, **kwargs):
        """
        Update an item in the table.
        :param primary_key_value: str, the primary key.
        :param kwargs: dict, attributes to update.
        """
        # Remove primary key attributes from kwargs
        if self.primary_key_name in kwargs:
            del kwargs[self.primary_key_name]

        if not kwargs:
            logger.error("No attributes to update.")
            return None

        update_expression = "set " + ", ".join(f"#{k}=:{k}" for k in kwargs.keys())
        expression_attribute_names = {f"#{k}": k for k in kwargs.keys()}
        expression_attribute_values = {f":{k}": v for k, v in kwargs.items()}

        try:
            response = self.table.update_item(
                Key={self.primary_key_name: primary_key_value},
                UpdateExpression=update_expression,
                ExpressionAttributeNames=expression_attribute_names,
                ExpressionAttributeValues=expression_attribute_values,
                ReturnValues="UPDATED_NEW"
            )
            return response
        except Exception as e:
            logger.error(f"Failed to update item: {e}", exc_info=True)
            return None

    def delete_item(self, primary_key_value):
        """
        Delete an item from the table.
        :param primary_key_value: str, the primary key.
        """
        try:
            response = self.table.delete_item(Key={self.primary_key_name: primary_key_value})
            return response
        except Exception as e:
            logger.error(f"Failed to delete item: {e}", exc_info=True)
            return None