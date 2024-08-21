import asyncio
from typing import List
from src.manager.models.api_models import BookAppointmentRequest, FindASCHourRequest, ProvideASCHourRequest
from src.manager.api.bot_api_service import AsyncBotAPIService
from src.manager.utils.logger import get_logger

logger = get_logger(__name__)

class Notifier:
    def __init__(self, 
                 booking_requests: List[BookAppointmentRequest] = None, 
                 find_asc_times_requests: List[FindASCHourRequest] = None, 
                 provide_asc_times_requests: List[ProvideASCHourRequest] = None
                 ):
        self.booking_requests = booking_requests or []
        self.find_asc_times_requests = find_asc_times_requests or []
        self.provide_asc_times_requests = provide_asc_times_requests or []

    async def send_notification(self, request):
        try:
            logger.info("*****************************************************************************")
            logger.info(f"Sending notification for {type(request).__name__} for user with email {request.email}")
            logger.info("*****************************************************************************")
            
            bot_api_service = AsyncBotAPIService(base_url=request.host)
            if isinstance(request, BookAppointmentRequest):
                response = await bot_api_service.book_appointment(request)
            elif isinstance(request, FindASCHourRequest):
                response = await bot_api_service.find_asc_hour(request)
            elif isinstance(request, ProvideASCHourRequest):
                response = await bot_api_service.provide_asc_hour(request)
            else:
                logger.error(f"Unknown request type: {type(request)}")
                return

            # if response.get("success"):
            #     logger.info(f"[SUCCESS] Notification sent successfully for user {request.email}")
            # else:
            #     logger.error(f"[FAILURE] Failed to send notification for user {request.email}")
        except Exception as e:
            logger.error(f"Failed to send notification for user {request.email}")
            logger.exception(e)

    async def send_all_notifications(self):
        all_requests = self.booking_requests + self.find_asc_times_requests + self.provide_asc_times_requests
        await asyncio.gather(*(self.send_notification(request) for request in all_requests))