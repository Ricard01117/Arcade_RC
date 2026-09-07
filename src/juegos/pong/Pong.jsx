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

const META = 7;


function Pong({
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

  const punteroRef =
    useRef({
      activo: false,
      y: ALTO / 2,
    });


  const {
    configuracion,
  } =
    useConfiguracionJuegos();


  const config =
    configuracion.pong;


  const [
    marcador,
    setMarcador,
  ] = useState({
    jugador: 0,
    cpu: 0,
  });


  const [
    nivel,
    setNivel,
  ] = useState(1);


  const [
    terminado,
    setTerminado,
  ] = useState(false);


  const velocidadBase = () => {
    if (
      config.dificultad ===
      "facil"
    ) {
      return 4;
    }

    if (
      config.dificultad ===
      "dificil"
    ) {
      return 6.2;
    }

    return 5;
  };


  const cpuFactor = () => {
    if (
      config.dificultad ===
      "facil"
    ) {
      return 0.045;
    }

    if (
      config.dificultad ===
      "dificil"
    ) {
      return 0.095;
    }

    return 0.068;
  };


  const crearParticulas = (
    x,
    y,
    color
  ) => {
    return Array.from(
      {
        length: 26,
      },
      () => ({
        x,
        y,

        dx:
          (
            Math.random() -
            0.5
          ) *
          8,

        dy:
          (
            Math.random() -
            0.5
          ) *
          8,

        vida: 1,

        color,
      })
    );
  };


  const reiniciarPelota = (
    estado,
    direccion
  ) => {
    estado.pelota.x =
      ANCHO / 2;

    estado.pelota.y =
      ALTO / 2;

    estado.pelota.dx =
      0;

    estado.pelota.dy =
      0;

    estado.direccionPendiente =
      direccion;

    estado.rondaHasta =
      Date.now() +
      3000;
  };


  const iniciar =
    useCallback(() => {
      terminadoRef.current =
        false;


      punteroRef.current = {
        activo: false,
        y: ALTO / 2,
      };


      setTerminado(false);

      setMarcador({
        jugador: 0,
        cpu: 0,
      });

      setNivel(1);

      onPuntuacion(0);


      estadoRef.current = {
        jugador: {
          x: 32,

          y:
            ALTO / 2 -
            55,

          ancho: 14,

          alto: 110,
        },


        cpu: {
          x:
            ANCHO -
            46,

          y:
            ALTO / 2 -
            55,

          ancho: 14,

          alto: 110,
        },


        pelota: {
          x:
            ANCHO / 2,

          y:
            ALTO / 2,

          radio: 9,

          dx: 0,

          dy: 0,
        },


        puntosJugador: 0,

        puntosCpu: 0,

        nivel: 1,

        rondaHasta:
          Date.now() +
          3000,

        direccionPendiente:
          Math.random() >
          0.5
            ? 1
            : -1,

        particulas: [],
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
          "arrowup" ||
        tecla ===
          "arrowdown"
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


    const escalaY =
      ALTO /
      rect.height;


    punteroRef.current.y =
      (
        evento.clientY -
        rect.top
      ) *
      escalaY;
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


  const terminarPuntero = (
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


      const victoria =
        estado.puntosJugador >
        estado.puntosCpu;


      const puntos =
        estado.puntosJugador *
          100 +
        estado.nivel *
          50 +
        (
          victoria
            ? 500
            : 0
        );


      onPuntuacion(
        puntos
      );


      onTerminar({
        puntuacion:
          puntos,
      });
    };


    const dibujarMesa = () => {
      ctx.fillStyle =
        config.fondo;


      ctx.fillRect(
        0,
        0,
        ANCHO,
        ALTO
      );


      const gradiente =
        ctx.createRadialGradient(
          ANCHO / 2,
          ALTO / 2,
          10,
          ANCHO / 2,
          ALTO / 2,
          ANCHO / 2
        );


      gradiente.addColorStop(
        0,
        `${config.lineas}20`
      );


      gradiente.addColorStop(
        1,
        "transparent"
      );


      ctx.fillStyle =
        gradiente;


      ctx.fillRect(
        0,
        0,
        ANCHO,
        ALTO
      );


      ctx.save();

      ctx.strokeStyle =
        config.lineas;

      ctx.shadowColor =
        config.lineas;

      ctx.shadowBlur = 14;

      ctx.lineWidth = 3;


      ctx.strokeRect(
        12,
        12,
        ANCHO - 24,
        ALTO - 24
      );


      ctx.setLineDash([
        14,
        16,
      ]);


      ctx.beginPath();

      ctx.moveTo(
        ANCHO / 2,
        20
      );

      ctx.lineTo(
        ANCHO / 2,
        ALTO - 20
      );

      ctx.stroke();


      ctx.setLineDash([]);


      ctx.beginPath();

      ctx.arc(
        ANCHO / 2,
        ALTO / 2,
        70,
        0,
        Math.PI * 2
      );

      ctx.stroke();


      ctx.restore();
    };


    const dibujarPaleta = (
      paleta,
      color
    ) => {
      ctx.save();


      ctx.fillStyle =
        color;

      ctx.shadowColor =
        color;

      ctx.shadowBlur = 20;


      ctx.beginPath();

      ctx.roundRect(
        paleta.x,
        paleta.y,
        paleta.ancho,
        paleta.alto,
        7
      );

      ctx.fill();


      ctx.restore();
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
        !terminadoRef.current
      ) {
        const jugador =
          estado.jugador;

        const cpu =
          estado.cpu;

        const pelota =
          estado.pelota;


        /*
        TOUCH / MOUSE
        */

        if (
          punteroRef.current
            .activo
        ) {
          const objetivo =
            punteroRef.current
              .y -
            jugador.alto /
              2;


          jugador.y +=
            (
              objetivo -
              jugador.y
            ) *
            0.38;
        } else {
          /*
          TECLADO
          */

          if (
            teclasRef.current[
              "arrowup"
            ] ||
            teclasRef.current[
              "w"
            ]
          ) {
            jugador.y -= 7;
          }


          if (
            teclasRef.current[
              "arrowdown"
            ] ||
            teclasRef.current[
              "s"
            ]
          ) {
            jugador.y += 7;
          }
        }


        jugador.y =
          Math.max(
            18,
            Math.min(
              ALTO -
                jugador.alto -
                18,
              jugador.y
            )
          );


        const destinoCPU =
          pelota.y -
          cpu.alto / 2;


        cpu.y +=
          (
            destinoCPU -
            cpu.y
          ) *
          cpuFactor();


        cpu.y =
          Math.max(
            18,
            Math.min(
              ALTO -
                cpu.alto -
                18,
              cpu.y
            )
          );


        if (
          estado.rondaHasta &&
          Date.now() >=
            estado.rondaHasta
        ) {
          estado.rondaHasta =
            null;


          const base =
            velocidadBase() *
            (
              1 +
              (
                estado.nivel -
                1
              ) *
                0.07
            );


          pelota.dx =
            base *
            estado
              .direccionPendiente;


          pelota.dy =
            (
              Math.random() >
              0.5
                ? 1
                : -1
            ) *
            base *
            0.65;
        }


        if (
          !estado.rondaHasta
        ) {
          pelota.x +=
            pelota.dx;

          pelota.y +=
            pelota.dy;
        }


        if (
          pelota.y -
            pelota.radio <=
            15 ||
          pelota.y +
            pelota.radio >=
            ALTO - 15
        ) {
          pelota.dy *= -1;
        }


        /*
        COLISION JUGADOR
        */

        if (
          pelota.dx < 0 &&
          pelota.x -
            pelota.radio <=
            jugador.x +
              jugador.ancho &&
          pelota.x >
            jugador.x &&
          pelota.y >=
            jugador.y &&
          pelota.y <=
            jugador.y +
              jugador.alto
        ) {
          pelota.x =
            jugador.x +
            jugador.ancho +
            pelota.radio;


          pelota.dx =
            Math.abs(
              pelota.dx
            ) *
            1.03;


          const impacto =
            (
              pelota.y -
              (
                jugador.y +
                jugador.alto /
                  2
              )
            ) /
            (
              jugador.alto /
              2
            );


          pelota.dy +=
            impacto * 2;
        }


        /*
        COLISION CPU
        */

        if (
          pelota.dx > 0 &&
          pelota.x +
            pelota.radio >=
            cpu.x &&
          pelota.x <
            cpu.x +
              cpu.ancho &&
          pelota.y >=
            cpu.y &&
          pelota.y <=
            cpu.y +
              cpu.alto
        ) {
          pelota.x =
            cpu.x -
            pelota.radio;


          pelota.dx =
            -Math.abs(
              pelota.dx
            ) *
            1.03;


          const impacto =
            (
              pelota.y -
              (
                cpu.y +
                cpu.alto /
                  2
              )
            ) /
            (
              cpu.alto /
              2
            );


          pelota.dy +=
            impacto * 2;
        }


        /*
        PUNTO CPU
        */

        if (
          pelota.x < -20
        ) {
          estado.puntosCpu +=
            1;


          estado.particulas.push(
            ...crearParticulas(
              18,
              pelota.y,
              config.cpu
            )
          );


          setMarcador({
            jugador:
              estado
                .puntosJugador,

            cpu:
              estado
                .puntosCpu,
          });


          estado.nivel =
            1 +
            Math.floor(
              (
                estado
                  .puntosJugador +
                estado
                  .puntosCpu
              ) /
                2
            );


          setNivel(
            estado.nivel
          );


          reiniciarPelota(
            estado,
            1
          );
        }


        /*
        PUNTO JUGADOR
        */

        if (
          pelota.x >
          ANCHO + 20
        ) {
          estado.puntosJugador +=
            1;


          estado.particulas.push(
            ...crearParticulas(
              ANCHO - 18,
              pelota.y,
              config.jugador
            )
          );


          setMarcador({
            jugador:
              estado
                .puntosJugador,

            cpu:
              estado
                .puntosCpu,
          });


          estado.nivel =
            1 +
            Math.floor(
              (
                estado
                  .puntosJugador +
                estado
                  .puntosCpu
              ) /
                2
            );


          setNivel(
            estado.nivel
          );


          onPuntuacion(
            estado
              .puntosJugador *
              100
          );


          reiniciarPelota(
            estado,
            -1
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
                  0.97,

                dy:
                  particula.dy *
                  0.97,

                vida:
                  particula.vida -
                  0.025,
              })
            )
            .filter(
              (particula) =>
                particula.vida >
                0
            );


        if (
          estado.puntosJugador >=
            META ||
          estado.puntosCpu >=
            META
        ) {
          finalizar(
            estado
          );
        }
      }


      /*
      DIBUJAR
      */

      dibujarMesa();


      dibujarPaleta(
        estado.jugador,
        config.jugador
      );


      dibujarPaleta(
        estado.cpu,
        config.cpu
      );


      ctx.save();

      ctx.fillStyle =
        config.pelota;

      ctx.shadowColor =
        config.pelota;

      ctx.shadowBlur = 22;


      ctx.beginPath();

      ctx.arc(
        estado.pelota.x,
        estado.pelota.y,
        estado.pelota.radio,
        0,
        Math.PI * 2
      );

      ctx.fill();


      ctx.restore();


      estado.particulas.forEach(
        (particula) => {
          ctx.save();

          ctx.globalAlpha =
            particula.vida;

          ctx.fillStyle =
            particula.color;

          ctx.shadowColor =
            particula.color;

          ctx.shadowBlur = 8;


          ctx.fillRect(
            particula.x,
            particula.y,
            5,
            5
          );


          ctx.restore();
        }
      );


      if (
        estado.rondaHasta &&
        !terminadoRef.current
      ) {
        const restante =
          Math.max(
            1,
            Math.ceil(
              (
                estado.rondaHasta -
                Date.now()
              ) /
                1000
            )
          );


        ctx.save();


        ctx.fillStyle =
          "rgba(0,0,0,.48)";


        ctx.fillRect(
          0,
          0,
          ANCHO,
          ALTO
        );


        ctx.textAlign =
          "center";


        ctx.fillStyle =
          config.pelota;

        ctx.shadowColor =
          config.pelota;

        ctx.shadowBlur = 22;


        ctx.font =
          "700 74px Arial";


        ctx.fillText(
          restante,
          ANCHO / 2,
          ALTO / 2 + 25
        );


        ctx.font =
          "700 17px Arial";


        ctx.fillText(
          "SIGUIENTE RONDA",
          ANCHO / 2,
          ALTO / 2 - 65
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
            PONG NEON
          </span>

          <small>
            NIVEL {nivel}
            {" · "}
            {
              config.dificultad
                .toUpperCase()
            }
          </small>
        </div>


        <strong>
          {marcador.jugador}
          {" : "}
          {marcador.cpu}
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
          terminarPuntero
        }
        onPointerCancel={
          terminarPuntero
        }
      />


      <p className="controles-juego controles-pc">
        W/S o ↑/↓
      </p>


      <AyudaArrastreTouch
        texto="ARRASTRA EL DEDO ARRIBA O ABAJO"
      />


      {terminado && (
        <div className="juego-final">
          <h3>
            {
              marcador.jugador >
              marcador.cpu
                ? "VICTORIA"
                : "DERROTA"
            }
          </h3>

          <p>
            {marcador.jugador}
            {" : "}
            {marcador.cpu}
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


export default Pong;