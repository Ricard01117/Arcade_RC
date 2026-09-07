from datetime import datetime

from sqlalchemy import func
from sqlalchemy.orm import Session

from .models import Juego, Logro, Partida


def obtener_juego(
    db: Session,
    codigo: str,
):
    return (
        db.query(Juego)
        .filter(
            Juego.codigo == codigo
        )
        .first()
    )


def obtener_partida(
    db: Session,
    partida_id: int,
):
    return (
        db.query(Partida)
        .filter(
            Partida.id == partida_id
        )
        .first()
    )


def obtener_estadistica_juego(
    db: Session,
    juego: Juego,
):
    partidas = (
        db.query(func.count(Partida.id))
        .filter(
            Partida.juego_id
            == juego.id
        )
        .scalar()
        or 0
    )

    record = (
        db.query(
            func.max(
                Partida.puntuacion
            )
        )
        .filter(
            Partida.juego_id
            == juego.id
        )
        .scalar()
        or 0
    )

    tiempo_segundos = (
        db.query(
            func.sum(
                Partida.duracion_segundos
            )
        )
        .filter(
            Partida.juego_id
            == juego.id
        )
        .scalar()
        or 0
    )

    logros = (
        db.query(
            func.count(Logro.id)
        )
        .filter(
            Logro.juego_id
            == juego.id,
            Logro.desbloqueado
            == True,
        )
        .scalar()
        or 0
    )

    return {
        "codigo": juego.codigo,
        "nombre": juego.nombre,
        "partidas": partidas,
        "logros": logros,
        "record": record,
        "tiempo_segundos": tiempo_segundos,
        "tiempo_minutos": round(
            tiempo_segundos / 60
        ),
    }


def revisar_logros(
    db: Session,
    juego: Juego,
):
    estadistica = (
        obtener_estadistica_juego(
            db,
            juego,
        )
    )

    logros = (
        db.query(Logro)
        .filter(
            Logro.juego_id
            == juego.id,
            Logro.desbloqueado
            == False,
        )
        .all()
    )

    nuevos = []

    for logro in logros:
        logrado = False

        if (
            logro.tipo_objetivo
            == "partidas"
        ):
            logrado = (
                estadistica[
                    "partidas"
                ]
                >= logro.valor_objetivo
            )

        if (
            logro.tipo_objetivo
            == "record"
        ):
            logrado = (
                estadistica[
                    "record"
                ]
                >= logro.valor_objetivo
            )

        if logrado:
            logro.desbloqueado = True

            logro.fecha_desbloqueo = (
                datetime.utcnow()
            )

            nuevos.append(
                logro.nombre
            )

    if nuevos:
        db.commit()

    return nuevos


def iniciar_partida(
    db: Session,
    codigo_juego: str,
):
    juego = obtener_juego(
        db,
        codigo_juego,
    )

    if juego is None:
        return None

    partida = Partida(
        juego_id=juego.id,
        puntuacion=0,
        duracion_segundos=0,
    )

    db.add(partida)

    db.commit()

    db.refresh(partida)

    return partida


def actualizar_partida(
    db: Session,
    partida_id: int,
    puntuacion: int,
    duracion_segundos: int,
):
    partida = obtener_partida(
        db,
        partida_id,
    )

    if partida is None:
        return None

    partida.puntuacion = max(
        partida.puntuacion,
        puntuacion,
    )

    partida.duracion_segundos = max(
        partida.duracion_segundos,
        duracion_segundos,
    )

    db.commit()

    db.refresh(partida)

    return partida


def finalizar_partida(
    db: Session,
    partida_id: int,
    puntuacion: int,
    duracion_segundos: int,
):
    partida = actualizar_partida(
        db=db,
        partida_id=partida_id,
        puntuacion=puntuacion,
        duracion_segundos=duracion_segundos,
    )

    if partida is None:
        return None

    juego = (
        db.query(Juego)
        .filter(
            Juego.id
            == partida.juego_id
        )
        .first()
    )

    nuevos_logros = revisar_logros(
        db,
        juego,
    )

    estadistica = (
        obtener_estadistica_juego(
            db,
            juego,
        )
    )

    return {
        "mensaje":
            "Partida finalizada correctamente",

        "codigo_juego":
            juego.codigo,

        "puntuacion":
            partida.puntuacion,

        "record":
            estadistica["record"],

        "partidas":
            estadistica["partidas"],

        "logros_nuevos":
            nuevos_logros,
    }


def registrar_partida(
    db: Session,
    codigo_juego: str,
    puntuacion: int,
    duracion_segundos: int,
):
    partida = iniciar_partida(
        db,
        codigo_juego,
    )

    if partida is None:
        return None

    return finalizar_partida(
        db=db,
        partida_id=partida.id,
        puntuacion=puntuacion,
        duracion_segundos=duracion_segundos,
    )