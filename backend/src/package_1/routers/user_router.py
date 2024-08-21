from fastapi import APIRouter, HTTPException, status

from src.botnet.models.user_models import User
from src.botnet.services.user.user_service import UserService

user_service = UserService()

router = APIRouter()

@router.get("/", response_model=list[User], operation_id="get_users")
async def get_users():
    users = user_service.get_users()
    return users

@router.get("/{email}", response_model=User, operation_id="get_user")
async def get_user(email: str):
    user = await user_service.get_user(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user 

@router.delete("/{email}", status_code=status.HTTP_204_NO_CONTENT, operation_id="delete_user")
async def delete_user(email: str):
    response = user_service.delete_user(email)
    status_code = response["ResponseMetadata"]["HTTPStatusCode"]
    if status_code != 200:
        raise HTTPException(status_code=status_code, detail="Error deleting user")
    return {"message": "User deleted"}

@router.post("/create", status_code=status.HTTP_201_CREATED, operation_id="create_user")
async def create_user(user: User):
    response = user_service.create_user(user)
    status_code = response["ResponseMetadata"]["HTTPStatusCode"]
    if status_code != 200:
        raise HTTPException(status_code=status_code, detail="Error creating user")
    return {"message": "User created"}

@router.post("/{email}/update", status_code=status.HTTP_202_ACCEPTED, operation_id="update_user")
async def update_user(user: User):
    response = user_service.update_user(user)
    status_code = response["ResponseMetadata"]["HTTPStatusCode"]
    if status_code != 200:
        raise HTTPException(status_code=status_code, detail="Error updating user")
    return {"message": "User updated"}
