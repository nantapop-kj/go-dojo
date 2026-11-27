import type { HTMLAttributes, JSX } from 'react';
import '@/components/common/Card.css';

export const Card = ({ className = '', ...props }: HTMLAttributes<HTMLDivElement>): JSX.Element => {
  const classNames = ['card', className].filter(Boolean).join(' ');

  return <div className={classNames} {...props} />;
};
