import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  bgColor?: string;
  textColor?: string;
  className?: string;
}

export default function Button({
  children,
  bgColor = "bg-blue-600",
  textColor = "text-white",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`cursor-pointer rounded-lg px-4 py-2 transition-all hover:opacity-90 ${bgColor} ${textColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
