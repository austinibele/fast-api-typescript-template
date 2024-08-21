from sqlalchemy import create_engine

from CONFIG import settings

def get_engine():
    return create_engine(
        f"postgresql+psycopg2://"
        f"{settings.POSTGRES_USER}:"
        f"{settings.POSTGRES_PASSWORD}@"
        f"{settings.DB_HOST}:"
        f"{settings.POSTGRES_PORT}/"
        f"{settings.POSTGRES_DB}"
    )
