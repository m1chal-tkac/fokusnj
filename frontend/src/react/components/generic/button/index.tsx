import type { ReactNode } from "react";

interface ButtonProps {
  type: "submit" | "button";
  onClick?: () => void;
  text?: string;
  children?: ReactNode | ReactNode[];
}

export function Button({ type, onClick, text, children }: ButtonProps) {
  return (
    <button
      type={type}
      className="border-2 border-blue-500 bg-blue-500 text-white p-2 w-full rounded-md"
      onClick={onClick}
    >
      {text || children}
    </button>
  );
}
