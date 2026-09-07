from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from .models import Juego, Logro, Partida


# =========================================================
# JUEGOS BASE
# =========================================================

JUEGOS = [
    {
        "codigo": "viborita",
        "nombre": "Viborita",
    },
    {
        "codigo": "disparos",
        "nombre": "Disparos Espaciales",
    },
    {
        "codigo": "bloques",
        "nombre": "Rompe Bloques",
    },
    {
        "codigo": "pong",
        "nombre": "Pong",
    },
]


# =========================================================
# LOGROS BASE
# =========================================================

LOGROS_BASE = [
    {
        "codigo": "primera_partida",
        "nombre": "Primer paso",
        "descripcion": "Completa tu primera partida.",
        "tipo_objetivo": "partidas",
        "valor_objetivo": 1,
    },
    {
        "codigo": "diez_partidas",
        "nombre": "Jugador frecuente",
        "descripcion": "Completa 10 partidas.",
        "tipo_objetivo": "partidas",
        "valor_objetivo": 10,
    },
    {
        "codigo": "cien_puntos",
        "nombre": "100 puntos",
        "descripcion": "Consigue al menos 100 puntos.",
        "tipo_objetivo": "puntuacion",
        "valor_objetivo": 100,
    },
    {
        "codigo": "quinientos_puntos",
        "nombre": "500 puntos",
        "descripcion": "Consigue al menos 500 puntos.",
        "tipo_objetivo": "puntuacion",
        "valor_objetivo": 500,
    },
    {
        "codigo": "mil_puntos",
        "nombre": "1000 puntos",
        "descripcion": "Consigue al menos 1000 puntos.",
        "tipo_objetivo": "puntuacion",
        "valor_objetivo": 1000,
    },
]


# =========================================================
# PARTIDAS DEMO
#
# Estos datos sirven para que las gráficas no aparezcan
# completamente vacías al instalar Arcade_RC por primera vez.
#
# Formato:
# (puntuación, duración_en_segundos)
# =========================================================

PARTIDAS_DEMO = {
    "viborita": [
        (120, 75),
        (180, 92),
        (260, 110),
        (340, 86),
    ],

    "disparos": [
        (240, 128),
        (410, 156),
        (560, 185),
        (720, 204),
        (890, 173),
    ],

    "bloques": [
        (350, 142),
        (580, 174),
        (820, 215),
        (1050, 246),
    ],

    "pong": [
        (450, 98),
        (650, 121),
        (800, 138),
        (950, 146),
    ],
}


# =========================================================
# CREAR JUEGOS
# =========================================================

def crear_juegos(db: Session):
    for datos in JUEGOS:

        existente = (
            db.query(Juego)
            .filter(
                Juego.codigo
                == datos["codigo"]
            )
            .first()
        )

        if existente:
            continue

        db.add(
            Juego(
                codigo=datos["codigo"],
                nombre=datos["nombre"],
            )
        )

    db.commit()


# =========================================================
# CREAR LOGROS
# =========================================================

def crear_logros(db: Session):

    juegos = (
        db.query(Juego)
        .all()
    )

    for juego in juegos:

        for logro_base in LOGROS_BASE:

            codigo_completo = (
                f"{juego.codigo}_"
                f"{logro_base['codigo']}"
            )

            existente = (
                db.query(Logro)
                .filter(
                    Logro.codigo
                    == codigo_completo
                )
                .first()
            )

            if existente:
                continue

            logro = Logro(
                juego_id=juego.id,

                codigo=codigo_completo,

                nombre=logro_base[
                    "nombre"
                ],

                descripcion=logro_base[
                    "descripcion"
                ],

                tipo_objetivo=logro_base[
                    "tipo_objetivo"
                ],

                valor_objetivo=logro_base[
                    "valor_objetivo"
                ],

                desbloqueado=False,

                fecha_desbloqueo=None,
            )

            db.add(logro)

    db.commit()


# =========================================================
# CREAR PARTIDAS DEMO
# =========================================================

def crear_partidas_demo(db: Session):

    """
    Las partidas iniciales SOLO se crean
    cuando la tabla de partidas está vacía.

    Por lo tanto:

    Primera ejecución:
        crea datos iniciales.

    Ejecuciones siguientes:
        NO vuelve a crear esos datos.

    Las partidas reales simplemente se
    acumulan sobre las existentes.
    """

    total_partidas = (
        db.query(Partida)
        .count()
    )

    if total_partidas > 0:
        return


    juegos = {
        juego.codigo: juego
        for juego
        in db.query(Juego).all()
    }


    fecha_actual = (
        datetime.utcnow()
    )


    contador = 0


    for (
        codigo_juego,
        partidas
    ) in PARTIDAS_DEMO.items():

        juego = juegos.get(
            codigo_juego
        )

        if not juego:
            continue


        for (
            puntuacion,
            duracion
        ) in partidas:

            contador += 1


            partida = Partida(
                juego_id=juego.id,

                puntuacion=puntuacion,

                duracion_segundos=duracion,

                fecha=(
                    fecha_actual
                    - timedelta(
                        days=contador
                    )
                ),
            )

            db.add(partida)


    db.commit()


# =========================================================
# DESBLOQUEAR LOGROS SEGÚN LOS DATOS EXISTENTES
# =========================================================

def actualizar_logros_iniciales(
    db: Session,
):

    juegos = (
        db.query(Juego)
        .all()
    )


    for juego in juegos:

        partidas = (
            db.query(Partida)
            .filter(
                Partida.juego_id
                == juego.id
            )
            .all()
        )


        cantidad_partidas = len(
            partidas
        )


        mejor_puntuacion = max(
            (
                partida.puntuacion
                for partida
                in partidas
            ),
            default=0,
        )


        logros = (
            db.query(Logro)
            .filter(
                Logro.juego_id
                == juego.id
            )
            .all()
        )


        for logro in logros:

            cumplido = False


            if (
                logro.tipo_objetivo
                == "partidas"
            ):

                cumplido = (
                    cantidad_partidas
                    >= logro.valor_objetivo
                )


            elif (
                logro.tipo_objetivo
                == "puntuacion"
            ):

                cumplido = (
                    mejor_puntuacion
                    >= logro.valor_objetivo
                )


            if (
                cumplido
                and
                not logro.desbloqueado
            ):

                logro.desbloqueado = True

                logro.fecha_desbloqueo = (
                    datetime.utcnow()
                )


    db.commit()


# =========================================================
# FUNCIÓN PRINCIPAL
#
# ESTE ES EL NOMBRE QUE main.py ESTÁ IMPORTANDO.
# =========================================================

def cargar_datos_iniciales(
    db: Session,
):

    crear_juegos(db)

    crear_logros(db)

    crear_partidas_demo(db)

    actualizar_logros_iniciales(
        db
    )


# =========================================================
# ALIAS
#
# Lo dejamos para compatibilidad con cualquier código
# anterior que utilice sembrar_datos().
# =========================================================

def sembrar_datos(
    db: Session,
):

    cargar_datos_iniciales(
        db
    )