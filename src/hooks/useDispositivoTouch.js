import {
  useEffect,
  useState,
} from "react";


function detectarTouch() {
  if (
    typeof window ===
    "undefined"
  ) {
    return false;
  }

  const puntosTouch =
    navigator.maxTouchPoints ||
    navigator.msMaxTouchPoints ||
    0;

  const punteroGrueso =
    window.matchMedia?.(
      "(pointer: coarse)"
    ).matches;

  return (
    puntosTouch > 0 ||
    punteroGrueso
  );
}


export default function useDispositivoTouch() {
  const [
    esTouch,
    setEsTouch,
  ] = useState(
    detectarTouch
  );


  useEffect(() => {
    const media =
      window.matchMedia?.(
        "(pointer: coarse)"
      );


    const actualizar = () => {
      setEsTouch(
        detectarTouch()
      );
    };


    window.addEventListener(
      "resize",
      actualizar
    );


    media?.addEventListener?.(
      "change",
      actualizar
    );


    return () => {
      window.removeEventListener(
        "resize",
        actualizar
      );

      media?.removeEventListener?.(
        "change",
        actualizar
      );
    };
  }, []);


  return esTouch;
}