import type { ButtonHTMLAttributes, JSX } from 'react';
import '@/components/common/Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'hint' | 'danger';
}

export const Button = ({
  variant = 'default',
  className = '',
  type = 'button',
  ...props
}: ButtonProps): JSX.Element => {
  const variantClass = variant === 'default' ? '' : variant;
  const classNames = ['btn', variantClass, className].filter(Boolean).join(' ');

  return <button type={type} className={classNames} {...props} />;
};
