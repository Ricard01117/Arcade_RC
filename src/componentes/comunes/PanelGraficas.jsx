import {
  useGraficas,
} from "../../contexto/ContextoGraficas";

import {
  useConfiguracionGraficas,
} from "../../contexto/ContextoConfiguracionGraficas";

import RenderGrafica from "./RenderGrafica";


const ORDEN = [
  "partidas",
  "logros",
  "record",
  "tiempo",
];


function TarjetaResumen({
  titulo,
  valor,
}) {
  return (
    <article className="resumen-estadistica-card">
      <span>
        {titulo}
      </span>

      <strong>
        {valor}
      </strong>
    </article>
  );
}


function PanelGraficas() {
  const {
    graficas,
    resumen,
    formatearTiempo,
  } =
    useGraficas();


  const {
    configuracion,
  } =
    useConfiguracionGraficas();


  const masJugado =
    resumen.masJugado;


  return (
    <section className="panel-graficas">

      <div className="resumen-estadisticas">
        <TarjetaResumen
          titulo="JUEGOS"
          valor={
            resumen.juegos
          }
        />


        <TarjetaResumen
          titulo="PARTIDAS"
          valor={
            resumen.partidas
          }
        />


        <TarjetaResumen
          titulo="LOGROS"
          valor={
            resumen.logros
          }
        />


        <TarjetaResumen
          titulo="TIEMPO"
          valor={
            resumen
              .tiempoFormateado
          }
        />
      </div>


      <div className="cuadricula-graficas">
        {ORDEN.map(
          (
            idGrafica
          ) => {
            const grafica =
              graficas[
                idGrafica
              ];


            const tipo =
              configuracion
                .tipos[
                  idGrafica
                ];


            const orientacion =
              configuracion
                .orientaciones
                ?.[
                  idGrafica
                ] ||
              "vertical";


            const esTiempo =
              idGrafica ===
              "tiempo";


            return (
              <article
                className="tarjeta-grafica"
                key={
                  idGrafica
                }
              >
                <header className="cabecera-tarjeta-grafica">
                  <div>
                    <span>
                      ESTADÍSTICA
                    </span>

                    <h3>
                      {
                        grafica.titulo
                      }
                    </h3>

                    <p>
                      {
                        grafica.descripcion
                      }
                    </p>
                  </div>


                  <div className="etiquetas-grafica">
                    {tipo ===
                      "barras" && (
                      <span className="orientacion-grafica-indicador">
                        {
                          orientacion ===
                          "vertical"
                            ? "VERTICAL"
                            : "HORIZONTAL"
                        }
                      </span>
                    )}


                    <div className="tipo-grafica-indicador">
                      {tipo}
                    </div>
                  </div>
                </header>


                {esTiempo &&
                  masJugado &&
                  masJugado
                    .tiempo_segundos >
                    0 && (
                    <div className="indicador-mas-jugado">
                      <span>
                        MÁS JUGADO
                      </span>

                      <strong>
                        {
                          masJugado.nombre
                        }
                      </strong>

                      <small>
                        {
                          formatearTiempo(
                            masJugado
                              .tiempo_segundos
                          )
                        }
                      </small>
                    </div>
                  )}


                <div className="contenedor-grafica-panel">
                  <RenderGrafica
                    datos={
                      grafica.datos
                    }
                    tipo={
                      tipo
                    }
                    paleta={
                      configuracion
                        .paleta
                    }
                    orientacion={
                      orientacion
                    }
                  />
                </div>
              </article>
            );
          }
        )}
      </div>

    </section>
  );
}


export default PanelGraficas;