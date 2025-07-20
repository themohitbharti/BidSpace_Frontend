interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const borderClasses = {
    sm: "border-2",
    md: "border-3",
    lg: "border-4",
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full ${borderClasses[size]} border-blue-500 border-t-transparent shadow-lg`}
      ></div>
      <div
        className={`absolute inset-0 ${sizeClasses[size]} animate-ping rounded-full ${borderClasses[size]} border-blue-400 opacity-20`}
      ></div>
    </div>
  );
}
