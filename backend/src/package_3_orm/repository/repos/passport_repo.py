from src.session_manager import SessionManager
from src.repository.models.passport_table import Passport

class PassportRepo:
    def __init__(self):
        self.session_manager = SessionManager()

    def get_passport(self, user_id):
        with self.session_manager.session_scope() as session:
            res = session.query(Passport).filter(Passport.user_id == user_id).first()
            if res:
                return res.passport_b64
            else:
                return None
    
    def add_passport(self, user_id, passport_b64):
        passport = Passport(user_id=user_id, passport_b64=passport_b64)
        self.delete_passport(user_id) # Delete any existing passport for this user
        with self.session_manager.session_scope() as session:
            session.add(passport)
            
    def delete_passport(self, user_id):
        with self.session_manager.session_scope() as session:
            session.query(Passport).filter(Passport.user_id == user_id).delete()
