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

import TarjetaRetro90 from "../componentes/TarjetaRetro90";

import "../estilos/retro90.css";

function InicioRetro90() {
  return (
    <div className="retro90-app">
      <header className="retro90-header">
        <div className="retro90-logo">
          <IconoMarca size={30} />

          <div>
            <span>
              ARCADE
            </span>

            <strong>
              _RC
            </strong>
          </div>
        </div>

        <nav className="retro90-nav">
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
          className="retro90-boton-graficas"
        />

        <SelectorDiseno
          variante="retro90"
        />
      </header>

      <main>
        <section
          className="retro90-hero"
          id="inicio"
        >
          <div className="retro90-crt">
            <div className="retro90-crt-contenido">
              <span className="retro90-system">
                SISTEMA ARCADE · 1990
              </span>

              <IconoMarca size={47} />

              <h1>
                ARCADE
                <span>_RC</span>
              </h1>

              <p>
                PRESIONA START
              </p>

              <small>
                3 ESTILOS ·
                4 JUEGOS ·
                1 EXPERIENCIA
              </small>
            </div>

            <div className="retro90-lineas" />
          </div>

          <div className="retro90-grid-piso" />
        </section>

        <section
          className="retro90-juegos"
          id="juegos"
        >
          <div className="retro90-titulo">
            <span>
              01
            </span>

            <div>
              <small>
                BIBLIOTECA DE JUEGOS
              </small>

              <h2>
                ELIGE TU JUEGO
              </h2>
            </div>
          </div>

          <div className="retro90-grid">
            {juegos.map(
              (juego) => (
                <TarjetaRetro90
                  key={juego.id}
                  juego={juego}
                />
              )
            )}
          </div>
        </section>

        <PanelGraficas />
      </main>

      <footer className="retro90-footer">
        <span>
          © ARCADE_RC
        </span>

        <strong>
          ¿GAME OVER?
          INTÉNTALO OTRA VEZ.
        </strong>
      </footer>

      <ConfiguracionGraficasModal />
    </div>
  );
}

export default InicioRetro90;