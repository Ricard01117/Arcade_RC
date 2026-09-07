import {
  useEffect,
  useState,
} from "react";

import {
  CONFIGURACION_GRAFICAS_PREDETERMINADA,
  useConfiguracionGraficas,
} from "../../contexto/ContextoConfiguracionGraficas";

import {
  useGraficas,
} from "../../contexto/ContextoGraficas";

import RenderGrafica, {
  obtenerColores,
} from "./RenderGrafica";


const PALETAS = [
  {
    id: "tema",
    nombre: "Tema",
    descripcion:
      "Utiliza los colores del diseño activo.",
  },

  {
    id: "neon",
    nombre: "Neón",
    descripcion:
      "Colores luminosos estilo arcade.",
  },

  {
    id: "intensa",
    nombre: "Intensa",
    descripcion:
      "Tonos fuertes y contrastantes.",
  },

  {
    id: "multicolor",
    nombre: "Multicolor",
    descripcion:
      "Cada juego utiliza un color diferente.",
  },
];


const TIPOS = [
  {
    id: "barras",
    nombre: "Barras",
  },

  {
    id: "linea",
    nombre: "Línea",
  },

  {
    id: "area",
    nombre: "Área",
  },

  {
    id: "pastel",
    nombre: "Pastel",
  },
];


const ORIENTACIONES = [
  {
    id: "vertical",
    nombre: "Vertical",
    icono: "▥",
  },

  {
    id: "horizontal",
    nombre: "Horizontal",
    icono: "▤",
  },
];


const ORDEN_GRAFICAS = [
  "partidas",
  "logros",
  "record",
  "tiempo",
];


function copiarConfiguracion(
  configuracion
) {
  return {
    paleta:
      configuracion?.paleta ||
      "tema",

    tipos: {
      partidas:
        configuracion
          ?.tipos
          ?.partidas ||
        "barras",

      logros:
        configuracion
          ?.tipos
          ?.logros ||
        "pastel",

      record:
        configuracion
          ?.tipos
          ?.record ||
        "linea",

      tiempo:
        configuracion
          ?.tipos
          ?.tiempo ||
        "barras",
    },

    orientaciones: {
      partidas:
        configuracion
          ?.orientaciones
          ?.partidas ||
        "vertical",

      logros:
        configuracion
          ?.orientaciones
          ?.logros ||
        "vertical",

      record:
        configuracion
          ?.orientaciones
          ?.record ||
        "vertical",

      tiempo:
        configuracion
          ?.orientaciones
          ?.tiempo ||
        "horizontal",
    },
  };
}


function VistaPaleta({
  paleta,
}) {
  const colores =
    obtenerColores(
      paleta
    );


  return (
    <div className="muestra-paleta">
      {colores
        .slice(
          0,
          6
        )
        .map(
          (
            color,
            indice
          ) => (
            <i
              key={
                `${paleta}-${indice}`
              }
              style={{
                background:
                  color,
              }}
            />
          )
        )}
    </div>
  );
}


function ConfiguracionGraficasModal({
  abierto:
    abiertoProp,
  cerrar:
    cerrarProp,
}) {
  const {
    configuracion,
    modalAbierto,
    cerrarConfiguracion,
    guardarConfiguracion,
  } =
    useConfiguracionGraficas();


  const {
    graficas,
  } =
    useGraficas();


  const abierto =
    abiertoProp ??
    modalAbierto;


  const cerrar =
    cerrarProp ||
    cerrarConfiguracion;


  const [
    borrador,
    setBorrador,
  ] =
    useState(
      copiarConfiguracion(
        configuracion
      )
    );


  useEffect(
    () => {
      if (abierto) {
        setBorrador(
          copiarConfiguracion(
            configuracion
          )
        );
      }
    },
    [
      abierto,
      configuracion,
    ]
  );


  if (!abierto) {
    return null;
  }


  const seleccionarPaleta =
    (
      paleta
    ) => {
      setBorrador(
        (
          actual
        ) => ({
          ...actual,
          paleta,
        })
      );
    };


  const seleccionarTipo =
    (
      grafica,
      tipo
    ) => {
      setBorrador(
        (
          actual
        ) => ({
          ...actual,

          tipos: {
            ...actual.tipos,

            [grafica]:
              tipo,
          },
        })
      );
    };


  const seleccionarOrientacion =
    (
      grafica,
      orientacion
    ) => {
      setBorrador(
        (
          actual
        ) => ({
          ...actual,

          orientaciones: {
            ...actual.orientaciones,

            [grafica]:
              orientacion,
          },
        })
      );
    };


  const restablecerLocal =
    () => {
      setBorrador(
        copiarConfiguracion(
          CONFIGURACION_GRAFICAS_PREDETERMINADA
        )
      );
    };


  const guardar = () => {
    guardarConfiguracion(
      borrador
    );

    cerrar();
  };


  return (
    <div className="config-graficas-overlay">
      <section className="config-graficas-modal">

        <header className="config-graficas-header">
          <div>
            <span>
              ARCADE_RC
            </span>

            <h2>
              Configuración de gráficas
            </h2>

            <p>
              Personaliza la apariencia de tus estadísticas.
            </p>
          </div>


          <button
            type="button"
            className="cerrar-config-graficas"
            onClick={
              cerrar
            }
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>


        <section className="seccion-config-graficas">
          <div className="titulo-seccion-config">
            <span>
              COLORES
            </span>

            <h3>
              Escoge la paleta de las gráficas
            </h3>

            <p>
              Esta paleta se utilizará en todas las estadísticas.
            </p>
          </div>


          <div className="selector-paletas-graficas">
            {PALETAS.map(
              (
                paleta
              ) => {
                const activa =
                  borrador.paleta ===
                  paleta.id;


                return (
                  <button
                    type="button"
                    key={
                      paleta.id
                    }
                    className={
                      activa
                        ? "tarjeta-paleta activa"
                        : "tarjeta-paleta"
                    }
                    onClick={() =>
                      seleccionarPaleta(
                        paleta.id
                      )
                    }
                  >
                    <VistaPaleta
                      paleta={
                        paleta.id
                      }
                    />


                    <strong>
                      {
                        paleta.nombre
                      }

                      {activa &&
                        " ✓"}
                    </strong>


                    <small>
                      {
                        paleta.descripcion
                      }
                    </small>
                  </button>
                );
              }
            )}
          </div>
        </section>


        <section className="seccion-config-graficas">
          <div className="titulo-seccion-config">
            <span>
              VISUALIZACIÓN
            </span>

            <h3>
              Configura cada gráfica
            </h3>

            <p>
              Cada estadística puede tener un tipo y orientación diferente.
            </p>
          </div>


          <div className="lista-configuracion-graficas">
            {ORDEN_GRAFICAS.map(
              (
                idGrafica
              ) => {
                const grafica =
                  graficas[
                    idGrafica
                  ];


                const tipo =
                  borrador.tipos[
                    idGrafica
                  ];


                const orientacion =
                  borrador
                    .orientaciones[
                      idGrafica
                    ];


                return (
                  <article
                    className="config-grafica-tarjeta"
                    key={
                      idGrafica
                    }
                  >
                    <header>
                      <div>
                        <h4>
                          {
                            grafica.titulo
                          }
                        </h4>

                        <p>
                          Selecciona cómo visualizar esta información.
                        </p>
                      </div>
                    </header>


                    <div className="selector-tipos-grafica">
                      {TIPOS.map(
                        (
                          opcion
                        ) => (
                          <button
                            type="button"
                            key={
                              opcion.id
                            }
                            className={
                              tipo ===
                              opcion.id
                                ? "activo"
                                : ""
                            }
                            onClick={() =>
                              seleccionarTipo(
                                idGrafica,
                                opcion.id
                              )
                            }
                          >
                            {
                              opcion.nombre
                            }
                          </button>
                        )
                      )}
                    </div>


                    {tipo ===
                      "barras" && (
                      <div className="bloque-orientacion-grafica">
                        <span>
                          ORIENTACIÓN
                        </span>


                        <div className="selector-orientacion-grafica">
                          {ORIENTACIONES.map(
                            (
                              opcion
                            ) => (
                              <button
                                type="button"
                                key={
                                  opcion.id
                                }
                                className={
                                  orientacion ===
                                  opcion.id
                                    ? "activo"
                                    : ""
                                }
                                onClick={() =>
                                  seleccionarOrientacion(
                                    idGrafica,
                                    opcion.id
                                  )
                                }
                              >
                                <b>
                                  {
                                    opcion.icono
                                  }
                                </b>

                                {
                                  opcion.nombre
                                }
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    )}


                    <div className="vista-previa-config-grafica">
                      <span>
                        VISTA PREVIA
                      </span>


                      <div className="preview-grafica-contenedor">
                        <RenderGrafica
                          datos={
                            grafica.datos
                          }
                          tipo={
                            tipo
                          }
                          paleta={
                            borrador.paleta
                          }
                          orientacion={
                            orientacion
                          }
                          mini
                        />
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        </section>


        <footer className="config-graficas-footer">
          <button
            type="button"
            className="boton-restablecer-graficas"
            onClick={
              restablecerLocal
            }
          >
            Restablecer
          </button>


          <div>
            <button
              type="button"
              className="boton-cancelar-graficas"
              onClick={
                cerrar
              }
            >
              Cancelar
            </button>


            <button
              type="button"
              className="boton-guardar-graficas"
              onClick={
                guardar
              }
            >
              Guardar cambios
            </button>
          </div>
        </footer>

      </section>
    </div>
  );
}


export default ConfiguracionGraficasModal;