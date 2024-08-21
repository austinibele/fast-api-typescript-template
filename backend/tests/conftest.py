import pytest


@pytest.fixture
def user_data_no_worker():
    return {
        # General
        "service_level": "basic",
        "purchase_date": "2024-07-01",
    }
    