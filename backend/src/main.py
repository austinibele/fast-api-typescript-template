from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from src.botnet.routers import user_router as user


from src.middleware.mock_middleware import MockMiddleware
from src.middleware.request_logger import SaveRequestMiddleware
from src.core.security import setup_cors

from src.core.logger import get_logger

logger = get_logger(__name__)

app = FastAPI()
app.add_middleware(MockMiddleware)
app.add_middleware(SaveRequestMiddleware)

# Health check endpoint
@app.get("/", status_code=200)
async def health_check():
    return JSONResponse(content={"message": "healthy"})


# ---------------------------------------------------------------------------------
# UI API
# ---------------------------------------------------------------------------------

app.include_router(user.router, prefix="/api/user", tags=["user"])


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    # Log the error details
    logger.error(f"Validation error: {exc.errors()}", exc_info=True)
    return JSONResponse(
        status_code=400,
        content={"detail": 'An unknown error occurred'},
    )

setup_cors(app)