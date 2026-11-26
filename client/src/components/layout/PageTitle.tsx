import type { JSX, ReactNode } from 'react';
import '@/components/layout/PageTitle.css';

interface PageTitleProps {
  children: ReactNode;
}

export const PageTitle = ({ children }: PageTitleProps): JSX.Element => {
  return <h1 className="page-title">{children}</h1>;
};
