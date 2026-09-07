import React from "react";

import ReactDOM from "react-dom/client";

import App from "./App";


import {
  ProveedorDiseno,
} from "./contexto/ContextoDiseno";


import {
  ProveedorEstadisticas,
} from "./contexto/ContextoEstadisticas";


import {
  ProveedorGraficas,
} from "./contexto/ContextoGraficas";


import {
  ProveedorConfiguracionGraficas,
} from "./contexto/ContextoConfiguracionGraficas";


import {
  ProveedorJuego,
} from "./contexto/ContextoJuego";


import {
  ProveedorConfiguracionJuegos,
} from "./contexto/ContextoConfiguracionJuegos";


import "./estilos/global.css";

import "./estilos/panelGraficas.css";

import "./estilos/juegos.css";


ReactDOM.createRoot(
  document.getElementById(
    "root"
  )
).render(
  <ProveedorDiseno>
    <ProveedorEstadisticas>
      <ProveedorGraficas>
        <ProveedorConfiguracionGraficas>
          <ProveedorConfiguracionJuegos>
            <ProveedorJuego>
              <App />
            </ProveedorJuego>
          </ProveedorConfiguracionJuegos>
        </ProveedorConfiguracionGraficas>
      </ProveedorGraficas>
    </ProveedorEstadisticas>
  </ProveedorDiseno>
);