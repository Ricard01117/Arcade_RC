import os

from fastapi import (
    Depends,
    FastAPI,
    HTTPException,
)

from fastapi.middleware.cors import (
    CORSMiddleware,
)

from sqlalchemy.orm import Session

from .database import (
    Base,
    SessionLocal,
    engine,
    obtener_base_datos,
)

from .models import (
    Juego,
    Logro,
)

from .schemas import (
    EstadisticaJuegoRespuesta,
    JuegoRespuesta,
    LogroRespuesta,
    PartidaCrear,
    PartidaIniciar,
    PartidaIniciadaRespuesta,
    PartidaProgreso,
    ResultadoPartidaRespuesta,
)

from .seed import (
    cargar_datos_iniciales,
)

from .services import (
    actualizar_partida,
    finalizar_partida,
    iniciar_partida,
    obtener_estadistica_juego,
    registrar_partida,
)


# =========================================================
# CREAR TABLAS
# =========================================================

Base.metadata.create_all(
    bind=engine
)


# =========================================================
# DATOS INICIALES
#
# seed.py ya comprueba si existen partidas.
# No duplica los datos cada vez que arranca.
# =========================================================

with SessionLocal() as db:
    cargar_datos_iniciales(
        db
    )


# =========================================================
# FASTAPI
# =========================================================

app = FastAPI(
    title="Arcade_RC API",

    version="2.1.0",

    description=(
        "Backend público de juegos, "
        "partidas, estadísticas y logros "
        "de Arcade_RC."
    ),
)


# =========================================================
# CORS
# =========================================================

FRONTEND_ORIGIN = os.getenv(
    "FRONTEND_ORIGIN",
    "https://ricard01117.github.io",
).rstrip("/")


ORIGENES_PERMITIDOS = [
    "http://localhost:5173",

    "http://127.0.0.1:5173",

    FRONTEND_ORIGIN,
]


app.add_middleware(
    CORSMiddleware,

    allow_origins=(
        ORIGENES_PERMITIDOS
    ),

    allow_origin_regex=(
        r"http://"
        r"(localhost|127\.0\.0\.1)"
        r":\d+"
    ),

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =========================================================
# RAÍZ
# =========================================================

@app.get("/")
def raiz():
    return {
        "proyecto":
            "Arcade_RC",

        "version":
            "2.1.0",

        "backend":
            "FastAPI",

        "base_datos":
            "PostgreSQL / SQLite",

        "estado":
            "activo",
    }


# =========================================================
# SALUD
# =========================================================

@app.get("/api/salud")
def salud():
    return {
        "ok": True,

        "mensaje":
            "Backend funcionando",
    }


# =========================================================
# JUEGOS
# =========================================================

@app.get(
    "/api/juegos",

    response_model=list[
        JuegoRespuesta
    ],
)
def listar_juegos(
    db: Session = Depends(
        obtener_base_datos
    ),
):
    return (
        db.query(Juego)
        .order_by(
            Juego.id
        )
        .all()
    )


# =========================================================
# PARTIDA LEGACY
# =========================================================

@app.post(
    "/api/partidas",

    response_model=(
        ResultadoPartidaRespuesta
    ),
)
def crear_partida_legacy(
    datos: PartidaCrear,

    db: Session = Depends(
        obtener_base_datos
    ),
):
    resultado = registrar_partida(
        db=db,

        codigo_juego=(
            datos.codigo_juego
        ),

        puntuacion=(
            datos.puntuacion
        ),

        duracion_segundos=(
            datos.duracion_segundos
        ),
    )


    if resultado is None:
        raise HTTPException(
            status_code=404,

            detail=(
                "Juego no encontrado"
            ),
        )


    return resultado


# =========================================================
# INICIAR PARTIDA
# =========================================================

@app.post(
    "/api/partidas/iniciar",

    response_model=(
        PartidaIniciadaRespuesta
    ),
)
def iniciar_sesion_partida(
    datos: PartidaIniciar,

    db: Session = Depends(
        obtener_base_datos
    ),
):
    partida = iniciar_partida(
        db,

        datos.codigo_juego,
    )


    if partida is None:
        raise HTTPException(
            status_code=404,

            detail=(
                "Juego no encontrado"
            ),
        )


    return {
        "partida_id":
            partida.id,

        "codigo_juego":
            datos.codigo_juego,

        "mensaje":
            "Partida iniciada",
    }


# =========================================================
# ACTUALIZAR PARTIDA EN VIVO
# =========================================================

@app.put(
    "/api/partidas/"
    "{partida_id}/progreso"
)
def progreso_partida(
    partida_id: int,

    datos: PartidaProgreso,

    db: Session = Depends(
        obtener_base_datos
    ),
):
    partida = actualizar_partida(
        db=db,

        partida_id=(
            partida_id
        ),

        puntuacion=(
            datos.puntuacion
        ),

        duracion_segundos=(
            datos.duracion_segundos
        ),
    )


    if partida is None:
        raise HTTPException(
            status_code=404,

            detail=(
                "Partida no encontrada"
            ),
        )


    return {
        "ok": True,

        "partida_id":
            partida.id,

        "puntuacion":
            partida.puntuacion,

        "duracion_segundos":
            partida
            .duracion_segundos,
    }


# =========================================================
# FINALIZAR PARTIDA
# =========================================================

@app.post(
    "/api/partidas/"
    "{partida_id}/finalizar",

    response_model=(
        ResultadoPartidaRespuesta
    ),
)
def finalizar_sesion_partida(
    partida_id: int,

    datos: PartidaProgreso,

    db: Session = Depends(
        obtener_base_datos
    ),
):
    resultado = finalizar_partida(
        db=db,

        partida_id=(
            partida_id
        ),

        puntuacion=(
            datos.puntuacion
        ),

        duracion_segundos=(
            datos.duracion_segundos
        ),
    )


    if resultado is None:
        raise HTTPException(
            status_code=404,

            detail=(
                "Partida no encontrada"
            ),
        )


    return resultado


# =========================================================
# ESTADÍSTICAS GENERALES
# =========================================================

@app.get(
    "/api/estadisticas",

    response_model=list[
        EstadisticaJuegoRespuesta
    ],
)
def listar_estadisticas(
    db: Session = Depends(
        obtener_base_datos
    ),
):
    juegos = (
        db.query(Juego)

        .order_by(
            Juego.id
        )

        .all()
    )


    return [
        obtener_estadistica_juego(
            db,
            juego,
        )

        for juego
        in juegos
    ]


# =========================================================
# ESTADÍSTICAS POR JUEGO
# =========================================================

@app.get(
    "/api/estadisticas/{codigo}",

    response_model=(
        EstadisticaJuegoRespuesta
    ),
)
def estadisticas_juego(
    codigo: str,

    db: Session = Depends(
        obtener_base_datos
    ),
):
    juego = (
        db.query(Juego)

        .filter(
            Juego.codigo
            == codigo
        )

        .first()
    )


    if juego is None:
        raise HTTPException(
            status_code=404,

            detail=(
                "Juego no encontrado"
            ),
        )


    return (
        obtener_estadistica_juego(
            db,
            juego,
        )
    )


# =========================================================
# LOGROS
# =========================================================

@app.get(
    "/api/logros",

    response_model=list[
        LogroRespuesta
    ],
)
def listar_logros(
    db: Session = Depends(
        obtener_base_datos
    ),
):
    logros = (
        db.query(Logro)

        .order_by(
            Logro.juego_id,
            Logro.id,
        )

        .all()
    )


    return [
        {
            "codigo":
                logro.codigo,

            "juego":
                logro.juego.nombre,

            "nombre":
                logro.nombre,

            "descripcion":
                logro.descripcion,

            "desbloqueado":
                logro.desbloqueado,

            "fecha_desbloqueo":
                logro.fecha_desbloqueo,
        }

        for logro
        in logros
    ]