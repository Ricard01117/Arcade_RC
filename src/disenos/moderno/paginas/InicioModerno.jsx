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

import TarjetaModerna from "../componentes/TarjetaModerna";

import "../estilos/moderno.css";

function InicioModerno() {
  return (
    <div className="moderno-app">
      <header className="moderno-header">
        <div className="logo-moderno">
          <IconoMarca size={26} />

          <strong>
            ARCADE
            <span>_RC</span>
          </strong>
        </div>

        <nav className="nav-moderno">
          <a href="#inicio">
            <IconoInicio />
            <span>Inicio</span>
          </a>

          <a href="#juegos">
            <IconoJuegos />
            <span>Juegos</span>
          </a>

          <a href="#estadisticas">
            <IconoEstadisticas />
            <span>Estadísticas</span>
          </a>

          <a href="#estadisticas">
            <IconoLogros />
            <span>Logros</span>
          </a>
        </nav>

        <BotonConfiguracionGraficas
          className="moderno-boton-graficas"
        />

        <SelectorDiseno
          variante="moderno"
        />
      </header>

      <main>
        <section
          className="hero-moderno"
          id="inicio"
        >
          <div className="hero-texto-moderno">
            <span className="mini-titulo">
              JUEGA · EXPLORA · DISFRUTA
            </span>

            <h1>
              ARCADE
              <span>_RC</span>
            </h1>

            <p>
              Cuatro juegos.
              Tres estilos.
              Una sola experiencia.
            </p>

            <a
              href="#juegos"
              className="cta-moderno"
            >
              Comienza a jugar
            </a>
          </div>

          <div className="control-moderno">
            <div className="control-cuerpo-moderno">
              <IconoMarca size={180} />
            </div>
          </div>
        </section>

        <section
          className="juegos-modernos"
          id="juegos"
        >
          <div className="cabecera-seccion-moderna">
            <div>
              <span>
                COLECCIÓN
              </span>

              <h2>
                Elige tu juego
              </h2>
            </div>

            <p>
              Pequeños juegos,
              grandes momentos.
            </p>
          </div>

          <div className="grid-moderno">
            {juegos.map(
              (juego) => (
                <TarjetaModerna
                  key={juego.id}
                  juego={juego}
                />
              )
            )}
          </div>
        </section>

        <PanelGraficas />
      </main>

      <footer className="footer-moderno">
        <div>
          <IconoMarca size={22} />

          <strong>
            ARCADE_RC
          </strong>
        </div>

        <span>
          Juega · Supera · Repite
        </span>
      </footer>

      <ConfiguracionGraficasModal />
    </div>
  );
}

export default InicioModerno;