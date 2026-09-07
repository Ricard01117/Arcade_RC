import {
  IconoJuego,
} from "../../../componentes/comunes/Iconos";

import {
  useJuego,
} from "../../../contexto/ContextoJuego";


function TarjetaRetro90({
  juego,
}) {
  const {
    abrirJuego,
  } = useJuego();


  return (
    <article
      className={
        `tarjeta-retro90 ${juego.clase}`
      }
    >
      <div className="retro90-pantalla-juego">
        <span className="retro90-etiqueta">
          ARCADE_RC
        </span>

        <IconoJuego
          tipo={juego.icono}
          size={75}
        />

        <div className="retro90-scanlines" />
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


export default TarjetaRetro90;