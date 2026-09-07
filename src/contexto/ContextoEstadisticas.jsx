import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  actualizarPartida,
  finalizarPartida,
  iniciarPartida,
  obtenerEstadisticas,
  obtenerLogros,
} from "../servicios/api";


const ContextoEstadisticas =
  createContext(null);


const DATOS_INICIALES = [
  {
    codigo: "viborita",
    nombre: "Viborita",
    partidas: 0,
    logros: 0,
    record: 0,
    tiempo_segundos: 0,
    tiempo_minutos: 0,
  },

  {
    codigo: "disparos",
    nombre: "Disparos Espaciales",
    partidas: 0,
    logros: 0,
    record: 0,
    tiempo_segundos: 0,
    tiempo_minutos: 0,
  },

  {
    codigo: "bloques",
    nombre: "Rompe Bloques",
    partidas: 0,
    logros: 0,
    record: 0,
    tiempo_segundos: 0,
    tiempo_minutos: 0,
  },

  {
    codigo: "pong",
    nombre: "Pong",
    partidas: 0,
    logros: 0,
    record: 0,
    tiempo_segundos: 0,
    tiempo_minutos: 0,
  },
];


export function ProveedorEstadisticas({
  children,
}) {
  const [
    juegos,
    setJuegos,
  ] = useState(
    DATOS_INICIALES
  );

  const [
    logros,
    setLogros,
  ] = useState([]);

  const [
    backendDisponible,
    setBackendDisponible,
  ] = useState(true);


  /*
  =====================================
  CARGAR DATOS COMPLETOS
  =====================================
  */

  const cargarDatos =
    useCallback(
      async () => {
        try {
          const [
            estadisticas,
            datosLogros,
          ] =
            await Promise.all([
              obtenerEstadisticas(),
              obtenerLogros(),
            ]);


          setJuegos(
            estadisticas
          );


          setLogros(
            datosLogros
          );


          setBackendDisponible(
            true
          );
        } catch (error) {
          console.error(
            "Error cargando estadísticas:",
            error
          );


          setBackendDisponible(
            false
          );
        }
      },
      []
    );


  /*
  =====================================
  SOLO ESTADISTICAS
  Para actualizaciones durante juego.
  =====================================
  */

  const cargarSoloEstadisticas =
    useCallback(
      async () => {
        try {
          const estadisticas =
            await obtenerEstadisticas();


          setJuegos(
            estadisticas
          );


          setBackendDisponible(
            true
          );
        } catch (error) {
          console.error(
            "Error actualizando estadísticas:",
            error
          );


          setBackendDisponible(
            false
          );
        }
      },
      []
    );


  /*
  =====================================
  CARGA INICIAL
  =====================================
  */

  useEffect(() => {
    cargarDatos();
  }, [
    cargarDatos,
  ]);


  /*
  =====================================
  INICIAR PARTIDA

  IMPORTANTE:
  useCallback evita que esta función
  cambie en cada render.
  =====================================
  */

  const iniciarSesion =
    useCallback(
      async (
        codigoJuego
      ) => {
        const respuesta =
          await iniciarPartida(
            codigoJuego
          );


        await cargarSoloEstadisticas();


        return respuesta;
      },
      [
        cargarSoloEstadisticas,
      ]
    );


  /*
  =====================================
  ACTUALIZAR PARTIDA EN VIVO
  =====================================
  */

  const actualizarSesion =
    useCallback(
      async ({
        partidaId,
        puntuacion,
        duracionSegundos,
      }) => {
        const respuesta =
          await actualizarPartida(
            partidaId,
            puntuacion,
            duracionSegundos
          );


        /*
        Actualizamos las gráficas,
        pero NO reiniciamos el juego.
        */

        await cargarSoloEstadisticas();


        return respuesta;
      },
      [
        cargarSoloEstadisticas,
      ]
    );


  /*
  =====================================
  FINALIZAR PARTIDA
  =====================================
  */

  const finalizarSesion =
    useCallback(
      async ({
        partidaId,
        puntuacion,
        duracionSegundos,
      }) => {
        const respuesta =
          await finalizarPartida(
            partidaId,
            puntuacion,
            duracionSegundos
          );


        /*
        Al terminar sí recargamos
        estadísticas + logros.
        */

        await cargarDatos();


        return respuesta;
      },
      [
        cargarDatos,
      ]
    );


  /*
  =====================================
  RESUMEN GLOBAL
  =====================================
  */

  const resumen =
    useMemo(() => {
      const partidas =
        juegos.reduce(
          (
            total,
            juego
          ) =>
            total +
            juego.partidas,
          0
        );


      const logrosTotales =
        juegos.reduce(
          (
            total,
            juego
          ) =>
            total +
            juego.logros,
          0
        );


      const tiempo =
        juegos.reduce(
          (
            total,
            juego
          ) =>
            total +
            juego
              .tiempo_minutos,
          0
        );


      const mejorRecord =
        Math.max(
          ...juegos.map(
            (juego) =>
              juego.record
          ),
          0
        );


      return {
        juegos:
          juegos.length,

        partidas,

        logros:
          logrosTotales,

        tiempo,

        mejorRecord,
      };
    }, [
      juegos,
    ]);


  /*
  =====================================
  VALOR DEL CONTEXTO
  =====================================
  */

  const valor =
    useMemo(
      () => ({
        juegos,

        logros,

        resumen,

        backendDisponible,

        cargarDatos,

        cargarSoloEstadisticas,

        iniciarSesion,

        actualizarSesion,

        finalizarSesion,
      }),
      [
        juegos,
        logros,
        resumen,
        backendDisponible,
        cargarDatos,
        cargarSoloEstadisticas,
        iniciarSesion,
        actualizarSesion,
        finalizarSesion,
      ]
    );


  return (
    <ContextoEstadisticas.Provider
      value={valor}
    >
      {children}
    </ContextoEstadisticas.Provider>
  );
}


export function useEstadisticas() {
  const contexto =
    useContext(
      ContextoEstadisticas
    );


  if (!contexto) {
    throw new Error(
      "useEstadisticas debe utilizarse dentro de ProveedorEstadisticas"
    );
  }


  return contexto;
}