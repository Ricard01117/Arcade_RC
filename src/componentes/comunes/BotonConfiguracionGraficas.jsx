import {
  useConfiguracionGraficas,
} from "../../contexto/ContextoConfiguracionGraficas";

function BotonConfiguracionGraficas({
  className = "",
}) {
  const {
    abrirConfiguracion,
  } = useConfiguracionGraficas();

  return (
    <button
      type="button"
      className={`boton-configuracion-header ${className}`}
      onClick={abrirConfiguracion}
    >
      Config. gráficas
    </button>
  );
}

export default BotonConfiguracionGraficas;