from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
)

from sqlalchemy.orm import relationship

from .database import Base


class Juego(Base):
    __tablename__ = "juegos"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    codigo = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    nombre = Column(
        String(100),
        nullable=False,
    )

    partidas = relationship(
        "Partida",
        back_populates="juego",
        cascade="all, delete-orphan",
    )

    logros = relationship(
        "Logro",
        back_populates="juego",
        cascade="all, delete-orphan",
    )


class Partida(Base):
    __tablename__ = "partidas"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    juego_id = Column(
        Integer,
        ForeignKey("juegos.id"),
        nullable=False,
    )

    puntuacion = Column(
        Integer,
        default=0,
        nullable=False,
    )

    duracion_segundos = Column(
        Integer,
        default=0,
        nullable=False,
    )

    fecha = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    juego = relationship(
        "Juego",
        back_populates="partidas",
    )


class Logro(Base):
    __tablename__ = "logros"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    juego_id = Column(
        Integer,
        ForeignKey("juegos.id"),
        nullable=False,
    )

    codigo = Column(
        String(100),
        unique=True,
        nullable=False,
    )

    nombre = Column(
        String(120),
        nullable=False,
    )

    descripcion = Column(
        String(255),
        nullable=False,
    )

    tipo_objetivo = Column(
        String(50),
        nullable=False,
    )

    valor_objetivo = Column(
        Integer,
        nullable=False,
    )

    desbloqueado = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    fecha_desbloqueo = Column(
        DateTime,
        nullable=True,
    )

    juego = relationship(
        "Juego",
        back_populates="logros",
    )