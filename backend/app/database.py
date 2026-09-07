import os

from sqlalchemy import create_engine
from sqlalchemy.orm import (
    declarative_base,
    sessionmaker,
)


# =========================================================
# BASE DE DATOS
#
# LOCAL:
#   SQLite
#
# PRODUCCIÓN:
#   PostgreSQL / Supabase mediante DATABASE_URL
# =========================================================

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./arcade_rc.db",
)


# =========================================================
# POSTGRESQL + PSYCOPG
#
# Supabase entrega normalmente:
#
# postgresql://...
#
# SQLAlchemy utilizará psycopg.
# =========================================================

if DATABASE_URL.startswith(
    "postgres://"
):
    DATABASE_URL = DATABASE_URL.replace(
        "postgres://",
        "postgresql+psycopg://",
        1,
    )


elif DATABASE_URL.startswith(
    "postgresql://"
):
    DATABASE_URL = DATABASE_URL.replace(
        "postgresql://",
        "postgresql+psycopg://",
        1,
    )


# =========================================================
# CONFIGURACIÓN DEL MOTOR
# =========================================================

opciones_motor = {
    "pool_pre_ping": True,
}


# SQLite necesita esta opción.
if DATABASE_URL.startswith(
    "sqlite"
):
    opciones_motor[
        "connect_args"
    ] = {
        "check_same_thread": False
    }


engine = create_engine(
    DATABASE_URL,
    **opciones_motor,
)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


Base = declarative_base()


# =========================================================
# DEPENDENCIA FASTAPI
# =========================================================

def obtener_base_datos():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()