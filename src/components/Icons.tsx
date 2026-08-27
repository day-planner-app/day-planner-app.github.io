import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const InboxIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
    <path {...base} d="M4 13 6.5 5h11L20 13v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
    <path {...base} d="M4 13h4.2l1.3 2h5l1.3-2H20" />
  </svg>
)

export const ChevronIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
    <path {...base} d="m7 10 5 5 5-5" />
  </svg>
)

export const ArrowLeftIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
    <path {...base} d="M15 6 9 12l6 6" />
  </svg>
)

export const ArrowRightIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
    <path {...base} d="m9 6 6 6-6 6" />
  </svg>
)

export const CheckSquareIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
    <rect {...base} x="4" y="4" width="16" height="16" rx="3" />
    <path {...base} d="m8 12 3 3 5-6" />
  </svg>
)

export const GearIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
    <circle {...base} cx="12" cy="12" r="3" />
    <path
      {...base}
      d="M12 3.5v2.2M12 18.3V20.5M4.9 7.2l1.9 1.1M17.2 15.7l1.9 1.1M4.9 16.8l1.9-1.1M17.2 8.3l1.9-1.1"
    />
  </svg>
)

export const PlusIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
    <path {...base} strokeWidth="2.2" d="M12 6v12M6 12h12" />
  </svg>
)

export const SunIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
    <circle {...base} cx="12" cy="12" r="3.2" />
    <path {...base} d="M12 4v2.2M12 17.8V20M4 12h2.2M17.8 12H20M6.4 6.4l1.6 1.6M16 16l1.6 1.6M17.6 6.4 16 8M8 16l-1.6 1.6" />
  </svg>
)

export const MoonIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
    <path {...base} d="M16.5 13.2A6.2 6.2 0 0 1 10.8 6 6.4 6.4 0 1 0 16.5 13.2Z" />
  </svg>
)

export const ThoughtsIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" {...props}>
    <rect {...base} x="4" y="6" width="16" height="12" rx="2" />
    <path {...base} d="M8 10h8M8 14h5" />
  </svg>
)

export const RepeatIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" {...props}>
    <path {...base} d="M7 7h9a3 3 0 0 1 3 3v1" />
    <path {...base} d="M17 17H8a3 3 0 0 1-3-3v-1" />
    <path {...base} d="m13 4 3 3-3 3M11 20l-3-3 3-3" />
  </svg>
)
