import {
  IconoPaleta,
} from "./Iconos";

import {
  useDiseno,
} from "../../contexto/ContextoDiseno";

function SelectorDiseno({
  variante,
}) {
  const {
    cambiarDiseno,
    indiceDiseno,
    totalDisenos,
    nombreSiguienteDiseno,
  } = useDiseno();

  return (
    <div
      className={`selector-diseno selector-${variante}`}
    >
      <button
        className="selector-trigger"
        onClick={cambiarDiseno}
        title={`Cambiar a ${nombreSiguienteDiseno}`}
        aria-label={`Cambiar a ${nombreSiguienteDiseno}`}
      >
        <IconoPaleta size={18} />

        <span className="selector-texto">
          ESTILO
        </span>

        <span className="selector-indicador">
          {indiceDiseno + 1}/
          {totalDisenos}
        </span>
      </button>
    </div>
  );
}

export default SelectorDiseno;