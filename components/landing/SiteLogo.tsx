// The TrxTr4c3r mark: a terminal ">_" on a rounded ink tile with a moss frame.
// Pure SVG, favicon-safe, renders identically at any size. No hooks.
export function SiteLogo({
  size = 26,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 108 108"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <rect width="108" height="108" rx="22" fill="#0D0F0D" />
      <rect
        x="9"
        y="9"
        width="90"
        height="90"
        rx="16"
        fill="none"
        stroke="#1B3A2A"
        strokeWidth="2"
      />
      <text
        x="26"
        y="70"
        fontFamily="var(--font-space-mono), ui-monospace, monospace"
        fontSize="46"
        fontWeight="700"
        fill="#4CFF7A"
      >
        {'>_'}
      </text>
    </svg>
  )
}
