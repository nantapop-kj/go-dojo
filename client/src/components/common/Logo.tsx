import type { JSX } from 'react';

interface LogoProps {
  size?: number;
}

export const Logo = ({ size = 34 }: LogoProps): JSX.Element => {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden="true">
      <circle cx="17" cy="17" r="15" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
      <path
        d="M17 2a15 15 0 0 0 0 30a7.5 7.5 0 0 0 0-15a7.5 7.5 0 0 1 0-15z"
        fill="var(--text)"
      />
      <circle cx="17" cy="9.5" r="2.2" fill="var(--bg)" />
      <circle cx="17" cy="24.5" r="2.2" fill="var(--text)" />
    </svg>
  );
};
