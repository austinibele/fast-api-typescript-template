import pytest
import asyncio
from src.manager.models.api_models import BookAppointmentRequest, FindASCHourRequest, ProvideASCHourRequest
from src.manager.notifier import Notifier

@pytest.fixture
def booking_requests():
    return [
        BookAppointmentRequest(email="user1@example.com", host="http://localhost:8000"),
        BookAppointmentRequest(email="user2@example.com", host="http://localhost:8000")
    ]

@pytest.fixture
def find_asc_times_requests():
    return [
        FindASCHourRequest(email="user3@example.com", host="http://localhost:8000"),
        FindASCHourRequest(email="user4@example.com", host="http://localhost:8000")
    ]

@pytest.fixture
def provide_asc_times_requests():
    return [
        ProvideASCHourRequest(email="user5@example.com", host="http://localhost:8000"),
        ProvideASCHourRequest(email="user6@example.com", host="http://localhost:8000")
    ]

@pytest.mark.asyncio
async def test_send_all_notifications(booking_requests, find_asc_times_requests, provide_asc_times_requests):
    notifier = Notifier(
        booking_requests=booking_requests,
        find_asc_times_requests=find_asc_times_requests,
        provide_asc_times_requests=provide_asc_times_requests
    )
    await notifier.send_all_notifications()