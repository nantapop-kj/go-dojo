import type { JSX, ReactNode } from 'react';
import '@/components/layout/Page.css';

interface PageProps {
  children: ReactNode;
}

export const Page = ({ children }: PageProps): JSX.Element => {
  return <main className="page">{children}</main>;
};
