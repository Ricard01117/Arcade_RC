import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";


const ContextoConfiguracionJuegos =
  createContext();


const CONFIGURACION_INICIAL = {
  pong: {
    dificultad: "medio",

    fondo: "#040713",

    jugador: "#27e7ff",

    cpu: "#ff3f88",

    pelota: "#ffe047",

    lineas: "#713fff",
  },

  viborita: {
    dificultad: "medio",

    fondo: "#050912",

    viborita: "#39ff88",

    cabeza: "#89ffad",

    comida: "#ff4078",
  },

  disparos: {
    dificultad: "medio",

    fondo: "#030713",

    jugador: "#35dcff",

    enemigo: "#ff3f7d",

    especial: "#ffd83f",
  },

  bloques: {
    fondo: "#070816",

    paleta: "#8b5cff",

    pelota: "#ffffff",

    vida: "#39ff88",

    multibola: "#ffd83f",
  },
};


function cargarInicial() {
  const guardado =
    localStorage.getItem(
      "arcade_rc_config_juegos"
    );

  if (!guardado) {
    return CONFIGURACION_INICIAL;
  }

  try {
    const datos =
      JSON.parse(guardado);

    return {
      pong: {
        ...CONFIGURACION_INICIAL.pong,
        ...datos.pong,
      },

      viborita: {
        ...CONFIGURACION_INICIAL.viborita,
        ...datos.viborita,
      },

      disparos: {
        ...CONFIGURACION_INICIAL.disparos,
        ...datos.disparos,
      },

      bloques: {
        ...CONFIGURACION_INICIAL.bloques,
        ...datos.bloques,
      },
    };
  } catch {
    return CONFIGURACION_INICIAL;
  }
}


export function ProveedorConfiguracionJuegos({
  children,
}) {
  const [
    configuracion,
    setConfiguracion,
  ] = useState(
    cargarInicial
  );


  useEffect(() => {
    localStorage.setItem(
      "arcade_rc_config_juegos",
      JSON.stringify(
        configuracion
      )
    );
  }, [configuracion]);


  const actualizar = (
    juego,
    propiedad,
    valor
  ) => {
    setConfiguracion(
      (actual) => ({
        ...actual,

        [juego]: {
          ...actual[juego],

          [propiedad]:
            valor,
        },
      })
    );
  };


  const restablecer = (
    juego
  ) => {
    setConfiguracion(
      (actual) => ({
        ...actual,

        [juego]: {
          ...CONFIGURACION_INICIAL[
            juego
          ],
        },
      })
    );
  };


  return (
    <ContextoConfiguracionJuegos.Provider
      value={{
        configuracion,
        actualizar,
        restablecer,
      }}
    >
      {children}
    </ContextoConfiguracionJuegos.Provider>
  );
}


export function useConfiguracionJuegos() {
  return useContext(
    ContextoConfiguracionJuegos
  );
}