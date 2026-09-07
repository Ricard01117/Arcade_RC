import {
  useDiseno,
} from "./contexto/ContextoDiseno";

import InicioArcade from "./disenos/arcade/paginas/InicioArcade";

import InicioModerno from "./disenos/moderno/paginas/InicioModerno";

import InicioRetro90 from "./disenos/retro90/paginas/InicioRetro90";

import JuegoModal from "./componentes/comunes/JuegoModal";


function App() {
  const {
    diseno,
  } = useDiseno();


  let contenido;


  if (
    diseno === "moderno"
  ) {
    contenido =
      <InicioModerno />;
  } else if (
    diseno === "retro90"
  ) {
    contenido =
      <InicioRetro90 />;
  } else {
    contenido =
      <InicioArcade />;
  }


  return (
    <>
      {contenido}

      <JuegoModal />
    </>
  );
}


export default App;