import pytest
import requests_mock
from src.manager.models.api_models import BookAppointmentRequest, FindASCHourRequest, ProvideASCHourRequest
from src.manager.api.bot_api_service import AsyncBotAPIService

@pytest.fixture
def booking_request():
    return BookAppointmentRequest(email="user1@example.com", host="http://localhost:8000")

@pytest.fixture
def find_asc_times_request():
    return FindASCHourRequest(email="user2@example.com", host="http://localhost:8000")

@pytest.fixture
def provide_asc_times_request():
    return ProvideASCHourRequest(email="user3@example.com", host="http://localhost:8000")

@pytest.mark.asyncio
async def test_book_appointment(booking_request):
    with requests_mock.Mocker() as m:
        m.post("http://localhost:8000/api/book_appointment", json={"success": True})
        bot_api_service = AsyncBotAPIService(base_url=booking_request.host)
        response = await bot_api_service.book_appointment(booking_request)
        assert response["success"] is True

@pytest.mark.asyncio
async def test_find_asc_hour(find_asc_times_request):
    with requests_mock.Mocker() as m:
        m.post("http://localhost:8000/api/find_asc_hour", json={"success": True})
        bot_api_service = AsyncBotAPIService(base_url=find_asc_times_request.host)
        response = await bot_api_service.find_asc_hour(find_asc_times_request)
        assert response["success"] is True

@pytest.mark.asyncio
async def test_provide_asc_hour(provide_asc_times_request):
    with requests_mock.Mocker() as m:
        m.post("http://localhost:8000/api/provide_asc_hour", json={"success": True})
        bot_api_service = AsyncBotAPIService(base_url=provide_asc_times_request.host)
        response = await bot_api_service.provide_asc_hour(provide_asc_times_request)
        assert response["success"] is True