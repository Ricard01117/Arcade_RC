import {
  useEffect,
  useRef,
  useState,
} from "react";


import {
  useJuego,
} from "../../contexto/ContextoJuego";


import {
  EVENTO_ESTADO_SERVIDOR,
} from "../../servicios/api";


import "../../estilos/esperaServidor.css";


function EsperaServidor() {
  const {
    juegoActivo,
  } = useJuego();


  const [
    estado,
    setEstado,
  ] = useState(
    "oculto"
  );


  const [
    segundos,
    setSegundos,
  ] = useState(
    0
  );


  const solicitudActivaRef =
    useRef(null);


  const temporizadorOcultarRef =
    useRef(null);


  useEffect(() => {
    const manejarEstado =
      (evento) => {
        const detalle =
          evento.detail ||
          {};


        const nuevoEstado =
          detalle.estado;


        const solicitudId =
          detalle.solicitudId;


        if (
          nuevoEstado ===
          "conectando"
        ) {
          if (
            temporizadorOcultarRef
              .current
          ) {
            window.clearTimeout(
              temporizadorOcultarRef
                .current
            );
          }


          solicitudActivaRef.current =
            solicitudId;


          setSegundos(
            0
          );


          setEstado(
            "conectando"
          );


          return;
        }


        if (
          !solicitudId ||
          solicitudActivaRef.current !==
            solicitudId
        ) {
          return;
        }


        if (
          nuevoEstado ===
          "conectado"
        ) {
          setEstado(
            "conectado"
          );


          temporizadorOcultarRef.current =
            window.setTimeout(
              () => {
                setEstado(
                  "oculto"
                );


                solicitudActivaRef.current =
                  null;
              },
              650
            );


          return;
        }


        if (
          nuevoEstado ===
          "error"
        ) {
          setEstado(
            "error"
          );


          temporizadorOcultarRef.current =
            window.setTimeout(
              () => {
                setEstado(
                  "oculto"
                );


                solicitudActivaRef.current =
                  null;
              },
              2200
            );
        }
      };


    window.addEventListener(
      EVENTO_ESTADO_SERVIDOR,
      manejarEstado
    );


    return () => {
      window.removeEventListener(
        EVENTO_ESTADO_SERVIDOR,
        manejarEstado
      );


      if (
        temporizadorOcultarRef
          .current
      ) {
        window.clearTimeout(
          temporizadorOcultarRef
            .current
        );
      }
    };
  }, []);


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


  useEffect(() => {
    solicitudActivaRef.current =
      null;


    setEstado(
      "oculto"
    );


    setSegundos(
      0
    );


    if (
      temporizadorOcultarRef
        .current
    ) {
      window.clearTimeout(
        temporizadorOcultarRef
          .current
      );
    }
  }, [
    juegoActivo,
  ]);


  if (
    !juegoActivo ||
    estado ===
      "oculto"
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
              PREPARANDO SERVIDOR
            </h3>


            <p>
              El servidor gratuito puede
              tardar hasta un minuto en
              activarse después de un
              periodo de inactividad.
            </p>


            <div className="espera-servidor-linea">
              <span
                className="espera-servidor-punto"
                aria-hidden="true"
              />

              Conectando...
            </div>


            <small>
              Esperando respuesta:{" "}
              {segundos} s
            </small>


            <small className="espera-servidor-ayuda">
              No cierres el juego.
              Iniciará automáticamente
              cuando el servidor esté listo.
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
              Preparando partida...
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
              No fue posible conectar con
              el servidor. Puedes volver
              a intentarlo.
            </p>
          </>
        )}

      </div>
    </div>
  );
}


export default EsperaServidor;