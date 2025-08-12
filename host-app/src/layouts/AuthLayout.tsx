import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <div style={{ background: "#f8f8f8", padding: 20 }}>{children}</div>;
}
