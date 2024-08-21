from fastapi import FastAPI, Request
from starlette.responses import Response, FileResponse
from starlette.types import ASGIApp, Receive, Scope, Send
import os

import logging
logger = logging.getLogger(__name__)

from CONFIG import settings

class MockMiddleware:
    def __init__(self, app: ASGIApp, mock_directory: str = "mock_responses"):
        self.app = app
        self.mock_directory = mock_directory
        os.makedirs(self.mock_directory, exist_ok=True)

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope["type"] == "http":
            request = Request(scope, receive)
            mock_path = self._get_mock_path(request)

            if settings.API_MODE == "record":
                logger.info(f"Recording API response to {mock_path}")
                original_send = send
                response_body = []

                async def send_wrapper(message):
                    if message["type"] == "http.response.body":
                        response_body.append(message.get("body", b""))
                    await original_send(message)

                await self.app(scope, receive, send_wrapper)

                with open(mock_path, "wb") as mock_file:
                    mock_file.write(b"".join(response_body))
                return

            elif settings.API_MODE == "mock" and os.path.exists(mock_path):
                logger.info(f"Serving mock response from {mock_path}")
                response = FileResponse(mock_path, media_type="application/json")
                await response(scope, receive, send)
                return

        await self.app(scope, receive, send)

    def _get_mock_path(self, request: Request) -> str:
        mock_filename = request.url.path.lstrip("/").replace("/", "_") + ".json"
        return os.path.join(self.mock_directory, mock_filename)