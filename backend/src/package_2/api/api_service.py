import aiohttp
from src.core.logger import get_logger

logger = get_logger(__name__)

class AsyncAPIService:
    def __init__(self, base_url: str):
        self.base_url = base_url

    async def _send_request(self, url, data, name):
        try:
            # Log the request before sending
            self._log_request(url, data, name)

            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=data.model_dump()) as response:
                    logger.info(f"Request {name} sent to {url}")
                    if response.status == 200:
                        logger.info(f"Request {name} sent successfully")
                        return {"success": True}
                    logger.error(f"Request {name} failed with status code {response.status}")
                    return {"success": False}
        except Exception as e:
            logger.error(f"An exception occurred in {__name__}")
            logger.exception(e)
            return {"success": False}

    async def book_appointment(self, data: BookAppointmentRequest):
        url = f"{self.base_url}/api/book_appointment"
        return await self._send_request(url, data, "book_appointment")
        
    async def find_asc_hour(self, data: FindASCHourRequest):
        url = f"{self.base_url}/api/find_asc_hour"
        return await self._send_request(url, data, "find_asc_hour")
        
    async def provide_asc_hour(self, data: ProvideASCHourRequest):
        url = f"{self.base_url}/api/provide_asc_hour"
        return await self._send_request(url, data, "provide_asc_hour")

    def _log_request(self, url, data, name):
        logger.info(f"Sending {name} request to {url} with data: {data}")