import type { CSSProperties, JSX } from 'react';
import '@/components/common/StoneIcon.css';

interface StoneIconProps {
  black: boolean;
  size?: number;
  label?: string;
}

const getSizeStyle = (size: number): CSSProperties => ({
  display: 'inline-block',
  width: size,
  height: size,
  verticalAlign: 'middle',
});

export const StoneIcon = ({ black, size, label }: StoneIconProps): JSX.Element => {
  return (
    <span
      className={`stone-icon ${black ? 'b' : 'w'}`}
      style={size ? getSizeStyle(size) : undefined}
      role={label ? 'img' : undefined}
      aria-label={label}
    />
  );
};
