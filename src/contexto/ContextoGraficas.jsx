import {
  createContext,
  useContext,
  useMemo,
} from "react";

import {
  useEstadisticas,
} from "./ContextoEstadisticas";


const ContextoGraficas =
  createContext(null);


const JUEGOS_BASE = [
  {
    codigo: "viborita",
    nombre: "Viborita",
  },
  {
    codigo: "disparos",
    nombre: "Disparos Espaciales",
  },
  {
    codigo: "bloques",
    nombre: "Rompe Bloques",
  },
  {
    codigo: "pong",
    nombre: "Pong",
  },
];


function numeroSeguro(valor) {
  const numero =
    Number(valor);

  return Number.isFinite(numero)
    ? numero
    : 0;
}


export function formatearTiempo(
  segundosTotales
) {
  const total =
    Math.max(
      0,
      Math.round(
        numeroSeguro(
          segundosTotales
        )
      )
    );


  if (total < 60) {
    return `${total} s`;
  }


  const horas =
    Math.floor(
      total / 3600
    );


  const minutos =
    Math.floor(
      (
        total % 3600
      ) / 60
    );


  const segundos =
    total % 60;


  if (horas > 0) {
    if (
      minutos === 0
    ) {
      return `${horas} h`;
    }


    return `${horas} h ${minutos} min`;
  }


  if (segundos === 0) {
    return `${minutos} min`;
  }


  return `${minutos} min ${segundos} s`;
}


function normalizarJuego(
  base,
  datos
) {
  const encontrado =
    datos.find(
      (juego) =>
        juego.codigo ===
        base.codigo
    );


  const partidas =
    numeroSeguro(
      encontrado?.partidas
    );


  const logros =
    numeroSeguro(
      encontrado?.logros
    );


  const record =
    numeroSeguro(
      encontrado?.record ??
        encontrado?.puntuacion_maxima ??
        encontrado?.mejor_puntuacion
    );


  /*
  IMPORTANTE:
  La gráfica usa SEGUNDOS.
  Así una partida de 10 segundos
  ya aparece y no se convierte en 0 min.
  */

  let tiempoSegundos =
    numeroSeguro(
      encontrado
        ?.tiempo_segundos
    );


  /*
  Respaldo por si alguna respuesta
  antigua solamente tiene minutos.
  */

  if (
    tiempoSegundos <= 0
  ) {
    const minutos =
      numeroSeguro(
        encontrado
          ?.tiempo_minutos
      );


    if (minutos > 0) {
      tiempoSegundos =
        minutos * 60;
    }
  }


  return {
    codigo:
      base.codigo,

    nombre:
      encontrado?.nombre ||
      base.nombre,

    partidas,

    logros,

    record,

    tiempo_segundos:
      tiempoSegundos,
  };
}


export function ProveedorGraficas({
  children,
}) {
  const {
    juegos:
      estadisticas,
  } =
    useEstadisticas();


  const juegos =
    useMemo(() => {
      const datos =
        Array.isArray(
          estadisticas
        )
          ? estadisticas
          : [];


      return JUEGOS_BASE.map(
        (base) =>
          normalizarJuego(
            base,
            datos
          )
      );
    }, [
      estadisticas,
    ]);


  const graficas =
    useMemo(() => {
      return {
        partidas: {
          id:
            "partidas",

          titulo:
            "Partidas",

          descripcion:
            "Partidas acumuladas por juego.",

          datos:
            juegos.map(
              (juego) => ({
                codigo:
                  juego.codigo,

                nombre:
                  juego.nombre,

                valor:
                  juego.partidas,

                valorFormateado:
                  String(
                    juego.partidas
                  ),
              })
            ),
        },


        logros: {
          id:
            "logros",

          titulo:
            "Logros",

          descripcion:
            "Logros desbloqueados por juego.",

          datos:
            juegos.map(
              (juego) => ({
                codigo:
                  juego.codigo,

                nombre:
                  juego.nombre,

                valor:
                  juego.logros,

                valorFormateado:
                  String(
                    juego.logros
                  ),
              })
            ),
        },


        record: {
          id:
            "record",

          titulo:
            "Récord",

          descripcion:
            "Mayor puntuación conseguida en cada juego.",

          datos:
            juegos.map(
              (juego) => ({
                codigo:
                  juego.codigo,

                nombre:
                  juego.nombre,

                valor:
                  juego.record,

                valorFormateado:
                  String(
                    juego.record
                  ),
              })
            ),
        },


        tiempo: {
          id:
            "tiempo",

          titulo:
            "Tiempo acumulado",

          descripcion:
            "Tiempo total de uso de cada juego.",

          datos:
            juegos.map(
              (juego) => ({
                codigo:
                  juego.codigo,

                nombre:
                  juego.nombre,

                valor:
                  juego
                    .tiempo_segundos,

                valorFormateado:
                  formatearTiempo(
                    juego
                      .tiempo_segundos
                  ),
              })
            ),
        },
      };
    }, [
      juegos,
    ]);


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


      const logros =
        juegos.reduce(
          (
            total,
            juego
          ) =>
            total +
            juego.logros,
          0
        );


      const tiempoSegundos =
        juegos.reduce(
          (
            total,
            juego
          ) =>
            total +
            juego
              .tiempo_segundos,
          0
        );


      const record =
        Math.max(
          ...juegos.map(
            (juego) =>
              juego.record
          ),
          0
        );


      const rankingTiempo =
        [...juegos].sort(
          (
            a,
            b
          ) =>
            b.tiempo_segundos -
            a.tiempo_segundos
        );


      const masJugado =
        rankingTiempo[0] ||
        null;


      return {
        juegos:
          juegos.length,

        partidas,

        logros,

        record,

        tiempoSegundos,

        tiempoFormateado:
          formatearTiempo(
            tiempoSegundos
          ),

        masJugado,
      };
    }, [
      juegos,
    ]);


  const valor =
    useMemo(
      () => ({
        juegos,

        graficas,

        resumen,

        formatearTiempo,
      }),
      [
        juegos,
        graficas,
        resumen,
      ]
    );


  return (
    <ContextoGraficas.Provider
      value={valor}
    >
      {children}
    </ContextoGraficas.Provider>
  );
}


export function useGraficas() {
  const contexto =
    useContext(
      ContextoGraficas
    );


  if (!contexto) {
    throw new Error(
      "useGraficas debe utilizarse dentro de ProveedorGraficas"
    );
  }


  return contexto;
}