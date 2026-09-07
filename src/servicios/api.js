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


export function obtenerEstadisticas() {
  return peticion(
    "/api/estadisticas"
  );
}


export function obtenerLogros() {
  return peticion(
    "/api/logros"
  );
}


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