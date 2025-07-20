import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  bgColor?: string;
  textColor?: string;
  className?: string;
  variant?: "default" | "outline";
}

export default function Button({
  children,
  bgColor = "bg-blue-600",
  textColor = "text-white",
  className = "",
  variant = "default",
  ...props
}: ButtonProps) {
  // Determine styling based on variant
  const variantStyles =
    variant === "outline"
      ? "bg-transparent border border-current"
      : `${bgColor}`;

  return (
    <button
      className={`cursor-pointer rounded-lg px-4 py-2 transition-all hover:opacity-90 ${variantStyles} ${textColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
