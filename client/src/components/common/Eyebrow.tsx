import type { JSX, ReactNode } from 'react';
import '@/components/common/Eyebrow.css';

interface EyebrowProps {
  children: ReactNode;
}

export const Eyebrow = ({ children }: EyebrowProps): JSX.Element => {
  return <div className="eyebrow">{children}</div>;
};
