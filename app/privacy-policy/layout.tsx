import { ReactNode } from 'react';

export default function PrivacyPolicyLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Layout público sin autenticación ni navegación
  return <>{children}</>;
}
