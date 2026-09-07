import {
  juegos,
} from "../../../datos/juegos";

import SelectorDiseno from "../../../componentes/comunes/SelectorDiseno";

import BotonConfiguracionGraficas from "../../../componentes/comunes/BotonConfiguracionGraficas";

import ConfiguracionGraficasModal from "../../../componentes/comunes/ConfiguracionGraficasModal";

import PanelGraficas from "../../../componentes/comunes/PanelGraficas";

import {
  IconoEstadisticas,
  IconoInicio,
  IconoJuegos,
  IconoLogros,
  IconoMarca,
} from "../../../componentes/comunes/Iconos";

import TarjetaArcade from "../componentes/TarjetaArcade";

import "../estilos/arcade.css";

function InicioArcade() {
  return (
    <div className="arcade-app">
      <header className="arcade-header">
        <div className="arcade-logo">
          <IconoMarca size={29} />

          <span>ARCADE</span>

          <strong>
            _RC
          </strong>
        </div>

        <nav className="arcade-nav">
          <a href="#inicio">
            <IconoInicio />
            <span>INICIO</span>
          </a>

          <a href="#juegos">
            <IconoJuegos />
            <span>JUEGOS</span>
          </a>

          <a href="#estadisticas">
            <IconoEstadisticas />
            <span>ESTADÍSTICAS</span>
          </a>

          <a href="#estadisticas">
            <IconoLogros />
            <span>LOGROS</span>
          </a>
        </nav>

        <BotonConfiguracionGraficas
          className="arcade-boton-graficas"
        />

        <SelectorDiseno
          variante="arcade"
        />
      </header>

      <main>
        <section
          className="hero-arcade"
          id="inicio"
        >
          <div className="scanlines" />

          <div className="hero-icono-arcade">
            <IconoMarca size={45} />
          </div>

          <p className="player-ready">
            PLAYER ONE · READY
          </p>

          <h1>
            ARCADE
            <span>_RC</span>
          </h1>

          <p className="insert-coin">
            INSERT COIN TO PLAY
          </p>

          <div className="linea-arcade">
            <span />

            <strong>
              JUEGA · SUPERA · REPITE
            </strong>

            <span />
          </div>
        </section>

        <section
          className="zona-juegos-arcade"
          id="juegos"
        >
          <div className="titulo-seccion-arcade">
            <span />

            <h2>
              SELECT GAME
            </h2>

            <span />
          </div>

          <div className="grid-arcade">
            {juegos.map(
              (juego) => (
                <TarjetaArcade
                  key={juego.id}
                  juego={juego}
                />
              )
            )}
          </div>
        </section>

        <PanelGraficas />
      </main>

      <footer className="footer-arcade">
        <div>
          <IconoMarca size={22} />

          <strong>
            ARCADE_RC
          </strong>
        </div>

        <span>
          READY PLAYER ONE
        </span>
      </footer>

      <ConfiguracionGraficasModal />
    </div>
  );
}

export default InicioArcade;