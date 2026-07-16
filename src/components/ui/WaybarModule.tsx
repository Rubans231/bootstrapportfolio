import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  variant?: "left" | "center" | "right";
  className?: string;
}

export default function WaybarModule({
  children,
  variant = "center",
  className = "",
}: Props) {
  return (
    <div className={`waybar-module ${variant} ${className}`}>
      {children}
    </div>
  );
}
