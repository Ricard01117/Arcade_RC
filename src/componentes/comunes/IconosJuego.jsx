export function IconoEngranaje({
  size = 20,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="
          M9.7 3.5
          H14.3
          L15 6
          C15.5 6.2 16 6.5 16.4 6.8
          L18.9 6.1
          L21.2 10
          L19.3 11.8
          C19.4 12.4 19.4 12.9 19.3 13.5
          L21.2 15.3
          L18.9 19.2
          L16.4 18.5
          C16 18.8 15.5 19.1 15 19.3
          L14.3 21.8
          H9.7
          L9 19.3
          C8.5 19.1 8 18.8 7.6 18.5
          L5.1 19.2
          L2.8 15.3
          L4.7 13.5
          C4.6 12.9 4.6 12.4 4.7 11.8
          L2.8 10
          L5.1 6.1
          L7.6 6.8
          C8 6.5 8.5 6.2 9 6
          Z
        "
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      <circle
        cx="12"
        cy="12.7"
        r="3.2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}


export function IconoPausa({
  size = 19,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect
        x="6"
        y="4"
        width="4"
        height="16"
        rx="1"
      />

      <rect
        x="14"
        y="4"
        width="4"
        height="16"
        rx="1"
      />
    </svg>
  );
}


export function IconoPlay({
  size = 19,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="
          M7 4
          L20 12
          L7 20
          Z
        "
      />
    </svg>
  );
}