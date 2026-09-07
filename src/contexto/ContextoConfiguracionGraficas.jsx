import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";


const ContextoConfiguracionGraficas =
  createContext(null);


const CLAVE_STORAGE =
  "arcade_rc_configuracion_graficas";


export const CONFIGURACION_GRAFICAS_PREDETERMINADA = {
  paleta: "tema",

  tipos: {
    partidas: "barras",
    logros: "pastel",
    record: "linea",
    tiempo: "barras",
  },

  orientaciones: {
    partidas: "vertical",
    logros: "vertical",
    record: "vertical",
    tiempo: "horizontal",
  },
};


function copiarPredeterminada() {
  return {
    paleta:
      CONFIGURACION_GRAFICAS_PREDETERMINADA.paleta,

    tipos: {
      ...CONFIGURACION_GRAFICAS_PREDETERMINADA.tipos,
    },

    orientaciones: {
      ...CONFIGURACION_GRAFICAS_PREDETERMINADA.orientaciones,
    },
  };
}


function normalizarConfiguracion(
  configuracion
) {
  const base =
    copiarPredeterminada();


  if (
    !configuracion ||
    typeof configuracion !==
      "object"
  ) {
    return base;
  }


  const tipos =
    configuracion.tipos ||
    {};


  const orientaciones =
    configuracion.orientaciones ||
    {};


  return {
    paleta:
      configuracion.paleta ||
      base.paleta,

    tipos: {
      partidas:
        tipos.partidas ||
        configuracion.partidas?.tipo ||
        base.tipos.partidas,

      logros:
        tipos.logros ||
        configuracion.logros?.tipo ||
        base.tipos.logros,

      record:
        tipos.record ||
        configuracion.record?.tipo ||
        base.tipos.record,

      tiempo:
        tipos.tiempo ||
        configuracion.tiempo?.tipo ||
        base.tipos.tiempo,
    },

    orientaciones: {
      partidas:
        orientaciones.partidas ||
        configuracion.partidas?.orientacion ||
        base.orientaciones.partidas,

      logros:
        orientaciones.logros ||
        configuracion.logros?.orientacion ||
        base.orientaciones.logros,

      record:
        orientaciones.record ||
        configuracion.record?.orientacion ||
        base.orientaciones.record,

      tiempo:
        orientaciones.tiempo ||
        configuracion.tiempo?.orientacion ||
        base.orientaciones.tiempo,
    },
  };
}


function cargarStorage() {
  try {
    const guardado =
      localStorage.getItem(
        CLAVE_STORAGE
      );


    if (!guardado) {
      return copiarPredeterminada();
    }


    return normalizarConfiguracion(
      JSON.parse(
        guardado
      )
    );
  } catch (error) {
    console.error(
      "No se pudo cargar la configuración de gráficas:",
      error
    );


    return copiarPredeterminada();
  }
}


export function ProveedorConfiguracionGraficas({
  children,
}) {
  const [
    configuracion,
    setConfiguracion,
  ] =
    useState(
      cargarStorage
    );


  const [
    modalAbierto,
    setModalAbierto,
  ] =
    useState(false);


  const persistir =
    useCallback(
      (
        nuevaConfiguracion
      ) => {
        const normalizada =
          normalizarConfiguracion(
            nuevaConfiguracion
          );


        setConfiguracion(
          normalizada
        );


        try {
          localStorage.setItem(
            CLAVE_STORAGE,
            JSON.stringify(
              normalizada
            )
          );
        } catch (error) {
          console.error(
            "No se pudo guardar la configuración:",
            error
          );
        }


        return normalizada;
      },
      []
    );


  const guardarConfiguracion =
    useCallback(
      (
        nuevaConfiguracion
      ) => {
        return persistir(
          nuevaConfiguracion
        );
      },
      [
        persistir,
      ]
    );


  const cambiarPaleta =
    useCallback(
      (
        paleta
      ) => {
        setConfiguracion(
          (
            actual
          ) => {
            const nueva = {
              ...actual,
              paleta,
            };


            try {
              localStorage.setItem(
                CLAVE_STORAGE,
                JSON.stringify(
                  nueva
                )
              );
            } catch (error) {
              console.error(
                error
              );
            }


            return nueva;
          }
        );
      },
      []
    );


  const cambiarTipoGrafica =
    useCallback(
      (
        grafica,
        tipo
      ) => {
        setConfiguracion(
          (
            actual
          ) => {
            const nueva = {
              ...actual,

              tipos: {
                ...actual.tipos,

                [grafica]:
                  tipo,
              },
            };


            try {
              localStorage.setItem(
                CLAVE_STORAGE,
                JSON.stringify(
                  nueva
                )
              );
            } catch (error) {
              console.error(
                error
              );
            }


            return nueva;
          }
        );
      },
      []
    );


  const cambiarOrientacionGrafica =
    useCallback(
      (
        grafica,
        orientacion
      ) => {
        setConfiguracion(
          (
            actual
          ) => {
            const nueva = {
              ...actual,

              orientaciones: {
                ...actual.orientaciones,

                [grafica]:
                  orientacion,
              },
            };


            try {
              localStorage.setItem(
                CLAVE_STORAGE,
                JSON.stringify(
                  nueva
                )
              );
            } catch (error) {
              console.error(
                error
              );
            }


            return nueva;
          }
        );
      },
      []
    );


  const restablecer =
    useCallback(
      () => {
        const nueva =
          copiarPredeterminada();


        setConfiguracion(
          nueva
        );


        try {
          localStorage.setItem(
            CLAVE_STORAGE,
            JSON.stringify(
              nueva
            )
          );
        } catch (error) {
          console.error(
            error
          );
        }


        return nueva;
      },
      []
    );


  const abrirConfiguracion =
    useCallback(
      () => {
        setModalAbierto(
          true
        );
      },
      []
    );


  const cerrarConfiguracion =
    useCallback(
      () => {
        setModalAbierto(
          false
        );
      },
      []
    );


  const valor =
    useMemo(
      () => ({
        configuracion,

        configuracionGraficas:
          configuracion,

        modalAbierto,

        abierto:
          modalAbierto,

        guardarConfiguracion,

        cambiarPaleta,

        actualizarPaleta:
          cambiarPaleta,

        cambiarTipoGrafica,

        actualizarTipo:
          cambiarTipoGrafica,

        cambiarOrientacionGrafica,

        actualizarOrientacion:
          cambiarOrientacionGrafica,

        restablecer,

        abrirConfiguracion,

        abrirModal:
          abrirConfiguracion,

        cerrarConfiguracion,

        cerrarModal:
          cerrarConfiguracion,
      }),
      [
        configuracion,
        modalAbierto,
        guardarConfiguracion,
        cambiarPaleta,
        cambiarTipoGrafica,
        cambiarOrientacionGrafica,
        restablecer,
        abrirConfiguracion,
        cerrarConfiguracion,
      ]
    );


  return (
    <ContextoConfiguracionGraficas.Provider
      value={valor}
    >
      {children}
    </ContextoConfiguracionGraficas.Provider>
  );
}


export function useConfiguracionGraficas() {
  const contexto =
    useContext(
      ContextoConfiguracionGraficas
    );


  if (!contexto) {
    throw new Error(
      "useConfiguracionGraficas debe utilizarse dentro de ProveedorConfiguracionGraficas"
    );
  }


  return contexto;
}