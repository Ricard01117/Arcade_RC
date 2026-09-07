import {
  IconoJuego,
} from "../../../componentes/comunes/Iconos";

import {
  useJuego,
} from "../../../contexto/ContextoJuego";


function TarjetaModerna({
  juego,
}) {
  const {
    abrirJuego,
  } = useJuego();


  return (
    <article
      className={
        `tarjeta-moderna ${juego.clase}`
      }
    >
      <div className="ilustracion-moderna">
        <IconoJuego
          tipo={juego.icono}
          size={88}
        />
      </div>

      <h2>
        {juego.nombre}
      </h2>

      <p>
        {juego.descripcion}
      </p>

      <button
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


export default TarjetaModerna;