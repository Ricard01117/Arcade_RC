import {
  IconoJuego,
} from "../../../componentes/comunes/Iconos";

import {
  useJuego,
} from "../../../contexto/ContextoJuego";


function TarjetaArcade({
  juego,
}) {
  const {
    abrirJuego,
  } = useJuego();


  return (
    <article
      className={
        `tarjeta-arcade ${juego.clase}`
      }
    >
      <div className="pantalla-mini-arcade">
        <IconoJuego
          tipo={juego.icono}
          size={78}
        />
      </div>

      <h2>
        {juego.nombre}
      </h2>

      <p>
        {juego.descripcion}
      </p>

      <button
        className="boton-jugar-arcade"
        onClick={() =>
          abrirJuego(
            juego.codigo
          )
        }
      >
        JUGAR
      </button>
    </article>
  );
}


export default TarjetaArcade;