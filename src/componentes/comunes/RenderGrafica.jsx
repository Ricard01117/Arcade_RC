import {
  useMemo,
} from "react";


export function obtenerColores(
  paleta = "tema"
) {
  const paletas = {
    tema: [
      "var(--chart-1, #25e5ff)",
      "var(--chart-2, #ff3f83)",
      "var(--chart-3, #32ef82)",
      "var(--chart-4, #ffd83f)",
    ],

    neon: [
      "#00f5ff",
      "#ff31a6",
      "#53ff77",
      "#ffe32e",
    ],

    intensa: [
      "#ff3b45",
      "#ff8d25",
      "#2477ff",
      "#a64fff",
    ],

    intenso: [
      "#ff3b45",
      "#ff8d25",
      "#2477ff",
      "#a64fff",
    ],

    multicolor: [
      "#2d6be8",
      "#f7434b",
      "#16bb83",
      "#f3ba05",
      "#8658ef",
      "#12b2ca",
    ],
  };


  return (
    paletas[paleta] ||
    paletas.tema
  );
}


function normalizarTipo(
  tipo
) {
  const valor =
    String(
      tipo || ""
    )
      .toLowerCase()
      .trim();


  if (
    [
      "linea",
      "línea",
      "line",
    ].includes(valor)
  ) {
    return "linea";
  }


  if (
    [
      "area",
      "área",
    ].includes(valor)
  ) {
    return "area";
  }


  if (
    [
      "pastel",
      "pie",
      "circular",
    ].includes(valor)
  ) {
    return "pastel";
  }


  return "barras";
}


function normalizarOrientacion(
  orientacion
) {
  return orientacion ===
    "horizontal"
    ? "horizontal"
    : "vertical";
}


function colorSerie(
  colores,
  indice
) {
  return colores[
    indice %
    colores.length
  ];
}


function etiquetaCorta(
  nombre
) {
  const etiquetas = {
    Viborita:
      "Viborita",

    "Disparos Espaciales":
      "Disparos",

    "Rompe Bloques":
      "Bloques",

    Pong:
      "Pong",
  };


  return (
    etiquetas[nombre] ||
    nombre
  );
}


function detectarTiempo(
  datos
) {
  return datos.some(
    (
      dato
    ) =>
      String(
        dato.valorFormateado ||
        ""
      ).includes(
        " min"
      ) ||
      String(
        dato.valorFormateado ||
        ""
      ).includes(
        " h"
      ) ||
      String(
        dato.valorFormateado ||
        ""
      ).endsWith(
        " s"
      )
  );
}


function formatearTiempoLocal(
  segundosTotales
) {
  const total =
    Math.max(
      0,
      Math.round(
        Number(
          segundosTotales
        ) || 0
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
    if (minutos > 0) {
      return `${horas} h ${minutos} min`;
    }

    return `${horas} h`;
  }


  if (segundos > 0) {
    return `${minutos} min ${segundos} s`;
  }


  return `${minutos} min`;
}


/* =========================================
   BARRAS HORIZONTALES
========================================= */

function GraficaBarrasHorizontal({
  datos,
  colores,
  mini,
}) {
  const maximo =
    Math.max(
      ...datos.map(
        (
          dato
        ) =>
          Number(
            dato.valor
          ) || 0
      ),
      1
    );


  if (mini) {
    return (
      <div className="preview-barras-horizontal">
        {datos.map(
          (
            dato,
            indice
          ) => {
            const valor =
              Number(
                dato.valor
              ) || 0;


            const ancho =
              valor <= 0
                ? 2
                : Math.max(
                    5,
                    (
                      valor /
                      maximo
                    ) *
                      100
                  );


            return (
              <div
                className="preview-barra-horizontal-fila"
                key={
                  dato.codigo
                }
              >
                <i
                  style={{
                    width:
                      `${ancho}%`,

                    background:
                      colorSerie(
                        colores,
                        indice
                      ),
                  }}
                />
              </div>
            );
          }
        )}
      </div>
    );
  }


  return (
    <div className="grafica-barras-horizontal">
      {datos.map(
        (
          dato,
          indice
        ) => {
          const valor =
            Number(
              dato.valor
            ) || 0;


          const porcentaje =
            valor <= 0
              ? 0
              : Math.max(
                  2,
                  (
                    valor /
                    maximo
                  ) *
                    100
                );


          const color =
            colorSerie(
              colores,
              indice
            );


          return (
            <div
              className="barra-horizontal-item"
              key={
                dato.codigo
              }
            >
              <div className="barra-horizontal-cabecera">
                <span>
                  {
                    dato.nombre
                  }
                </span>

                <strong>
                  {
                    dato.valorFormateado
                  }
                </strong>
              </div>


              <div className="barra-horizontal-pista">
                <div
                  className="barra-horizontal-relleno"
                  style={{
                    width:
                      `${porcentaje}%`,

                    background:
                      color,

                    boxShadow:
                      valor > 0
                        ? `0 0 14px ${color}`
                        : "none",
                  }}
                />
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}


/* =========================================
   BARRAS VERTICALES
========================================= */

function GraficaBarrasVertical({
  datos,
  colores,
  mini,
}) {
  const maximo =
    Math.max(
      ...datos.map(
        (
          dato
        ) =>
          Number(
            dato.valor
          ) || 0
      ),
      1
    );


  if (mini) {
    return (
      <div className="preview-barras-vertical">
        {datos.map(
          (
            dato,
            indice
          ) => {
            const valor =
              Number(
                dato.valor
              ) || 0;


            const altura =
              valor <= 0
                ? 4
                : Math.max(
                    8,
                    (
                      valor /
                      maximo
                    ) *
                      100
                  );


            return (
              <div
                className="preview-columna-item"
                key={
                  dato.codigo
                }
              >
                <i
                  style={{
                    height:
                      `${altura}%`,

                    background:
                      colorSerie(
                        colores,
                        indice
                      ),
                  }}
                />
              </div>
            );
          }
        )}
      </div>
    );
  }


  return (
    <div className="grafica-barras-vertical">
      <div className="grafica-grid-vertical">
        <i />
        <i />
        <i />
        <i />
      </div>


      <div className="grafica-columnas">
        {datos.map(
          (
            dato,
            indice
          ) => {
            const valor =
              Number(
                dato.valor
              ) || 0;


            const altura =
              valor <= 0
                ? 0
                : Math.max(
                    3,
                    (
                      valor /
                      maximo
                    ) *
                      100
                  );


            const color =
              colorSerie(
                colores,
                indice
              );


            return (
              <div
                className="grafica-columna-item"
                key={
                  dato.codigo
                }
              >
                <div className="grafica-columna-area">
                  <strong className="grafica-columna-valor">
                    {
                      dato.valorFormateado
                    }
                  </strong>


                  <div
                    className={
                      valor <= 0
                        ? "grafica-columna cero"
                        : "grafica-columna"
                    }
                    style={{
                      height:
                        valor <= 0
                          ? "4px"
                          : `${altura}%`,

                      background:
                        color,

                      boxShadow:
                        valor > 0
                          ? `0 0 16px ${color}55`
                          : "none",
                    }}
                    title={`${dato.nombre}: ${dato.valorFormateado}`}
                  />
                </div>


                <span className="grafica-columna-etiqueta">
                  {
                    etiquetaCorta(
                      dato.nombre
                    )
                  }
                </span>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}


function GraficaBarras({
  datos,
  colores,
  mini,
  orientacion,
}) {
  const direccion =
    normalizarOrientacion(
      orientacion
    );


  if (
    direccion ===
    "horizontal"
  ) {
    return (
      <GraficaBarrasHorizontal
        datos={datos}
        colores={colores}
        mini={mini}
      />
    );
  }


  return (
    <GraficaBarrasVertical
      datos={datos}
      colores={colores}
      mini={mini}
    />
  );
}


/* =========================================
   LÍNEA / ÁREA
========================================= */

function calcularPuntos(
  datos,
  ancho,
  alto,
  margenX,
  margenY
) {
  const maximo =
    Math.max(
      ...datos.map(
        (
          dato
        ) =>
          Number(
            dato.valor
          ) || 0
      ),
      1
    );


  const espacio =
    datos.length > 1
      ? (
          ancho -
          margenX * 2
        ) /
        (
          datos.length -
          1
        )
      : 0;


  return datos.map(
    (
      dato,
      indice
    ) => {
      const valor =
        Number(
          dato.valor
        ) || 0;


      return {
        ...dato,

        x:
          datos.length === 1
            ? ancho / 2
            : margenX +
              espacio *
                indice,

        y:
          alto -
          margenY -
          (
            valor /
            maximo
          ) *
            (
              alto -
              margenY * 2
            ),
      };
    }
  );
}


function GraficaLinea({
  datos,
  colores,
  area = false,
  mini = false,
}) {
  const ancho =
    mini
      ? 300
      : 700;


  const alto =
    mini
      ? 125
      : 255;


  const margenX =
    mini
      ? 15
      : 55;


  const margenY =
    mini
      ? 15
      : 42;


  const puntos =
    useMemo(
      () =>
        calcularPuntos(
          datos,
          ancho,
          alto,
          margenX,
          margenY
        ),
      [
        datos,
        ancho,
        alto,
        margenX,
        margenY,
      ]
    );


  const puntosTexto =
    puntos
      .map(
        (
          punto
        ) =>
          `${punto.x},${punto.y}`
      )
      .join(
        " "
      );


  const areaPath =
    puntos.length > 0
      ? [
          `M ${puntos[0].x} ${alto - margenY}`,

          ...puntos.map(
            (
              punto
            ) =>
              `L ${punto.x} ${punto.y}`
          ),

          `L ${
            puntos[
              puntos.length -
              1
            ].x
          } ${alto - margenY}`,

          "Z",
        ].join(
          " "
        )
      : "";


  const colorPrincipal =
    colores[0];


  return (
    <svg
      className={
        mini
          ? "preview-linea-svg"
          : "grafica-linea-svg"
      }
      viewBox={`0 0 ${ancho} ${alto}`}
      role="img"
    >
      {!mini && (
        <>
          <line
            x1="28"
            y1={
              alto -
              margenY
            }
            x2={
              ancho -
              25
            }
            y2={
              alto -
              margenY
            }
            className="grafica-eje"
          />

          <line
            x1="28"
            y1={
              alto * 0.68
            }
            x2={
              ancho -
              25
            }
            y2={
              alto * 0.68
            }
            className="grafica-guia"
          />

          <line
            x1="28"
            y1={
              alto * 0.4
            }
            x2={
              ancho -
              25
            }
            y2={
              alto * 0.4
            }
            className="grafica-guia"
          />
        </>
      )}


      {area &&
        areaPath && (
          <path
            d={
              areaPath
            }
            fill={
              colorPrincipal
            }
            opacity="0.17"
          />
        )}


      <polyline
        points={
          puntosTexto
        }
        fill="none"
        stroke={
          colorPrincipal
        }
        strokeWidth={
          mini
            ? 5
            : 4
        }
        strokeLinecap="round"
        strokeLinejoin="round"
      />


      {!mini &&
        puntos.map(
          (
            punto,
            indice
          ) => (
            <g
              key={
                punto.codigo
              }
            >
              <circle
                cx={
                  punto.x
                }
                cy={
                  punto.y
                }
                r="6"
                fill={
                  colorSerie(
                    colores,
                    indice
                  )
                }
              >
                <title>
                  {`${punto.nombre}: ${punto.valorFormateado}`}
                </title>
              </circle>


              <text
                x={
                  punto.x
                }
                y={
                  Math.max(
                    16,
                    punto.y -
                      14
                  )
                }
                textAnchor="middle"
                className="grafica-valor-svg"
              >
                {
                  punto.valorFormateado
                }
              </text>


              <text
                x={
                  punto.x
                }
                y={
                  alto - 8
                }
                textAnchor="middle"
                className="grafica-etiqueta-svg"
              >
                {
                  etiquetaCorta(
                    punto.nombre
                  )
                }
              </text>
            </g>
          )
        )}
    </svg>
  );
}


/* =========================================
   PASTEL
========================================= */

function GraficaPastel({
  datos,
  colores,
  mini = false,
}) {
  const total =
    datos.reduce(
      (
        suma,
        dato
      ) =>
        suma +
        (
          Number(
            dato.valor
          ) || 0
        ),
      0
    );


  const esTiempo =
    detectarTiempo(
      datos
    );


  let acumulado =
    0;


  const gradiente =
    total <= 0
      ? "conic-gradient(rgba(150,150,150,.18) 0deg 360deg)"
      : `conic-gradient(${datos
          .map(
            (
              dato,
              indice
            ) => {
              const valor =
                Number(
                  dato.valor
                ) || 0;


              const inicio =
                acumulado;


              acumulado +=
                (
                  valor /
                  total
                ) *
                360;


              return `${colorSerie(
                colores,
                indice
              )} ${inicio}deg ${acumulado}deg`;
            }
          )
          .join(
            ", "
          )})`;


  if (mini) {
    return (
      <div className="preview-pastel">
        <div
          className="preview-pastel-circulo"
          style={{
            background:
              gradiente,
          }}
        >
          <i />
        </div>
      </div>
    );
  }


  const totalFormateado =
    esTiempo
      ? formatearTiempoLocal(
          total
        )
      : String(
          Math.round(
            total
          )
        );


  return (
    <div className="grafica-pastel-layout">
      <div className="grafica-pastel-zona">
        <div
          className="grafica-pastel"
          style={{
            background:
              gradiente,
          }}
        >
          <div className="grafica-pastel-centro">
            <strong>
              {
                totalFormateado
              }
            </strong>

            <span>
              TOTAL
            </span>
          </div>
        </div>
      </div>


      <div className="grafica-pastel-leyenda">
        {datos.map(
          (
            dato,
            indice
          ) => {
            const valor =
              Number(
                dato.valor
              ) || 0;


            const porcentaje =
              total > 0
                ? (
                    valor /
                    total
                  ) *
                  100
                : 0;


            return (
              <div
                className="item-leyenda"
                key={
                  dato.codigo
                }
              >
                <i
                  style={{
                    background:
                      colorSerie(
                        colores,
                        indice
                      ),
                  }}
                />


                <div className="leyenda-info">
                  <span>
                    {
                      dato.nombre
                    }
                  </span>

                  <small>
                    {
                      porcentaje.toFixed(
                        porcentaje >= 10
                          ? 0
                          : 1
                      )
                    }
                    %
                  </small>
                </div>


                <strong>
                  {
                    dato.valorFormateado
                  }
                </strong>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}


/* =========================================
   COMPONENTE PRINCIPAL
========================================= */

function RenderGrafica({
  datos = [],
  tipo = "barras",
  paleta = "tema",
  orientacion = "vertical",
  mini = false,
}) {
  const tipoNormalizado =
    normalizarTipo(
      tipo
    );


  const colores =
    obtenerColores(
      paleta
    );


  if (
    !Array.isArray(
      datos
    ) ||
    datos.length === 0
  ) {
    return (
      <div className="grafica-sin-datos">
        Sin datos
      </div>
    );
  }


  if (
    tipoNormalizado ===
    "linea"
  ) {
    return (
      <GraficaLinea
        datos={datos}
        colores={colores}
        mini={mini}
      />
    );
  }


  if (
    tipoNormalizado ===
    "area"
  ) {
    return (
      <GraficaLinea
        datos={datos}
        colores={colores}
        area
        mini={mini}
      />
    );
  }


  if (
    tipoNormalizado ===
    "pastel"
  ) {
    return (
      <GraficaPastel
        datos={datos}
        colores={colores}
        mini={mini}
      />
    );
  }


  return (
    <GraficaBarras
      datos={datos}
      colores={colores}
      mini={mini}
      orientacion={
        orientacion
      }
    />
  );
}


export default RenderGrafica;