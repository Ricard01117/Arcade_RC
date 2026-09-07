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
  AyudaArrastreTouch,
  BotonDisparoTouch,
} from "../../componentes/comunes/ControlesTouch";


const ANCHO = 760;
const ALTO = 470;


function DisparosEspaciales({
  pausado,
  onPuntuacion,
  onTerminar,
  onReiniciar,
}) {
  const canvasRef =
    useRef(null);

  const frameRef =
    useRef(null);

  const estadoRef =
    useRef(null);

  const teclasRef =
    useRef({});

  const terminadoRef =
    useRef(false);

  const disparoTouchRef =
    useRef(false);

  const punteroRef =
    useRef({
      activo: false,
      x: ANCHO / 2,
    });


  const {
    configuracion,
  } =
    useConfiguracionJuegos();


  const config =
    configuracion.disparos;


  const [
    puntuacion,
    setPuntuacion,
  ] = useState(0);


  const [
    vidas,
    setVidas,
  ] = useState(3);


  const [
    arma,
    setArma,
  ] = useState(1);


  const [
    terminado,
    setTerminado,
  ] = useState(false);


  const valoresDificultad =
    () => {
      if (
        config.dificultad ===
        "facil"
      ) {
        return {
          spawn: 1000,
          velocidad: 1.3,
          vidas: 4,
        };
      }


      if (
        config.dificultad ===
        "dificil"
      ) {
        return {
          spawn: 480,
          velocidad: 2.5,
          vidas: 2,
        };
      }


      return {
        spawn: 720,
        velocidad: 1.8,
        vidas: 3,
      };
    };


  const crearExplosion = (
    x,
    y,
    color,
    cantidad = 16
  ) => {
    return Array.from(
      {
        length:
          cantidad,
      },
      () => ({
        x,
        y,

        dx:
          (
            Math.random() -
            0.5
          ) *
          6,

        dy:
          (
            Math.random() -
            0.5
          ) *
          6,

        vida: 1,

        color,
      })
    );
  };


  const iniciar =
    useCallback(() => {
      const dificultad =
        valoresDificultad();


      terminadoRef.current =
        false;

      disparoTouchRef.current =
        false;


      punteroRef.current = {
        activo: false,
        x: ANCHO / 2,
      };


      setTerminado(false);

      setPuntuacion(0);

      setVidas(
        dificultad.vidas
      );

      setArma(1);


      onPuntuacion(0);


      estadoRef.current = {
        jugador: {
          x:
            ANCHO / 2,

          y:
            ALTO - 55,

          ancho: 45,

          alto: 38,
        },


        balas: [],

        enemigos: [],

        particulas: [],

        puntuacion: 0,

        vidas:
          dificultad.vidas,

        arma: 1,

        ultimaBala: 0,

        ultimoEnemigo: 0,
      };
    }, [
      config.dificultad,
      onPuntuacion,
    ]);


  useEffect(() => {
    iniciar();


    const abajo = (
      evento
    ) => {
      const tecla =
        evento.key
          .toLowerCase();


      if (
        [
          "arrowleft",
          "arrowright",
          " ",
        ].includes(
          tecla
        )
      ) {
        evento.preventDefault();
      }


      teclasRef.current[
        tecla
      ] = true;
    };


    const arriba = (
      evento
    ) => {
      teclasRef.current[
        evento.key
          .toLowerCase()
      ] = false;
    };


    window.addEventListener(
      "keydown",
      abajo,
      {
        passive: false,
      }
    );

    window.addEventListener(
      "keyup",
      arriba
    );


    return () => {
      window.removeEventListener(
        "keydown",
        abajo
      );

      window.removeEventListener(
        "keyup",
        arriba
      );


      cancelAnimationFrame(
        frameRef.current
      );
    };
  }, [
    iniciar,
  ]);


  /*
  ==============================
  POINTER
  ==============================
  */

  const actualizarPuntero = (
    evento
  ) => {
    evento.preventDefault();


    const canvas =
      canvasRef.current;


    if (!canvas) {
      return;
    }


    const rect =
      canvas
        .getBoundingClientRect();


    const escala =
      ANCHO /
      rect.width;


    punteroRef.current.x =
      (
        evento.clientX -
        rect.left
      ) *
      escala;
  };


  const iniciarPuntero = (
    evento
  ) => {
    evento.preventDefault();


    punteroRef.current.activo =
      true;


    actualizarPuntero(
      evento
    );


    evento.currentTarget
      .setPointerCapture?.(
        evento.pointerId
      );
  };


  const finalizarPuntero = (
    evento
  ) => {
    evento.preventDefault();


    punteroRef.current.activo =
      false;
  };


  useEffect(() => {
    const canvas =
      canvasRef.current;


    if (!canvas) {
      return;
    }


    const ctx =
      canvas.getContext("2d");


    const colision = (
      bala,
      enemigo
    ) => {
      return (
        bala.x >
          enemigo.x -
            enemigo.ancho /
              2 &&
        bala.x <
          enemigo.x +
            enemigo.ancho /
              2 &&
        bala.y >
          enemigo.y -
            enemigo.alto /
              2 &&
        bala.y <
          enemigo.y +
            enemigo.alto /
              2
      );
    };


    const disparar = (
      estado,
      tiempo
    ) => {
      const cooldown =
        estado.arma === 1
          ? 230
          : estado.arma ===
              2
            ? 180
            : 140;


      if (
        tiempo -
          estado.ultimaBala <
        cooldown
      ) {
        return;
      }


      const jugador =
        estado.jugador;


      if (
        estado.arma === 1
      ) {
        estado.balas.push({
          x: jugador.x,

          y:
            jugador.y -
            22,

          dx: 0,

          dy: -8,
        });
      }


      if (
        estado.arma === 2
      ) {
        estado.balas.push(
          {
            x:
              jugador.x -
              12,

            y:
              jugador.y -
              20,

            dx: 0,

            dy: -8.5,
          },

          {
            x:
              jugador.x +
              12,

            y:
              jugador.y -
              20,

            dx: 0,

            dy: -8.5,
          }
        );
      }


      if (
        estado.arma >= 3
      ) {
        estado.balas.push(
          {
            x:
              jugador.x,

            y:
              jugador.y -
              23,

            dx: 0,

            dy: -9,
          },

          {
            x:
              jugador.x -
              13,

            y:
              jugador.y -
              18,

            dx: -1.4,

            dy: -8.4,
          },

          {
            x:
              jugador.x +
              13,

            y:
              jugador.y -
              18,

            dx: 1.4,

            dy: -8.4,
          }
        );
      }


      estado.ultimaBala =
        tiempo;
    };


    const crearEnemigo = (
      estado,
      tiempo
    ) => {
      const dificultad =
        valoresDificultad();


      if (
        tiempo -
          estado.ultimoEnemigo <
        dificultad.spawn
      ) {
        return;
      }


      const especial =
        Math.random() <
        0.09;


      estado.enemigos.push({
        x:
          45 +
          Math.random() *
            (
              ANCHO -
              90
            ),

        y: -35,

        ancho:
          especial
            ? 48
            : 40,

        alto:
          especial
            ? 34
            : 30,

        especial,

        vida:
          especial
            ? 2
            : 1,

        velocidad:
          dificultad.velocidad +
          Math.random() *
            0.7,

        fase:
          Math.random() *
          Math.PI *
          2,
      });


      estado.ultimoEnemigo =
        tiempo;
    };


    const dibujarJugador = (
      jugador
    ) => {
      ctx.save();

      ctx.translate(
        jugador.x,
        jugador.y
      );


      ctx.fillStyle =
        config.jugador;

      ctx.shadowColor =
        config.jugador;

      ctx.shadowBlur = 20;


      ctx.beginPath();

      ctx.moveTo(
        0,
        -25
      );

      ctx.lineTo(
        -21,
        15
      );

      ctx.lineTo(
        -10,
        10
      );

      ctx.lineTo(
        -5,
        22
      );

      ctx.lineTo(
        0,
        15
      );

      ctx.lineTo(
        5,
        22
      );

      ctx.lineTo(
        10,
        10
      );

      ctx.lineTo(
        21,
        15
      );

      ctx.closePath();

      ctx.fill();


      ctx.fillStyle =
        "#ffffff";

      ctx.globalAlpha =
        0.65;


      ctx.beginPath();

      ctx.arc(
        0,
        -5,
        5,
        0,
        Math.PI * 2
      );

      ctx.fill();


      ctx.restore();
    };


    const dibujarEnemigo = (
      enemigo
    ) => {
      const color =
        enemigo.especial
          ? config.especial
          : config.enemigo;


      ctx.save();

      ctx.translate(
        enemigo.x,
        enemigo.y
      );


      ctx.fillStyle =
        color;

      ctx.shadowColor =
        color;

      ctx.shadowBlur =
        enemigo.especial
          ? 22
          : 12;


      ctx.beginPath();

      ctx.moveTo(
        0,
        18
      );

      ctx.lineTo(
        -22,
        -10
      );

      ctx.lineTo(
        -10,
        -8
      );

      ctx.lineTo(
        -6,
        -20
      );

      ctx.lineTo(
        0,
        -13
      );

      ctx.lineTo(
        6,
        -20
      );

      ctx.lineTo(
        10,
        -8
      );

      ctx.lineTo(
        22,
        -10
      );

      ctx.closePath();

      ctx.fill();


      if (
        enemigo.especial
      ) {
        ctx.fillStyle =
          "#ffffff";


        ctx.beginPath();

        ctx.arc(
          0,
          0,
          4,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }


      ctx.restore();
    };


    const perderVida = (
      estado,
      enemigo
    ) => {
      estado.particulas.push(
        ...crearExplosion(
          enemigo.x,
          enemigo.y,
          config.enemigo,
          18
        )
      );


      estado.vidas -= 1;


      setVidas(
        estado.vidas
      );


      if (
        estado.vidas <= 0
      ) {
        terminadoRef.current =
          true;


        setTerminado(true);


        onTerminar({
          puntuacion:
            estado.puntuacion,
        });
      }
    };


    const loop = (
      tiempo
    ) => {
      const estado =
        estadoRef.current;


      if (!estado) {
        frameRef.current =
          requestAnimationFrame(
            loop
          );

        return;
      }


      if (
        !pausado &&
        !terminadoRef.current
      ) {
        const jugador =
          estado.jugador;


        /*
        TOUCH / MOUSE
        */

        if (
          punteroRef.current
            .activo
        ) {
          const objetivo =
            punteroRef.current
              .x;


          jugador.x +=
            (
              objetivo -
              jugador.x
            ) *
            0.35;
        } else {
          /*
          TECLADO
          */

          if (
            teclasRef.current[
              "arrowleft"
            ] ||
            teclasRef.current[
              "a"
            ]
          ) {
            jugador.x -= 7;
          }


          if (
            teclasRef.current[
              "arrowright"
            ] ||
            teclasRef.current[
              "d"
            ]
          ) {
            jugador.x += 7;
          }
        }


        jugador.x =
          Math.max(
            28,
            Math.min(
              ANCHO - 28,
              jugador.x
            )
          );


        if (
          teclasRef.current[
            " "
          ] ||
          teclasRef.current[
            "space"
          ] ||
          disparoTouchRef.current
        ) {
          disparar(
            estado,
            tiempo
          );
        }


        crearEnemigo(
          estado,
          tiempo
        );


        estado.balas.forEach(
          (bala) => {
            bala.x +=
              bala.dx;

            bala.y +=
              bala.dy;
          }
        );


        estado.balas =
          estado.balas.filter(
            (bala) =>
              bala.y >
                -30 &&
              bala.x >
                -30 &&
              bala.x <
                ANCHO + 30
          );


        estado.enemigos.forEach(
          (enemigo) => {
            enemigo.y +=
              enemigo.velocidad;


            enemigo.x +=
              Math.sin(
                enemigo.y /
                  40 +
                  enemigo.fase
              ) *
              0.75;
          }
        );


        for (
          let e =
            estado.enemigos.length -
            1;

          e >= 0;

          e--
        ) {
          const enemigo =
            estado.enemigos[e];


          let destruido =
            false;


          for (
            let b =
              estado.balas.length -
              1;

            b >= 0;

            b--
          ) {
            if (
              !colision(
                estado.balas[b],
                enemigo
              )
            ) {
              continue;
            }


            estado.balas.splice(
              b,
              1
            );


            enemigo.vida -=
              1;


            if (
              enemigo.vida <=
              0
            ) {
              destruido =
                true;


              const color =
                enemigo.especial
                  ? config.especial
                  : config.enemigo;


              estado.particulas.push(
                ...crearExplosion(
                  enemigo.x,
                  enemigo.y,
                  color,
                  enemigo.especial
                    ? 30
                    : 16
                )
              );


              if (
                enemigo.especial
              ) {
                estado.arma =
                  Math.min(
                    3,
                    estado.arma +
                      1
                  );


                estado.puntuacion +=
                  50;


                setArma(
                  estado.arma
                );
              } else {
                estado.puntuacion +=
                  10;
              }


              setPuntuacion(
                estado.puntuacion
              );


              onPuntuacion(
                estado.puntuacion
              );


              estado.enemigos.splice(
                e,
                1
              );
            }


            break;
          }


          if (destruido) {
            continue;
          }


          const tocaJugador =
            Math.abs(
              enemigo.x -
              jugador.x
            ) <
              (
                enemigo.ancho +
                jugador.ancho
              ) /
                2 &&
            Math.abs(
              enemigo.y -
              jugador.y
            ) <
              (
                enemigo.alto +
                jugador.alto
              ) /
                2;


          if (
            tocaJugador ||
            enemigo.y >
              ALTO + 20
          ) {
            perderVida(
              estado,
              enemigo
            );


            estado.enemigos.splice(
              e,
              1
            );
          }
        }


        estado.particulas =
          estado.particulas
            .map(
              (particula) => ({
                ...particula,

                x:
                  particula.x +
                  particula.dx,

                y:
                  particula.y +
                  particula.dy,

                dx:
                  particula.dx *
                  0.97,

                dy:
                  particula.dy *
                  0.97,

                vida:
                  particula.vida -
                  0.035,
              })
            )
            .filter(
              (particula) =>
                particula.vida >
                0
            );
      }


      /*
      DIBUJO
      */

      ctx.fillStyle =
        config.fondo;


      ctx.fillRect(
        0,
        0,
        ANCHO,
        ALTO
      );


      for (
        let i = 0;
        i < 70;
        i++
      ) {
        const x =
          (
            i * 127 +
            tiempo *
              (
                0.015 +
                (
                  i % 3
                ) *
                  0.005
              )
          ) %
          ANCHO;


        const y =
          (
            i * 71 +
            tiempo *
              (
                0.025 +
                (
                  i % 4
                ) *
                  0.006
              )
          ) %
          ALTO;


        ctx.fillStyle =
          i % 7 === 0
            ? "rgba(80,180,255,.8)"
            : "rgba(255,255,255,.55)";


        ctx.fillRect(
          x,
          y,
          i % 5 === 0
            ? 2
            : 1,
          i % 5 === 0
            ? 2
            : 1
        );
      }


      estado.balas.forEach(
        (bala) => {
          ctx.save();


          ctx.fillStyle =
            "#fff25a";

          ctx.shadowColor =
            "#fff25a";

          ctx.shadowBlur = 12;


          ctx.fillRect(
            bala.x - 2,
            bala.y - 10,
            4,
            14
          );


          ctx.restore();
        }
      );


      estado.enemigos.forEach(
        dibujarEnemigo
      );


      dibujarJugador(
        estado.jugador
      );


      estado.particulas.forEach(
        (particula) => {
          ctx.save();


          ctx.globalAlpha =
            particula.vida;

          ctx.fillStyle =
            particula.color;

          ctx.shadowColor =
            particula.color;

          ctx.shadowBlur = 6;


          ctx.fillRect(
            particula.x,
            particula.y,
            4,
            4
          );


          ctx.restore();
        }
      );


      frameRef.current =
        requestAnimationFrame(
          loop
        );
    };


    frameRef.current =
      requestAnimationFrame(
        loop
      );


    return () =>
      cancelAnimationFrame(
        frameRef.current
      );
  }, [
    pausado,
    config,
    onPuntuacion,
    onTerminar,
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
            DEFENSA ESPACIAL
          </span>

          <small>
            ARMA NIVEL {arma}
            {" · "}
            {
              config.dificultad
                .toUpperCase()
            }
          </small>
        </div>


        <strong>
          {puntuacion}
          {" · "}
          VIDAS {vidas}
        </strong>
      </div>


      <canvas
        ref={canvasRef}
        width={ANCHO}
        height={ALTO}
        className="canvas-juego canvas-touch"
        onPointerDown={
          iniciarPuntero
        }
        onPointerMove={(
          evento
        ) => {
          if (
            punteroRef.current
              .activo
          ) {
            actualizarPuntero(
              evento
            );
          }
        }}
        onPointerUp={
          finalizarPuntero
        }
        onPointerCancel={
          finalizarPuntero
        }
      />


      <p className="controles-juego controles-pc">
        A/D o ←/→ ·
        ESPACIO para disparar
      </p>


      <div className="controles-touch-disparos">
        <AyudaArrastreTouch
          texto="ARRASTRA LA NAVE"
        />

        <BotonDisparoTouch
          onInicio={() => {
            disparoTouchRef.current =
              true;
          }}
          onFin={() => {
            disparoTouchRef.current =
              false;
          }}
        />
      </div>


      {terminado && (
        <div className="juego-final">
          <h3>
            MISIÓN TERMINADA
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


export default DisparosEspaciales;