from sqlalchemy import Column, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Passport(Base):
    __tablename__ = 'passport'

    user_id = Column(String(), primary_key=True)
    passport_b64 = Column(String(), nullable=False)
