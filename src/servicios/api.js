const API_URL = (
  import.meta.env
    .VITE_API_URL ||
  ""
).replace(
  /\/$/,
  ""
);


export const EVENTO_ESTADO_SERVIDOR =
  "arcade-rc:estado-servidor";


function notificarEstadoServidor(
  estado,
  solicitudId
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }


  window.dispatchEvent(
    new CustomEvent(
      EVENTO_ESTADO_SERVIDOR,
      {
        detail: {
          estado,
          solicitudId,
        },
      }
    )
  );
}


function esperar(
  milisegundos
) {
  return new Promise(
    (resolver) => {
      window.setTimeout(
        resolver,
        milisegundos
      );
    }
  );
}


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


export async function iniciarPartida(
  codigoJuego
) {
  const solicitudId =
    `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;


  let esperaVisible =
    false;


  let temporizadorEspera =
    null;


  /*
  Si el servidor responde rápido,
  nunca mostramos la pantalla.

  Si tarda más de 600 ms,
  asumimos que Render puede estar
  despertando y avisamos al usuario.
  */
  if (
    typeof window !==
    "undefined"
  ) {
    temporizadorEspera =
      window.setTimeout(
        () => {
          esperaVisible =
            true;


          notificarEstadoServidor(
            "conectando",
            solicitudId
          );
        },
        600
      );
  }


  try {
    const respuesta =
      await peticion(
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


    if (
      temporizadorEspera
    ) {
      window.clearTimeout(
        temporizadorEspera
      );
    }


    /*
    Solo enseñamos "conectado"
    si realmente apareció antes
    la pantalla de espera.
    */
    if (
      esperaVisible
    ) {
      notificarEstadoServidor(
        "conectado",
        solicitudId
      );


      /*
      Pequeña pausa visual para
      que el usuario alcance a ver
      que el servidor respondió.
      */
      await esperar(
        700
      );
    }


    return respuesta;
  } catch (error) {
    if (
      temporizadorEspera
    ) {
      window.clearTimeout(
        temporizadorEspera
      );
    }


    if (
      esperaVisible
    ) {
      notificarEstadoServidor(
        "error",
        solicitudId
      );


      await esperar(
        1200
      );
    }


    throw error;
  }
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