import type { JSX, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const getIconProps = (props: IconProps): IconProps => ({
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  ...props,
});

export const PlusIcon = (props: IconProps): JSX.Element => (
  <svg {...getIconProps({ strokeWidth: 2.2, width: 16, height: 16, ...props })}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const PassIcon = (props: IconProps): JSX.Element => (
  <svg {...getIconProps(props)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const UndoIcon = (props: IconProps): JSX.Element => (
  <svg {...getIconProps(props)}>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h11a5 5 0 0 1 0 10h-3" />
  </svg>
);

export const BulbIcon = (props: IconProps): JSX.Element => (
  <svg {...getIconProps(props)}>
    <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V16h8v-1.3A7 7 0 0 0 12 2z" />
  </svg>
);

export const FlagIcon = (props: IconProps): JSX.Element => (
  <svg {...getIconProps(props)}>
    <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
  </svg>
);

export const DownloadIcon = (props: IconProps): JSX.Element => (
  <svg {...getIconProps({ width: 14, height: 14, ...props })}>
    <path d="M12 4v12M6 10l6 6 6-6M5 20h14" />
  </svg>
);
