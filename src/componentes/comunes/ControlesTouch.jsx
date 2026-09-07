import useDispositivoTouch from "../../hooks/useDispositivoTouch";


function BotonDireccion({
  direccion,
  etiqueta,
  onDireccion,
  className = "",
}) {
  const ejecutar = (
    evento
  ) => {
    evento.preventDefault();

    onDireccion(
      direccion
    );
  };


  return (
    <button
      type="button"
      className={`boton-direccion-touch ${className}`}
      onPointerDown={
        ejecutar
      }
      aria-label={
        `Mover ${direccion}`
      }
    >
      {etiqueta}
    </button>
  );
}


export function CrucetaTouch({
  onDireccion,
}) {
  const esTouch =
    useDispositivoTouch();


  if (!esTouch) {
    return null;
  }


  return (
    <div className="zona-cruceta-touch">
      <div className="cruceta-touch">
        <BotonDireccion
          direccion="arriba"
          etiqueta="▲"
          className="touch-arriba"
          onDireccion={
            onDireccion
          }
        />

        <BotonDireccion
          direccion="izquierda"
          etiqueta="◀"
          className="touch-izquierda"
          onDireccion={
            onDireccion
          }
        />

        <div className="centro-cruceta-touch" />

        <BotonDireccion
          direccion="derecha"
          etiqueta="▶"
          className="touch-derecha"
          onDireccion={
            onDireccion
          }
        />

        <BotonDireccion
          direccion="abajo"
          etiqueta="▼"
          className="touch-abajo"
          onDireccion={
            onDireccion
          }
        />
      </div>
    </div>
  );
}


export function BotonDisparoTouch({
  onInicio,
  onFin,
}) {
  const esTouch =
    useDispositivoTouch();


  if (!esTouch) {
    return null;
  }


  const detener = (
    evento
  ) => {
    evento.preventDefault();

    onFin?.();
  };


  return (
    <div className="zona-disparo-touch">
      <button
        type="button"
        className="boton-disparo-touch"
        onPointerDown={(
          evento
        ) => {
          evento.preventDefault();

          onInicio?.();
        }}
        onPointerUp={
          detener
        }
        onPointerCancel={
          detener
        }
        onPointerLeave={
          detener
        }
      >
        <span>
          FIRE
        </span>

        <small>
          DISPARAR
        </small>
      </button>
    </div>
  );
}


export function AyudaArrastreTouch({
  texto,
}) {
  const esTouch =
    useDispositivoTouch();


  if (!esTouch) {
    return null;
  }


  return (
    <div className="ayuda-arrastre-touch">
      <span>
        {texto}
      </span>
    </div>
  );
}