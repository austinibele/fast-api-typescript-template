# session_manager.py
from contextlib import contextmanager
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from src.repository.engine import get_engine

class SessionManager:
    def __init__(self):
        self.engine = get_engine()
        self.Session = sessionmaker(bind=self.engine)

    @contextmanager
    def session_scope(self):
        """Provide a transactional scope around a series of operations."""
        session = self.Session(expire_on_commit=False)
        try:
            yield session
            session.commit()
        except SQLAlchemyError as e:
            session.rollback()
            raise e
        finally:
            session.expunge_all()
            session.close()