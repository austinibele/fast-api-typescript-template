import pytest
# from moto import mock_aws

from src.core.repository.dynamo_repo import DynamoRepo

from CONFIG import settings

@pytest.fixture
def repo():
    return DynamoRepo(settings.PRIMARY_KEY_NAME, settings.MACHINE_TABLE_NAME)

TEST_EMAIL = "test@user.com"
TEST_ID = "123"

@pytest.mark.skip(reason="Uses deleted machine table")
def test_create_item(repo):
    item = {
        "email": TEST_EMAIL,
        "id": TEST_ID,
        "host": "",
        "vm_status": "",
        "bot_status": "inactive",
    }
    
    response = repo.create_item(**item)
    assert response['ResponseMetadata']['HTTPStatusCode'] == 200
    assert repo.get_item(TEST_EMAIL)['id'] == TEST_ID

@pytest.mark.skip(reason="Uses deleted machine table")
def test_get_item(repo):
    item = repo.get_item(TEST_EMAIL)
    assert item['id'] == TEST_ID

@pytest.mark.skip(reason="Uses deleted machine table")
def test_update_item(repo):
    response = repo.update_item(TEST_EMAIL, id='999')
    assert response['ResponseMetadata']['HTTPStatusCode'] == 200
    assert repo.get_item(TEST_EMAIL)['id'] == '999'

@pytest.mark.skip(reason="Uses deleted machine table")
def test_delete_item(repo):
    response = repo.delete_item(TEST_EMAIL)
    assert response['ResponseMetadata']['HTTPStatusCode'] == 200
    assert repo.get_item(TEST_EMAIL) is None
