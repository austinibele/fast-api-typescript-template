from typing import Literal, Optional
from pydantic import BaseModel, validator
from datetime import datetime

class User(BaseModel):
    # General
    name: str
    phone_number: str
    service_level: Literal['basic', 'premium']
    purchase_date: str
    # Account
    email: str
    # Metadata
    created_at: str
    last_modified: str

    @validator('purchase_date', 'created_at', 'last_modified', pre=True, always=True)
    def validate_datetime_format(cls, v):
        try:
            datetime.strptime(v, '%Y-%m-%d')
        except ValueError:
            raise ValueError('Datetime must be in YYYY-MM-DD format')
        return v
