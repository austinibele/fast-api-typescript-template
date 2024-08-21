from datetime import datetime
from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware, Message
import os
import logging
import json

logger = logging.getLogger(__name__)

from CONFIG import settings

class SaveRequestMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: FastAPI, mock_directory: str = "network/received"):
        super().__init__(app)
        self.mock_directory = mock_directory
        os.makedirs(self.mock_directory, exist_ok=True)

    async def set_body(self, request: Request):
        receive_ = await request._receive()

        async def receive() -> Message:
            return receive_

        request._receive = receive

    async def dispatch(self, request, call_next):
        await self.set_body(request)
        json_body = await request.json()

        if settings.API_MODE != "record":
            response = await call_next(request)
            return response
        
        request_data = {
            "method": request.method,
            "url": str(request.url),
            "headers": dict(request.headers),
            "body": json_body
        }

        mock_path = self._get_mock_path(request)
        logger.info(f"Recording API request to {mock_path}")
        with open(mock_path, "w") as mock_file:
            json.dump(request_data, mock_file, indent=4)

        response = await call_next(request)
        return response

    def _get_mock_path(self, request: Request) -> str:
        current_datetime = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        mock_filename = request.url.path.lstrip("/").replace("/", "_") + "_" + current_datetime + ".json"
        return os.path.join(self.mock_directory, mock_filename)