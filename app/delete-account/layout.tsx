import { ReactNode } from 'react';

export default function DeleteAccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Layout público sin autenticación ni navegación
  return <>{children}</>;
}
