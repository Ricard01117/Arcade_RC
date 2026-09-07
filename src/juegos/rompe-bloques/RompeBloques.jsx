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
} from "../../componentes/comunes/ControlesTouch";


const ANCHO = 760;
const ALTO = 470;


function RompeBloques({
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

  const punteroRef =
    useRef({
      activo: false,
      x: ANCHO / 2,
    });

  const terminadoRef =
    useRef(false);


  const {
    configuracion,
  } =
    useConfiguracionJuegos();


  const config =
    configuracion.bloques;


  const [
    puntuacion,
    setPuntuacion,
  ] = useState(0);


  const [
    vidas,
    setVidas,
  ] = useState(3);


  const [
    nivel,
    setNivel,
  ] = useState(1);


  const [
    bolas,
    setBolas,
  ] = useState(1);


  const [
    terminado,
    setTerminado,
  ] = useState(false);


  const crearBola = (
    nivelActual,
    direccion = 1
  ) => {
    const velocidad =
      4 +
      Math.min(
        nivelActual *
          0.35,
        3.2
      );


    return {
      x:
        ANCHO / 2,

      y:
        ALTO - 80,

      radio: 8,

      dx:
        velocidad *
        direccion,

      dy:
        -velocidad,
    };
  };


  const crearBloques = (
    nivelActual
  ) => {
    const filas =
      Math.min(
        4 +
          nivelActual,
        9
      );


    const columnas =
      Math.min(
        8 +
          Math.floor(
            nivelActual / 2
          ),
        11
      );


    const espacio = 7;

    const margen = 25;


    const ancho =
      (
        ANCHO -
        margen * 2 -
        espacio *
          (
            columnas -
            1
          )
      ) /
      columnas;


    const alto = 21;


    const nuevos = [];


    for (
      let fila = 0;
      fila < filas;
      fila++
    ) {
      for (
        let columna = 0;
        columna <
        columnas;
        columna++
      ) {
        const azar =
          Math.random();


        let tipo =
          "normal";


        if (
          azar < 0.055
        ) {
          tipo = "vida";
        } else if (
          azar < 0.14
        ) {
          tipo =
            "multibola";
        }


        nuevos.push({
          x:
            margen +
            columna *
              (
                ancho +
                espacio
              ),

          y:
            42 +
            fila *
              (
                alto +
                espacio
              ),

          ancho,

          alto,

          fila,

          tipo,

          activo: true,
        });
      }
    }


    return nuevos;
  };


  const crearChispas = (
    bloque,
    color
  ) => {
    return Array.from(
      {
        length: 8,
      },
      () => ({
        x:
          bloque.x +
          bloque.ancho /
            2,

        y:
          bloque.y +
          bloque.alto /
            2,

        dx:
          (
            Math.random() -
            0.5
          ) *
          5,

        dy:
          (
            Math.random() -
            0.5
          ) *
          5,

        vida: 1,

        color,
      })
    );
  };


  const iniciar =
    useCallback(() => {
      terminadoRef.current =
        false;


      punteroRef.current = {
        activo: false,
        x: ANCHO / 2,
      };


      setTerminado(false);

      setPuntuacion(0);

      setVidas(3);

      setNivel(1);

      setBolas(1);


      onPuntuacion(0);


      estadoRef.current = {
        nivel: 1,

        vidas: 3,

        puntuacion: 0,


        paleta: {
          x:
            ANCHO / 2 -
            65,

          y:
            ALTO - 33,

          ancho: 130,

          alto: 14,
        },


        bolas: [
          crearBola(1),
        ],


        bloques:
          crearBloques(1),


        particulas: [],


        cambioNivelHasta:
          Date.now() +
          1800,
      };
    }, [
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
        tecla ===
          "arrowleft" ||
        tecla ===
          "arrowright"
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
  TOUCH / MOUSE
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


    const finalizar = (
      estado
    ) => {
      if (
        terminadoRef.current
      ) {
        return;
      }


      terminadoRef.current =
        true;


      setTerminado(true);


      onTerminar({
        puntuacion:
          estado.puntuacion,
      });
    };


    const pasarNivel = (
      estado
    ) => {
      estado.nivel += 1;

      estado.vidas += 1;


      estado.puntuacion +=
        250 *
        estado.nivel;


      estado.bloques =
        crearBloques(
          estado.nivel
        );


      estado.bolas = [
        crearBola(
          estado.nivel
        ),
      ];


      estado.cambioNivelHasta =
        Date.now() +
        2200;


      setNivel(
        estado.nivel
      );


      setVidas(
        estado.vidas
      );


      setBolas(1);


      setPuntuacion(
        estado.puntuacion
      );


      onPuntuacion(
        estado.puntuacion
      );
    };


    const loop = () => {
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
        !terminadoRef.current &&
        (
          !estado
            .cambioNivelHasta ||
          Date.now() >=
            estado
              .cambioNivelHasta
        )
      ) {
        estado
          .cambioNivelHasta =
          null;


        /*
        TOUCH/MOUSE
        */

        if (
          punteroRef.current
            .activo
        ) {
          const objetivo =
            punteroRef.current
              .x -
            estado.paleta
              .ancho /
              2;


          estado.paleta.x +=
            (
              objetivo -
              estado.paleta.x
            ) *
            0.45;
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
            estado.paleta.x -=
              8;
          }


          if (
            teclasRef.current[
              "arrowright"
            ] ||
            teclasRef.current[
              "d"
            ]
          ) {
            estado.paleta.x +=
              8;
          }
        }


        estado.paleta.x =
          Math.max(
            10,
            Math.min(
              ANCHO -
                estado
                  .paleta
                  .ancho -
                10,

              estado.paleta.x
            )
          );


        estado.bolas.forEach(
          (bola) => {
            bola.x +=
              bola.dx;

            bola.y +=
              bola.dy;


            if (
              bola.x -
                bola.radio <=
                5 ||
              bola.x +
                bola.radio >=
                ANCHO - 5
            ) {
              bola.dx *= -1;
            }


            if (
              bola.y -
                bola.radio <=
                5
            ) {
              bola.dy =
                Math.abs(
                  bola.dy
                );
            }


            if (
              bola.dy > 0 &&
              bola.y +
                bola.radio >=
                estado
                  .paleta.y &&
              bola.y <
                estado
                  .paleta.y +
                  estado
                    .paleta
                    .alto &&
              bola.x >=
                estado
                  .paleta.x &&
              bola.x <=
                estado
                  .paleta.x +
                  estado
                    .paleta
                    .ancho
            ) {
              bola.y =
                estado
                  .paleta.y -
                bola.radio;


              bola.dy =
                -Math.abs(
                  bola.dy
                );


              const impacto =
                (
                  bola.x -
                  estado
                    .paleta.x
                ) /
                estado
                  .paleta
                  .ancho;


              bola.dx +=
                (
                  impacto -
                  0.5
                ) *
                3.5;
            }


            estado.bloques.forEach(
              (bloque) => {
                if (
                  !bloque.activo
                ) {
                  return;
                }


                const golpe =
                  bola.x +
                    bola.radio >
                    bloque.x &&
                  bola.x -
                    bola.radio <
                    bloque.x +
                      bloque.ancho &&
                  bola.y +
                    bola.radio >
                    bloque.y &&
                  bola.y -
                    bola.radio <
                    bloque.y +
                      bloque.alto;


                if (!golpe) {
                  return;
                }


                bloque.activo =
                  false;


                bola.dy *= -1;


                let puntos =
                  10 +
                  estado.nivel *
                    2;


                if (
                  bloque.tipo ===
                  "vida"
                ) {
                  estado.vidas +=
                    1;

                  puntos += 40;


                  setVidas(
                    estado.vidas
                  );
                }


                if (
                  bloque.tipo ===
                  "multibola"
                ) {
                  const cantidadActual =
                    estado.bolas
                      .length;


                  if (
                    cantidadActual <
                    4
                  ) {
                    estado.bolas.push({
                      ...bola,

                      dx:
                        Math.abs(
                          bola.dx
                        ),

                      dy:
                        -Math.abs(
                          bola.dy
                        ),
                    });
                  }


                  if (
                    cantidadActual <
                    3
                  ) {
                    estado.bolas.push({
                      ...bola,

                      dx:
                        -Math.abs(
                          bola.dx
                        ),

                      dy:
                        -Math.abs(
                          bola.dy
                        ),
                    });
                  }


                  puntos += 50;
                }


                estado.puntuacion +=
                  puntos;


                const color =
                  bloque.tipo ===
                  "vida"
                    ? config.vida
                    : bloque.tipo ===
                        "multibola"
                      ? config.multibola
                      : [
                          "#ff3f70",
                          "#ff9238",
                          "#ffd83f",
                          "#35e788",
                          "#35d8ff",
                          "#965cff",
                        ][
                          bloque.fila %
                          6
                        ];


                estado.particulas.push(
                  ...crearChispas(
                    bloque,
                    color
                  )
                );


                setPuntuacion(
                  estado.puntuacion
                );


                onPuntuacion(
                  estado.puntuacion
                );
              }
            );
          }
        );


        estado.bolas =
          estado.bolas.filter(
            (bola) =>
              bola.y -
                bola.radio <
              ALTO
          );


        if (
          estado.bolas.length ===
          0
        ) {
          estado.vidas -= 1;


          setVidas(
            estado.vidas
          );


          if (
            estado.vidas <=
            0
          ) {
            finalizar(
              estado
            );
          } else {
            estado.bolas = [
              crearBola(
                estado.nivel
              ),
            ];


            estado
              .cambioNivelHasta =
              Date.now() +
              1800;
          }
        }


        setBolas(
          estado.bolas.length
        );


        if (
          estado.bloques.every(
            (bloque) =>
              !bloque.activo
          )
        ) {
          pasarNivel(
            estado
          );
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
                  0.96,

                dy:
                  particula.dy *
                    0.96 +
                  0.04,

                vida:
                  particula.vida -
                  0.045,
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


      const colores = [
        "#ff3f70",
        "#ff9238",
        "#ffd83f",
        "#35e788",
        "#35d8ff",
        "#965cff",
      ];


      estado.bloques.forEach(
        (bloque) => {
          if (
            !bloque.activo
          ) {
            return;
          }


          const color =
            bloque.tipo ===
            "vida"
              ? config.vida
              : bloque.tipo ===
                  "multibola"
                ? config.multibola
                : colores[
                    bloque.fila %
                    colores.length
                  ];


          ctx.save();

          ctx.fillStyle =
            color;

          ctx.shadowColor =
            color;

          ctx.shadowBlur = 9;


          ctx.beginPath();

          ctx.roundRect(
            bloque.x,
            bloque.y,
            bloque.ancho,
            bloque.alto,
            4
          );

          ctx.fill();

          ctx.restore();


          if (
            bloque.tipo ===
              "vida" ||
            bloque.tipo ===
              "multibola"
          ) {
            ctx.fillStyle =
              "#071018";

            ctx.textAlign =
              "center";

            ctx.font =
              "bold 12px Arial";


            ctx.fillText(
              bloque.tipo ===
                "vida"
                ? "+1"
                : "×2",

              bloque.x +
                bloque.ancho /
                  2,

              bloque.y + 15
            );
          }
        }
      );


      ctx.save();

      ctx.fillStyle =
        config.paleta;

      ctx.shadowColor =
        config.paleta;

      ctx.shadowBlur = 16;


      ctx.beginPath();

      ctx.roundRect(
        estado.paleta.x,
        estado.paleta.y,
        estado.paleta.ancho,
        estado.paleta.alto,
        7
      );

      ctx.fill();

      ctx.restore();


      estado.bolas.forEach(
        (bola) => {
          ctx.save();

          ctx.fillStyle =
            config.pelota;

          ctx.shadowColor =
            config.pelota;

          ctx.shadowBlur = 14;


          ctx.beginPath();

          ctx.arc(
            bola.x,
            bola.y,
            bola.radio,
            0,
            Math.PI * 2
          );

          ctx.fill();

          ctx.restore();
        }
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

          ctx.shadowBlur = 5;


          ctx.fillRect(
            particula.x,
            particula.y,
            4,
            4
          );


          ctx.restore();
        }
      );


      if (
        estado
          .cambioNivelHasta
      ) {
        ctx.save();


        ctx.fillStyle =
          "rgba(0,0,0,.62)";


        ctx.fillRect(
          0,
          0,
          ANCHO,
          ALTO
        );


        ctx.textAlign =
          "center";


        ctx.fillStyle =
          "#ffd83f";

        ctx.shadowColor =
          "#ffd83f";

        ctx.shadowBlur = 18;


        ctx.font =
          "800 46px Arial";


        ctx.fillText(
          `NIVEL ${estado.nivel}`,
          ANCHO / 2,
          ALTO / 2
        );


        ctx.font =
          "700 17px Arial";


        ctx.fillText(
          "+1 VIDA",
          ANCHO / 2,
          ALTO / 2 + 42
        );


        ctx.restore();
      }


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
            ROMPE BLOQUES
          </span>

          <small>
            NIVEL {nivel}
            {" · "}
            BOLAS {bolas}
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
        Verde = vida ·
        Amarillo = multibola
      </p>


      <AyudaArrastreTouch
        texto="ARRASTRA EL DEDO PARA MOVER LA PLATAFORMA"
      />


      {terminado && (
        <div className="juego-final">
          <h3>
            GAME OVER
          </h3>

          <p>
            Nivel alcanzado:{" "}
            {nivel}
          </p>

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


export default RompeBloques;