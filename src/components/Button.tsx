

export default function Button({
  children,
  bgColor = "bg-blue-600",
  textColor = "text-white",
  className = "",
  ...props
}) {
  return (
    <button
      className={`cursor-pointer rounded-lg px-4 py-2 transition-all hover:opacity-90 ${bgColor} ${textColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
