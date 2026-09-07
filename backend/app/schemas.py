from datetime import datetime

from pydantic import BaseModel, Field


class PartidaCrear(BaseModel):
    codigo_juego: str

    puntuacion: int = Field(
        default=0,
        ge=0,
    )

    duracion_segundos: int = Field(
        default=0,
        ge=0,
    )


class PartidaIniciar(BaseModel):
    codigo_juego: str


class PartidaProgreso(BaseModel):
    puntuacion: int = Field(
        default=0,
        ge=0,
    )

    duracion_segundos: int = Field(
        default=0,
        ge=0,
    )


class PartidaIniciadaRespuesta(BaseModel):
    partida_id: int
    codigo_juego: str
    mensaje: str


class JuegoRespuesta(BaseModel):
    codigo: str
    nombre: str


class EstadisticaJuegoRespuesta(BaseModel):
    codigo: str
    nombre: str

    partidas: int
    logros: int

    record: int

    tiempo_segundos: int
    tiempo_minutos: int


class LogroRespuesta(BaseModel):
    codigo: str
    juego: str
    nombre: str
    descripcion: str

    desbloqueado: bool

    fecha_desbloqueo: datetime | None


class ResultadoPartidaRespuesta(BaseModel):
    mensaje: str

    codigo_juego: str

    puntuacion: int

    record: int

    partidas: int

    logros_nuevos: list[str]