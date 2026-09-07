import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useJuego,
} from "../../contexto/ContextoJuego";

import {
  useEstadisticas,
} from "../../contexto/ContextoEstadisticas";

import {
  IconoEngranaje,
  IconoPausa,
  IconoPlay,
} from "./IconosJuego";

import ConfiguracionJuegoModal from "./ConfiguracionJuegoModal";

import Viborita from "../../juegos/viborita/Viborita";

import DisparosEspaciales from "../../juegos/disparos-espaciales/DisparosEspaciales";

import RompeBloques from "../../juegos/rompe-bloques/RompeBloques";

import Pong from "../../juegos/pong/Pong";


const NOMBRES = {
  viborita:
    "Viborita",

  disparos:
    "Disparos Espaciales",

  bloques:
    "Rompe Bloques",

  pong:
    "Pong",
};


function JuegoModal() {
  const {
    juegoActivo,
    cerrarJuego,
  } = useJuego();


  const {
    iniciarSesion,
    actualizarSesion,
    finalizarSesion,
  } = useEstadisticas();


  /*
  =====================================
  REFERENCIAS DE LA PARTIDA
  =====================================
  */

  const partidaIdRef =
    useRef(null);


  const sesionIniciandoRef =
    useRef(false);


  const juegoSesionRef =
    useRef(null);


  const puntuacionRef =
    useRef(0);


  const segundosRef =
    useRef(0);


  const enJuegoRef =
    useRef(false);


  /*
  =====================================
  ESTADOS VISUALES
  =====================================
  */

  const [
    puntuacion,
    setPuntuacion,
  ] = useState(0);


  const [
    segundos,
    setSegundos,
  ] = useState(0);


  const [
    pausado,
    setPausado,
  ] = useState(true);


  const [
    cuentaRegresiva,
    setCuentaRegresiva,
  ] = useState(null);


  const [
    configurando,
    setConfigurando,
  ] = useState(false);


  const [
    enJuego,
    setEnJuego,
  ] = useState(false);


  const [
    mensaje,
    setMensaje,
  ] = useState("");


  /*
  =====================================
  BLOQUEAR SCROLL
  =====================================
  */

  useEffect(() => {
    if (!juegoActivo) {
      return undefined;
    }


    const overflowAnterior =
      document.body.style
        .overflow;


    const overscrollAnterior =
      document.body.style
        .overscrollBehavior;


    document.body.style.overflow =
      "hidden";


    document.body.style
      .overscrollBehavior =
      "none";


    return () => {
      document.body.style.overflow =
        overflowAnterior;


      document.body.style
        .overscrollBehavior =
        overscrollAnterior;
    };
  }, [
    juegoActivo,
  ]);


  /*
  =====================================
  INICIAR SESION
  =====================================
  */

  const arrancarSesion =
    useCallback(
      async (
        codigoJuego
      ) => {
        /*
        Evita crear dos partidas
        simultáneamente.
        */

        if (
          !codigoJuego ||
          sesionIniciandoRef.current
        ) {
          return;
        }


        sesionIniciandoRef.current =
          true;


        try {
          /*
          Reiniciamos estados.
          */

          puntuacionRef.current =
            0;


          segundosRef.current =
            0;


          partidaIdRef.current =
            null;


          setPuntuacion(0);

          setSegundos(0);

          setMensaje("");

          setConfigurando(false);


          /*
          Creamos partida backend.
          */

          const respuesta =
            await iniciarSesion(
              codigoJuego
            );


          /*
          Si el usuario cerró el juego
          mientras esperaba la respuesta,
          no arrancamos nada.
          */

          if (
            juegoSesionRef.current !==
            codigoJuego
          ) {
            return;
          }


          partidaIdRef.current =
            respuesta.partida_id;


          enJuegoRef.current =
            true;


          setEnJuego(true);


          /*
          Empezamos en pausa mientras
          aparece 3, 2, 1.
          */

          setPausado(true);


          setCuentaRegresiva(
            3
          );
        } catch (error) {
          console.error(
            "Error iniciando partida:",
            error
          );


          setMensaje(
            "No se pudo iniciar la partida. Comprueba el backend."
          );


          enJuegoRef.current =
            false;


          setEnJuego(false);
        } finally {
          sesionIniciandoRef.current =
            false;
        }
      },
      [
        iniciarSesion,
      ]
    );


  /*
  =====================================
  NUEVO JUEGO ABIERTO

  Este efecto SOLO debe dispararse
  cuando cambia juegoActivo.
  =====================================
  */

  useEffect(() => {
    if (!juegoActivo) {
      juegoSesionRef.current =
        null;

      return;
    }


    /*
    Si ya tenemos este mismo juego
    activo, no crear otra sesión.
    */

    if (
      juegoSesionRef.current ===
      juegoActivo
    ) {
      return;
    }


    juegoSesionRef.current =
      juegoActivo;


    arrancarSesion(
      juegoActivo
    );
  }, [
    juegoActivo,
    arrancarSesion,
  ]);


  /*
  =====================================
  CUENTA REGRESIVA GLOBAL
  =====================================
  */

  useEffect(() => {
    if (
      cuentaRegresiva ===
      null
    ) {
      return undefined;
    }


    if (
      cuentaRegresiva <=
      0
    ) {
      setCuentaRegresiva(
        null
      );


      setPausado(false);


      return undefined;
    }


    const temporizador =
      window.setTimeout(
        () => {
          setCuentaRegresiva(
            (actual) => {
              if (
                actual === null
              ) {
                return null;
              }

              return actual - 1;
            }
          );
        },
        1000
      );


    return () => {
      window.clearTimeout(
        temporizador
      );
    };
  }, [
    cuentaRegresiva,
  ]);


  /*
  =====================================
  SABER SI EL MOTOR DEBE DETENERSE
  =====================================
  */

  const juegoDetenido =
    pausado ||
    cuentaRegresiva !==
      null ||
    configurando;


  /*
  =====================================
  CONTADOR DE TIEMPO REAL
  =====================================
  */

  useEffect(() => {
    if (!juegoActivo) {
      return undefined;
    }


    const reloj =
      window.setInterval(
        () => {
          if (
            !enJuegoRef.current ||
            juegoDetenido
          ) {
            return;
          }


          segundosRef.current +=
            1;


          setSegundos(
            segundosRef.current
          );
        },
        1000
      );


    return () => {
      window.clearInterval(
        reloj
      );
    };
  }, [
    juegoActivo,
    juegoDetenido,
  ]);


  /*
  =====================================
  SINCRONIZACION BACKEND EN VIVO

  Cada 2.5 segundos guarda:
  - puntuación
  - tiempo
  =====================================
  */

  useEffect(() => {
    if (!juegoActivo) {
      return undefined;
    }


    const sincronizador =
      window.setInterval(
        async () => {
          if (
            !enJuegoRef.current ||
            !partidaIdRef.current
          ) {
            return;
          }


          try {
            await actualizarSesion({
              partidaId:
                partidaIdRef.current,

              puntuacion:
                puntuacionRef.current,

              duracionSegundos:
                segundosRef.current,
            });
          } catch (error) {
            console.error(
              "Error sincronizando partida:",
              error
            );
          }
        },
        2500
      );


    return () => {
      window.clearInterval(
        sincronizador
      );
    };
  }, [
    juegoActivo,
    actualizarSesion,
  ]);


  /*
  =====================================
  PUNTUACION DESDE EL JUEGO
  =====================================
  */

  const actualizarPuntuacion =
    useCallback(
      (
        nuevaPuntuacion
      ) => {
        puntuacionRef.current =
          nuevaPuntuacion;


        setPuntuacion(
          nuevaPuntuacion
        );
      },
      []
    );


  /*
  =====================================
  GAME OVER
  =====================================
  */

  const finalizarDesdeJuego =
    useCallback(
      async ({
        puntuacion:
          puntuacionFinal,
      }) => {
        if (
          !enJuegoRef.current
        ) {
          return;
        }


        puntuacionRef.current =
          puntuacionFinal;


        setPuntuacion(
          puntuacionFinal
        );


        enJuegoRef.current =
          false;


        setEnJuego(false);

        setPausado(true);

        setCuentaRegresiva(
          null
        );


        const id =
          partidaIdRef.current;


        if (!id) {
          return;
        }


        /*
        Evita volver a finalizarla.
        */

        partidaIdRef.current =
          null;


        try {
          const resultado =
            await finalizarSesion({
              partidaId:
                id,

              puntuacion:
                puntuacionFinal,

              duracionSegundos:
                segundosRef.current,
            });


          if (
            resultado
              .logros_nuevos
              ?.length > 0
          ) {
            setMensaje(
              `Logro desbloqueado: ${
                resultado
                  .logros_nuevos
                  .join(", ")
              }`
            );
          } else {
            setMensaje(
              "Partida guardada correctamente."
            );
          }
        } catch (error) {
          console.error(
            "Error finalizando partida:",
            error
          );


          setMensaje(
            "No fue posible guardar la partida."
          );
        }
      },
      [
        finalizarSesion,
      ]
    );


  /*
  =====================================
  REINICIAR PARTIDA
  =====================================
  */

  const reiniciarSesion =
    useCallback(
      async () => {
        /*
        Si todavía había una partida
        activa, la finalizamos.
        */

        if (
          enJuegoRef.current &&
          partidaIdRef.current
        ) {
          const id =
            partidaIdRef.current;


          partidaIdRef.current =
            null;


          enJuegoRef.current =
            false;


          try {
            await finalizarSesion({
              partidaId: id,

              puntuacion:
                puntuacionRef.current,

              duracionSegundos:
                segundosRef.current,
            });
          } catch (error) {
            console.error(
              error
            );
          }
        }


        /*
        Permitimos iniciar nuevamente
        el mismo juego.
        */

        juegoSesionRef.current =
          juegoActivo;


        await arrancarSesion(
          juegoActivo
        );
      },
      [
        juegoActivo,
        arrancarSesion,
        finalizarSesion,
      ]
    );


  /*
  =====================================
  CERRAR CON GUARDADO
  =====================================
  */

  const cerrarConGuardado =
    useCallback(
      async () => {
        /*
        Indicamos inmediatamente que
        ya no hay juego.
        */

        enJuegoRef.current =
          false;


        const id =
          partidaIdRef.current;


        partidaIdRef.current =
          null;


        juegoSesionRef.current =
          null;


        setCuentaRegresiva(
          null
        );


        if (id) {
          try {
            await finalizarSesion({
              partidaId:
                id,

              puntuacion:
                puntuacionRef.current,

              duracionSegundos:
                segundosRef.current,
            });
          } catch (error) {
            console.error(
              "Error guardando al cerrar:",
              error
            );
          }
        }


        cerrarJuego();
      },
      [
        cerrarJuego,
        finalizarSesion,
      ]
    );


  /*
  =====================================
  TECLAS GENERALES

  ESC = cerrar
  P = pausa
  =====================================
  */

  useEffect(() => {
    if (!juegoActivo) {
      return undefined;
    }


    const teclado = (
      evento
    ) => {
      if (
        evento.key ===
        "Escape"
      ) {
        cerrarConGuardado();

        return;
      }


      if (
        evento.key
          .toLowerCase() ===
        "p"
      ) {
        if (
          !enJuegoRef.current
        ) {
          return;
        }


        if (
          cuentaRegresiva !==
          null
        ) {
          return;
        }


        if (pausado) {
          setCuentaRegresiva(
            3
          );
        } else {
          setPausado(true);
        }
      }
    };


    window.addEventListener(
      "keydown",
      teclado
    );


    return () => {
      window.removeEventListener(
        "keydown",
        teclado
      );
    };
  }, [
    juegoActivo,
    pausado,
    cuentaRegresiva,
    cerrarConGuardado,
  ]);


  /*
  =====================================
  BOTON PAUSA
  =====================================
  */

  const alternarPausa =
    () => {
      if (!enJuego) {
        return;
      }


      if (
        cuentaRegresiva !==
        null
      ) {
        return;
      }


      if (pausado) {
        /*
        Reanudar:
        siempre 3 segundos.
        */

        setCuentaRegresiva(
          3
        );
      } else {
        /*
        Pausar.
        */

        setPausado(true);
      }
    };


  /*
  =====================================
  CONFIGURACION
  =====================================
  */

  const abrirConfiguracion =
    () => {
      setPausado(true);


      setCuentaRegresiva(
        null
      );


      setConfigurando(
        true
      );
    };


  const cerrarConfiguracion =
    () => {
      setConfigurando(
        false
      );


      /*
      Después de modificar ajustes,
      damos 3 segundos.
      */

      if (
        enJuegoRef.current
      ) {
        setCuentaRegresiva(
          3
        );
      }
    };


  /*
  =====================================
  SIN JUEGO
  =====================================
  */

  if (!juegoActivo) {
    return null;
  }


  /*
  =====================================
  PROPS COMUNES
  =====================================
  */

  const propsJuego = {
    pausado:
      juegoDetenido,

    onPuntuacion:
      actualizarPuntuacion,

    onTerminar:
      finalizarDesdeJuego,

    onReiniciar:
      reiniciarSesion,
  };


  /*
  =====================================
  JUEGO ACTIVO
  =====================================
  */

  let contenido = null;


  if (
    juegoActivo ===
    "pong"
  ) {
    contenido = (
      <Pong
        {...propsJuego}
      />
    );
  }


  if (
    juegoActivo ===
    "viborita"
  ) {
    contenido = (
      <Viborita
        {...propsJuego}
      />
    );
  }


  if (
    juegoActivo ===
    "bloques"
  ) {
    contenido = (
      <RompeBloques
        {...propsJuego}
      />
    );
  }


  if (
    juegoActivo ===
    "disparos"
  ) {
    contenido = (
      <DisparosEspaciales
        {...propsJuego}
      />
    );
  }


  /*
  =====================================
  INTERFAZ
  =====================================
  */

  return (
    <div className="juego-modal-overlay">
      <section className="juego-modal">

        <header className="juego-modal-header">

          <div className="titulo-modal-juego">

            <span>
              ARCADE_RC
            </span>

            <h2>
              {
                NOMBRES[
                  juegoActivo
                ]
              }
            </h2>

          </div>


          <div className="controles-superiores-juego">

            <div className="tiempo-partida">

              {Math.floor(
                segundos /
                  60
              )
                .toString()
                .padStart(
                  2,
                  "0"
                )}

              :

              {(segundos % 60)
                .toString()
                .padStart(
                  2,
                  "0"
                )}

            </div>


            <button
              type="button"
              title={
                pausado
                  ? "Reanudar"
                  : "Pausar"
              }
              aria-label={
                pausado
                  ? "Reanudar"
                  : "Pausar"
              }
              onClick={
                alternarPausa
              }
            >

              {pausado ? (
                <IconoPlay />
              ) : (
                <IconoPausa />
              )}

            </button>


            <button
              type="button"
              title="Configuración"
              aria-label="Configuración"
              onClick={
                abrirConfiguracion
              }
            >
              <IconoEngranaje />
            </button>


            <button
              type="button"
              className="cerrar-juego"
              aria-label="Cerrar juego"
              onClick={
                cerrarConGuardado
              }
            >
              ×
            </button>

          </div>

        </header>


        <div className="area-juego">

          {contenido}


          {cuentaRegresiva !==
            null &&
            cuentaRegresiva >
              0 && (

              <div className="cuenta-regresiva-juego">

                <span>
                  PREPÁRATE
                </span>

                <strong>
                  {
                    cuentaRegresiva
                  }
                </strong>

              </div>
            )}


          {pausado &&
            cuentaRegresiva ===
              null &&
            !configurando &&
            enJuego && (

              <div className="pausa-juego-overlay">

                <span>
                  PAUSA
                </span>

                <button
                  type="button"
                  onClick={
                    alternarPausa
                  }
                >
                  Reanudar
                </button>

              </div>
            )}

        </div>


        {mensaje && (
          <div className="mensaje-partida">
            {mensaje}
          </div>
        )}


        {configurando && (
          <ConfiguracionJuegoModal
            juego={
              juegoActivo
            }
            cerrar={
              cerrarConfiguracion
            }
          />
        )}

      </section>
    </div>
  );
}


export default JuegoModal;