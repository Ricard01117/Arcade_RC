import {
  createContext,
  useContext,
  useState,
} from "react";


const ContextoJuego =
  createContext();


export function ProveedorJuego({
  children,
}) {
  const [
    juegoActivo,
    setJuegoActivo,
  ] = useState(null);


  const abrirJuego = (
    codigo
  ) => {
    setJuegoActivo(
      codigo
    );
  };


  const cerrarJuego = () => {
    setJuegoActivo(null);
  };


  return (
    <ContextoJuego.Provider
      value={{
        juegoActivo,
        abrirJuego,
        cerrarJuego,
      }}
    >
      {children}
    </ContextoJuego.Provider>
  );
}


export function useJuego() {
  return useContext(
    ContextoJuego
  );
}