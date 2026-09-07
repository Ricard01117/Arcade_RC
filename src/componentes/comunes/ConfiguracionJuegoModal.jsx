import {
  useConfiguracionJuegos,
} from "../../contexto/ContextoConfiguracionJuegos";


const NOMBRES = {
  pong: "Pong",

  viborita:
    "Viborita",

  disparos:
    "Disparos Espaciales",

  bloques:
    "Rompe Bloques",
};


const CAMPOS = {
  pong: [
    ["fondo", "Mesa / fondo"],
    ["jugador", "Jugador"],
    ["cpu", "CPU"],
    ["pelota", "Pelota"],
    ["lineas", "Líneas neón"],
  ],

  viborita: [
    ["fondo", "Tablero"],
    ["viborita", "Viborita"],
    ["cabeza", "Cabeza"],
    ["comida", "Comida"],
  ],

  disparos: [
    ["fondo", "Espacio"],
    ["jugador", "Tu nave"],
    ["enemigo", "Enemigos"],
    ["especial", "Nave especial"],
  ],

  bloques: [
    ["fondo", "Fondo"],
    ["paleta", "Plataforma"],
    ["pelota", "Pelotas"],
    ["vida", "Bloque + vida"],
    [
      "multibola",
      "Bloque multibola",
    ],
  ],
};


function ConfiguracionJuegoModal({
  juego,
  cerrar,
}) {
  const {
    configuracion,
    actualizar,
    restablecer,
  } =
    useConfiguracionJuegos();


  const datos =
    configuracion[juego];


  return (
    <div className="config-juego-overlay">
      <section className="config-juego-modal">
        <header className="config-juego-header">
          <div>
            <span>
              CONFIGURACIÓN
            </span>

            <h3>
              {NOMBRES[juego]}
            </h3>
          </div>

          <button
            onClick={cerrar}
            className="cerrar-config-juego"
          >
            ×
          </button>
        </header>

        {juego !== "bloques" && (
          <section className="bloque-config-juego">
            <h4>
              Dificultad
            </h4>

            <div className="selector-dificultad">
              {[
                "facil",
                "medio",
                "dificil",
              ].map(
                (nivel) => (
                  <button
                    key={nivel}
                    className={
                      datos.dificultad
                        === nivel
                        ? "activo"
                        : ""
                    }
                    onClick={() =>
                      actualizar(
                        juego,
                        "dificultad",
                        nivel
                      )
                    }
                  >
                    {nivel ===
                    "facil"
                      ? "Fácil"
                      : nivel ===
                          "medio"
                        ? "Medio"
                        : "Difícil"}
                  </button>
                )
              )}
            </div>
          </section>
        )}

        <section className="bloque-config-juego">
          <h4>
            Colores
          </h4>

          <div className="lista-colores-juego">
            {CAMPOS[
              juego
            ].map(
              ([
                propiedad,
                nombre,
              ]) => (
                <label
                  key={
                    propiedad
                  }
                  className="color-juego-fila"
                >
                  <span>
                    {nombre}
                  </span>

                  <input
                    type="color"
                    value={
                      datos[
                        propiedad
                      ]
                    }
                    onChange={(
                      evento
                    ) =>
                      actualizar(
                        juego,
                        propiedad,
                        evento
                          .target
                          .value
                      )
                    }
                  />
                </label>
              )
            )}
          </div>
        </section>

        <footer className="config-juego-footer">
          <button
            onClick={() =>
              restablecer(
                juego
              )
            }
          >
            Restablecer
          </button>

          <button
            className="config-listo"
            onClick={cerrar}
          >
            Listo
          </button>
        </footer>
      </section>
    </div>
  );
}


export default ConfiguracionJuegoModal;