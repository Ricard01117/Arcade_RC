import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ContextoDiseno = createContext();

const ORDEN_DISENOS = [
  "arcade",
  "moderno",
  "retro90",
];

const NOMBRES_DISENOS = {
  arcade: "Arcade Neon",
  moderno: "Moderno",
  retro90: "Retro 80/90",
};

export function ProveedorDiseno({ children }) {
  const [diseno, setDiseno] = useState(() => {
    const guardado = localStorage.getItem(
      "arcade_rc_diseno"
    );

    return ORDEN_DISENOS.includes(guardado)
      ? guardado
      : "arcade";
  });

  useEffect(() => {
    localStorage.setItem(
      "arcade_rc_diseno",
      diseno
    );
  }, [diseno]);

  const indiceDiseno =
    ORDEN_DISENOS.indexOf(diseno);

  const cambiarDiseno = () => {
    setDiseno((actual) => {
      const indiceActual =
        ORDEN_DISENOS.indexOf(actual);

      const siguienteIndice =
        (indiceActual + 1) %
        ORDEN_DISENOS.length;

      return ORDEN_DISENOS[
        siguienteIndice
      ];
    });
  };

  const nombreDiseno =
    NOMBRES_DISENOS[diseno];

  const nombreSiguienteDiseno =
    NOMBRES_DISENOS[
      ORDEN_DISENOS[
        (indiceDiseno + 1) %
          ORDEN_DISENOS.length
      ]
    ];

  const valor = useMemo(
    () => ({
      diseno,
      setDiseno,
      cambiarDiseno,
      indiceDiseno,
      totalDisenos:
        ORDEN_DISENOS.length,
      nombreDiseno,
      nombreSiguienteDiseno,
    }),
    [
      diseno,
      indiceDiseno,
      nombreDiseno,
      nombreSiguienteDiseno,
    ]
  );

  return (
    <ContextoDiseno.Provider
      value={valor}
    >
      {children}
    </ContextoDiseno.Provider>
  );
}

export function useDiseno() {
  return useContext(ContextoDiseno);
}