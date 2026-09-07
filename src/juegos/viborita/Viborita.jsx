import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useConfiguracionJuegos,
} from "../../contexto/ContextoConfiguracionJuegos";

import {
  CrucetaTouch,
} from "../../componentes/comunes/ControlesTouch";


const ANCHO = 760;
const ALTO = 470;
const TAMANO = 20;


function Viborita({
  pausado,
  onPuntuacion,
  onTerminar,
  onReiniciar,
}) {
  const canvasRef =
    useRef(null);

  const intervaloRef =
    useRef(null);

  const serpienteRef =
    useRef([]);

  const direccionRef =
    useRef({
      x: 1,
      y: 0,
    });

  const comidaRef =
    useRef({
      x: 300,
      y: 200,
    });

  const terminadoRef =
    useRef(false);

  const inicioSwipeRef =
    useRef(null);


  const {
    configuracion,
  } =
    useConfiguracionJuegos();


  const config =
    configuracion.viborita;


  const [
    puntuacion,
    setPuntuacion,
  ] = useState(0);


  const [
    longitud,
    setLongitud,
  ] = useState(3);


  const [
    terminado,
    setTerminado,
  ] = useState(false);


  const velocidad = () => {
    if (
      config.dificultad ===
      "facil"
    ) {
      return 145;
    }

    if (
      config.dificultad ===
      "dificil"
    ) {
      return 68;
    }

    return 100;
  };


  const cambiarDireccion =
    useCallback(
      (
        nuevaDireccion
      ) => {
        const actual =
          direccionRef.current;


        if (
          nuevaDireccion ===
            "arriba" &&
          actual.y !== 1
        ) {
          direccionRef.current = {
            x: 0,
            y: -1,
          };
        }


        if (
          nuevaDireccion ===
            "abajo" &&
          actual.y !== -1
        ) {
          direccionRef.current = {
            x: 0,
            y: 1,
          };
        }


        if (
          nuevaDireccion ===
            "izquierda" &&
          actual.x !== 1
        ) {
          direccionRef.current = {
            x: -1,
            y: 0,
          };
        }


        if (
          nuevaDireccion ===
            "derecha" &&
          actual.x !== -1
        ) {
          direccionRef.current = {
            x: 1,
            y: 0,
          };
        }
      },
      []
    );


  const generarComida =
    useCallback(() => {
      let nueva;


      do {
        nueva = {
          x:
            Math.floor(
              Math.random() *
                (
                  ANCHO /
                  TAMANO
                )
            ) *
            TAMANO,

          y:
            Math.floor(
              Math.random() *
                Math.floor(
                  ALTO /
                  TAMANO
                )
            ) *
            TAMANO,
        };
      } while (
        serpienteRef.current.some(
          (parte) =>
            parte.x ===
              nueva.x &&
            parte.y ===
              nueva.y
        )
      );


      comidaRef.current =
        nueva;
    }, []);


  const finalizar =
    useCallback(() => {
      if (
        terminadoRef.current
      ) {
        return;
      }


      terminadoRef.current =
        true;


      clearInterval(
        intervaloRef.current
      );


      setTerminado(true);


      setPuntuacion(
        (puntos) => {
          onTerminar({
            puntuacion:
              puntos,
          });

          return puntos;
        }
      );
    }, [
      onTerminar,
    ]);


  const iniciar =
    useCallback(() => {
      clearInterval(
        intervaloRef.current
      );


      terminadoRef.current =
        false;


      setPuntuacion(0);

      setLongitud(3);

      setTerminado(false);


      onPuntuacion(0);


      serpienteRef.current = [
        {
          x: 380,
          y: 240,
        },

        {
          x: 360,
          y: 240,
        },

        {
          x: 340,
          y: 240,
        },
      ];


      direccionRef.current = {
        x: 1,
        y: 0,
      };


      generarComida();
    }, [
      generarComida,
      onPuntuacion,
    ]);


  useEffect(() => {
    iniciar();
  }, [
    iniciar,
  ]);


  useEffect(() => {
    clearInterval(
      intervaloRef.current
    );


    intervaloRef.current =
      setInterval(
        () => {
          if (
            pausado ||
            terminadoRef.current
          ) {
            return;
          }


          const serpiente = [
            ...serpienteRef.current,
          ];


          const direccion =
            direccionRef.current;


          const cabeza = {
            x:
              serpiente[0].x +
              direccion.x *
                TAMANO,

            y:
              serpiente[0].y +
              direccion.y *
                TAMANO,
          };


          const fuera =
            cabeza.x < 0 ||
            cabeza.y < 0 ||
            cabeza.x >
              ANCHO -
                TAMANO ||
            cabeza.y >
              ALTO -
                TAMANO;


          const choque =
            serpiente.some(
              (parte) =>
                parte.x ===
                  cabeza.x &&
                parte.y ===
                  cabeza.y
            );


          if (
            fuera ||
            choque
          ) {
            finalizar();

            return;
          }


          serpiente.unshift(
            cabeza
          );


          if (
            cabeza.x ===
              comidaRef.current
                .x &&
            cabeza.y ===
              comidaRef.current
                .y
          ) {
            setPuntuacion(
              (actual) => {
                const nuevo =
                  actual + 10;

                onPuntuacion(
                  nuevo
                );

                return nuevo;
              }
            );


            setLongitud(
              serpiente.length
            );


            generarComida();
          } else {
            serpiente.pop();
          }


          serpienteRef.current =
            serpiente;
        },
        velocidad()
      );


    return () =>
      clearInterval(
        intervaloRef.current
      );
  }, [
    pausado,
    config.dificultad,
    finalizar,
    generarComida,
    onPuntuacion,
  ]);


  /*
  ==============================
  TECLADO
  ==============================
  */

  useEffect(() => {
    const teclado = (
      evento
    ) => {
      const tecla =
        evento.key
          .toLowerCase();


      if (
        [
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
        ].includes(
          tecla
        )
      ) {
        evento.preventDefault();
      }


      if (
        tecla ===
          "arrowup" ||
        tecla === "w"
      ) {
        cambiarDireccion(
          "arriba"
        );
      }


      if (
        tecla ===
          "arrowdown" ||
        tecla === "s"
      ) {
        cambiarDireccion(
          "abajo"
        );
      }


      if (
        tecla ===
          "arrowleft" ||
        tecla === "a"
      ) {
        cambiarDireccion(
          "izquierda"
        );
      }


      if (
        tecla ===
          "arrowright" ||
        tecla === "d"
      ) {
        cambiarDireccion(
          "derecha"
        );
      }
    };


    window.addEventListener(
      "keydown",
      teclado,
      {
        passive: false,
      }
    );


    return () =>
      window.removeEventListener(
        "keydown",
        teclado
      );
  }, [
    cambiarDireccion,
  ]);


  /*
  ==============================
  SWIPE
  ==============================
  */

  const comenzarSwipe = (
    evento
  ) => {
    evento.preventDefault();


    inicioSwipeRef.current = {
      x: evento.clientX,
      y: evento.clientY,
    };


    evento.currentTarget
      .setPointerCapture?.(
        evento.pointerId
      );
  };


  const terminarSwipe = (
    evento
  ) => {
    evento.preventDefault();


    const inicio =
      inicioSwipeRef.current;


    if (!inicio) {
      return;
    }


    const dx =
      evento.clientX -
      inicio.x;

    const dy =
      evento.clientY -
      inicio.y;


    inicioSwipeRef.current =
      null;


    const minimo = 22;


    if (
      Math.abs(dx) <
        minimo &&
      Math.abs(dy) <
        minimo
    ) {
      return;
    }


    if (
      Math.abs(dx) >
      Math.abs(dy)
    ) {
      cambiarDireccion(
        dx > 0
          ? "derecha"
          : "izquierda"
      );
    } else {
      cambiarDireccion(
        dy > 0
          ? "abajo"
          : "arriba"
      );
    }
  };


  /*
  ==============================
  DIBUJO
  ==============================
  */

  useEffect(() => {
    const canvas =
      canvasRef.current;


    if (!canvas) {
      return;
    }


    const ctx =
      canvas.getContext("2d");


    let frame;


    const dibujar = (
      tiempo
    ) => {
      ctx.fillStyle =
        config.fondo;


      ctx.fillRect(
        0,
        0,
        ANCHO,
        ALTO
      );


      ctx.strokeStyle =
        "rgba(100,180,255,.07)";

      ctx.lineWidth = 1;


      for (
        let x = 0;
        x <= ANCHO;
        x += TAMANO
      ) {
        ctx.beginPath();

        ctx.moveTo(
          x,
          0
        );

        ctx.lineTo(
          x,
          ALTO
        );

        ctx.stroke();
      }


      for (
        let y = 0;
        y <= ALTO;
        y += TAMANO
      ) {
        ctx.beginPath();

        ctx.moveTo(
          0,
          y
        );

        ctx.lineTo(
          ANCHO,
          y
        );

        ctx.stroke();
      }


      const pulso =
        7 +
        Math.sin(
          tiempo / 170
        ) *
          2;


      ctx.save();

      ctx.fillStyle =
        config.comida;

      ctx.shadowColor =
        config.comida;

      ctx.shadowBlur = 24;


      ctx.beginPath();

      ctx.arc(
        comidaRef.current.x +
          TAMANO / 2,

        comidaRef.current.y +
          TAMANO / 2,

        pulso,

        0,

        Math.PI * 2
      );

      ctx.fill();

      ctx.restore();


      serpienteRef.current.forEach(
        (
          parte,
          indice
        ) => {
          const color =
            indice === 0
              ? config.cabeza
              : config.viborita;


          ctx.save();

          ctx.fillStyle =
            color;

          ctx.shadowColor =
            color;

          ctx.shadowBlur =
            indice === 0
              ? 20
              : 12;


          ctx.beginPath();

          ctx.roundRect(
            parte.x + 2,
            parte.y + 2,
            TAMANO - 4,
            TAMANO - 4,
            5
          );

          ctx.fill();


          if (
            indice === 0
          ) {
            ctx.shadowBlur =
              0;

            ctx.fillStyle =
              "#071019";


            const dir =
              direccionRef.current;


            if (
              dir.x !== 0
            ) {
              const ojoX =
                dir.x > 0
                  ? parte.x +
                    15
                  : parte.x +
                    5;


              ctx.beginPath();

              ctx.arc(
                ojoX,
                parte.y + 7,
                1.8,
                0,
                Math.PI * 2
              );

              ctx.arc(
                ojoX,
                parte.y + 13,
                1.8,
                0,
                Math.PI * 2
              );

              ctx.fill();
            } else {
              const ojoY =
                dir.y > 0
                  ? parte.y +
                    15
                  : parte.y +
                    5;


              ctx.beginPath();

              ctx.arc(
                parte.x + 7,
                ojoY,
                1.8,
                0,
                Math.PI * 2
              );

              ctx.arc(
                parte.x + 13,
                ojoY,
                1.8,
                0,
                Math.PI * 2
              );

              ctx.fill();
            }
          }


          ctx.restore();
        }
      );


      frame =
        requestAnimationFrame(
          dibujar
        );
    };


    frame =
      requestAnimationFrame(
        dibujar
      );


    return () =>
      cancelAnimationFrame(
        frame
      );
  }, [
    config,
  ]);


  const reiniciar = () => {
    onReiniciar();

    iniciar();
  };


  return (
    <div className="juego-contenido">
      <div className="juego-hud juego-hud-detallado">
        <div>
          <span>
            VIBORITA NEON
          </span>

          <small>
            LONGITUD{" "}
            {longitud}
            {" · "}
            {
              config.dificultad
                .toUpperCase()
            }
          </small>
        </div>


        <strong>
          {puntuacion}
        </strong>
      </div>


      <canvas
        ref={canvasRef}
        width={ANCHO}
        height={ALTO}
        className="canvas-juego canvas-touch"
        onPointerDown={
          comenzarSwipe
        }
        onPointerUp={
          terminarSwipe
        }
        onPointerCancel={() => {
          inicioSwipeRef.current =
            null;
        }}
      />


      <p className="controles-juego controles-pc">
        WASD o flechas
      </p>


      <CrucetaTouch
        onDireccion={
          cambiarDireccion
        }
      />


      {terminado && (
        <div className="juego-final">
          <h3>
            GAME OVER
          </h3>

          <p>
            Puntuación:{" "}
            {puntuacion}
          </p>

          <button
            type="button"
            onClick={
              reiniciar
            }
          >
            Nueva partida
          </button>
        </div>
      )}
    </div>
  );
}


export default Viborita;