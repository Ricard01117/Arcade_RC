function BaseIcono({
  size = 24,
  className = "",
  children,
  viewBox = "0 0 24 24",
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function IconoMarca({
  size = 30,
  className = "",
}) {
  return (
    <BaseIcono
      size={size}
      className={className}
    >
      <path
        d="M8.5 8H15.5C18.5 8 20 10 20.5 13L21 16C21.3 17.8 19.2 18.9 18 17.5L15.8 15H8.2L6 17.5C4.8 18.9 2.7 17.8 3 16L3.5 13C4 10 5.5 8 8.5 8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M7 11V14M5.5 12.5H8.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <circle
        cx="16.5"
        cy="11.5"
        r="1"
        fill="currentColor"
      />

      <circle
        cx="18.5"
        cy="13.5"
        r="1"
        fill="currentColor"
      />
    </BaseIcono>
  );
}

export function IconoPaleta({
  size = 20,
}) {
  return (
    <BaseIcono size={size}>
      <path
        d="M12 3C7 3 3 6.6 3 11C3 15 6.2 18 10 18H11.2C12 18 12.5 17.1 12.1 16.4C11.5 15.4 12.2 14 13.4 14H15C18.3 14 21 11.5 21 8.5C21 5.5 17 3 12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle cx="8" cy="8" r="1.2" fill="currentColor" />
      <circle cx="12" cy="6.5" r="1.2" fill="currentColor" />
      <circle cx="16" cy="8" r="1.2" fill="currentColor" />
    </BaseIcono>
  );
}

export function IconoInicio({
  size = 18,
}) {
  return (
    <BaseIcono size={size}>
      <path
        d="M4 10.5L12 4L20 10.5V20H14.5V14H9.5V20H4V10.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </BaseIcono>
  );
}

export function IconoJuegos({
  size = 18,
}) {
  return (
    <IconoMarca size={size} />
  );
}

export function IconoEstadisticas({
  size = 18,
}) {
  return (
    <BaseIcono size={size}>
      <path
        d="M5 19V11M12 19V5M19 19V8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </BaseIcono>
  );
}

export function IconoLogros({
  size = 18,
}) {
  return (
    <BaseIcono size={size}>
      <path
        d="M8 4H16V8C16 11 14.2 13 12 13C9.8 13 8 11 8 8V4Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8 6H5V7C5 9 6.5 10 8.5 10M16 6H19V7C19 9 17.5 10 15.5 10"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M12 13V17M9 20H15M10 17H14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </BaseIcono>
  );
}

export function IconoChevron({
  size = 16,
}) {
  return (
    <BaseIcono size={size}>
      <path
        d="M7 9L12 14L17 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </BaseIcono>
  );
}

function IconoViborita({
  size = 70,
}) {
  return (
    <BaseIcono
      size={size}
      viewBox="0 0 64 64"
    >
      <path
        d="M10 17H34C42 17 42 29 34 29H22C13 29 13 43 22 43H43"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <circle
        cx="48"
        cy="43"
        r="8"
        stroke="currentColor"
        strokeWidth="5"
      />

      <circle
        cx="51"
        cy="40"
        r="1.5"
        fill="currentColor"
      />
    </BaseIcono>
  );
}

function IconoNave({
  size = 70,
}) {
  return (
    <BaseIcono
      size={size}
      viewBox="0 0 64 64"
    >
      <path
        d="M32 6C23 15 21 28 23 43H41C43 28 41 15 32 6Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      <circle
        cx="32"
        cy="24"
        r="5"
        stroke="currentColor"
        strokeWidth="3"
      />

      <path
        d="M23 32L14 41V48L24 44M41 32L50 41V48L40 44"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      <path
        d="M27 46L32 57L37 46"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </BaseIcono>
  );
}

function IconoBloques({
  size = 70,
}) {
  return (
    <BaseIcono
      size={size}
      viewBox="0 0 64 64"
    >
      <rect
        x="9"
        y="11"
        width="13"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="3"
      />

      <rect
        x="25.5"
        y="11"
        width="13"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="3"
      />

      <rect
        x="42"
        y="11"
        width="13"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="3"
      />

      <rect
        x="17"
        y="27"
        width="13"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="3"
      />

      <rect
        x="34"
        y="27"
        width="13"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="3"
      />

      <circle
        cx="32"
        cy="48"
        r="4"
        fill="currentColor"
      />

      <path
        d="M20 57H44"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </BaseIcono>
  );
}

function IconoPong({
  size = 70,
}) {
  return (
    <BaseIcono
      size={size}
      viewBox="0 0 64 64"
    >
      <rect
        x="10"
        y="15"
        width="6"
        height="34"
        rx="3"
        fill="currentColor"
      />

      <rect
        x="48"
        y="15"
        width="6"
        height="34"
        rx="3"
        fill="currentColor"
      />

      <circle
        cx="32"
        cy="32"
        r="5"
        fill="currentColor"
      />

      <path
        d="M32 8V14M32 20V26M32 38V44M32 50V56"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.45"
      />
    </BaseIcono>
  );
}

export function IconoJuego({
  tipo,
  size = 70,
}) {
  if (tipo === "viborita") {
    return <IconoViborita size={size} />;
  }

  if (tipo === "disparos") {
    return <IconoNave size={size} />;
  }

  if (tipo === "bloques") {
    return <IconoBloques size={size} />;
  }

  return <IconoPong size={size} />;
}