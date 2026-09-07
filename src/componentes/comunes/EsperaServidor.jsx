import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";


import {
  comprobarServidor,
} from "../../servicios/api";


import "../../estilos/esperaServidor.css";


function EsperaServidor() {
  const [
    estado,
    setEstado,
  ] = useState(
    "conectando"
  );


  const [
    segundos,
    setSegundos,
  ] = useState(
    0
  );


  const componenteActivoRef =
    useRef(true);


  const temporizadorListoRef =
    useRef(null);


  /*
  =====================================
  CONECTAR CON RENDER

  Esto ocurre UNA SOLA VEZ cuando
  se carga Arcade_RC.

  No depende de:
  - Viborita
  - Pong
  - Disparos
  - Rompe Bloques

  Por lo tanto, abrir juegos no vuelve
  a mostrar esta pantalla.
  =====================================
  */

  const conectarServidor =
    useCallback(
      async () => {
        setEstado(
          "conectando"
        );


        setSegundos(
          0
        );


        try {
          await comprobarServidor();


          if (
            !componenteActivoRef
              .current
          ) {
            return;
          }


          setEstado(
            "conectado"
          );


          /*
          Mostramos brevemente el
          mensaje de servidor conectado.
          */
          temporizadorListoRef.current =
            window.setTimeout(
              () => {
                if (
                  componenteActivoRef
                    .current
                ) {
                  setEstado(
                    "listo"
                  );
                }
              },
              1000
            );
        } catch (error) {
          console.error(
            "Error conectando con el servidor:",
            error
          );


          if (
            componenteActivoRef
              .current
          ) {
            setEstado(
              "error"
            );
          }
        }
      },
      []
    );


  /*
  =====================================
  INICIO
  =====================================
  */

  useEffect(() => {
    componenteActivoRef.current =
      true;


    conectarServidor();


    return () => {
      componenteActivoRef.current =
        false;


      if (
        temporizadorListoRef
          .current
      ) {
        window.clearTimeout(
          temporizadorListoRef
            .current
        );
      }
    };
  }, [
    conectarServidor,
  ]);


  /*
  =====================================
  CONTADOR DE ESPERA
  =====================================
  */

  useEffect(() => {
    if (
      estado !==
      "conectando"
    ) {
      return undefined;
    }


    const reloj =
      window.setInterval(
        () => {
          setSegundos(
            (actual) =>
              actual + 1
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
    estado,
  ]);


  /*
  =====================================
  SERVIDOR LISTO

  Cuando llegamos aquí, la pantalla
  desaparece por completo.

  No vuelve a mostrarse mientras la
  página siga abierta.
  =====================================
  */

  if (
    estado ===
    "listo"
  ) {
    return null;
  }


  return (
    <div
      className={
        `espera-servidor-overlay estado-${estado}`
      }
      aria-live="polite"
      aria-busy={
        estado ===
        "conectando"
      }
    >
      <div className="espera-servidor-tarjeta">

        <span className="espera-servidor-marca">
          ARCADE_RC
        </span>


        {estado ===
          "conectando" && (
          <>
            <div
              className="espera-servidor-spinner"
              aria-hidden="true"
            />


            <h3>
              ENCENDIENDO SERVIDOR
            </h3>


            <p>
              Estamos conectando
              Arcade_RC con el servidor.
            </p>


            <div className="espera-servidor-linea">

              <span
                className="espera-servidor-punto"
                aria-hidden="true"
              />

              Conectando al servidor...

            </div>


            <small className="espera-servidor-tiempo">
              Tiempo de espera:{" "}
              {segundos} s
            </small>


            <small className="espera-servidor-ayuda">
              El servidor gratuito puede
              tardar unos segundos en
              activarse después de un
              periodo de inactividad.
            </small>
          </>
        )}


        {estado ===
          "conectado" && (
          <>
            <div
              className="espera-servidor-correcto"
              aria-hidden="true"
            >
              ✓
            </div>


            <h3>
              SERVIDOR CONECTADO
            </h3>


            <p>
              Arcade_RC está listo.
            </p>
          </>
        )}


        {estado ===
          "error" && (
          <>
            <div
              className="espera-servidor-error"
              aria-hidden="true"
            >
              ×
            </div>


            <h3>
              SIN CONEXIÓN
            </h3>


            <p>
              No fue posible conectar
              con el servidor.
            </p>


            <button
              type="button"
              className="espera-servidor-reintentar"
              onClick={
                conectarServidor
              }
            >
              Reintentar
            </button>
          </>
        )}

      </div>
    </div>
  );
}


export default EsperaServidor;