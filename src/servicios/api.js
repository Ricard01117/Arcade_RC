const API_URL = (
  import.meta.env
    .VITE_API_URL ||
  ""
).replace(
  /\/$/,
  ""
);


async function peticion(
  ruta,
  opciones = {}
) {
  const respuesta =
    await fetch(
      `${API_URL}${ruta}`,
      {
        headers: {
          "Content-Type":
            "application/json",

          ...opciones.headers,
        },

        ...opciones,
      }
    );


  if (!respuesta.ok) {
    const error =
      await respuesta
        .json()
        .catch(
          () => ({})
        );


    throw new Error(
      error.detail ||
        "Error comunicando con el backend"
    );
  }


  return respuesta.json();
}


/*
=====================================
COMPROBAR SERVIDOR

Se utiliza solamente cuando
Arcade_RC inicia.

Sirve para despertar Render
si estaba suspendido.
=====================================
*/

export function comprobarServidor() {
  return peticion(
    "/api/salud"
  );
}


/*
=====================================
ESTADISTICAS
=====================================
*/

export function obtenerEstadisticas() {
  return peticion(
    "/api/estadisticas"
  );
}


/*
=====================================
LOGROS
=====================================
*/

export function obtenerLogros() {
  return peticion(
    "/api/logros"
  );
}


/*
=====================================
INICIAR PARTIDA
=====================================
*/

export function iniciarPartida(
  codigoJuego
) {
  return peticion(
    "/api/partidas/iniciar",

    {
      method:
        "POST",

      body:
        JSON.stringify({
          codigo_juego:
            codigoJuego,
        }),
    }
  );
}


/*
=====================================
ACTUALIZAR PARTIDA
=====================================
*/

export function actualizarPartida(
  partidaId,
  puntuacion,
  duracionSegundos
) {
  return peticion(
    `/api/partidas/${partidaId}/progreso`,

    {
      method:
        "PUT",

      body:
        JSON.stringify({
          puntuacion,

          duracion_segundos:
            duracionSegundos,
        }),
    }
  );
}


/*
=====================================
FINALIZAR PARTIDA
=====================================
*/

export function finalizarPartida(
  partidaId,
  puntuacion,
  duracionSegundos
) {
  return peticion(
    `/api/partidas/${partidaId}/finalizar`,

    {
      method:
        "POST",

      body:
        JSON.stringify({
          puntuacion,

          duracion_segundos:
            duracionSegundos,
        }),
    }
  );
}