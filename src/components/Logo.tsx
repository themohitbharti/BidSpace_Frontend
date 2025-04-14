
import { FaRocket } from "react-icons/fa";

function Logo({ size = "default" }) {
  // Size variants for the logo
  const sizes = {
    small: {
      icon: "text-xl",
      text: "text-lg",
    },
    default: {
      icon: "text-3xl",
      text: "text-2xl",
    },
    large: {
      icon: "text-4xl",
      text: "text-3xl",
    },
  };

  const sizeClass = sizes[size as keyof typeof sizes] || sizes.default;

  return (
    <div className="flex items-center">
      <FaRocket
        className={`${sizeClass.icon} mr-2 text-[#199cfa] drop-shadow-[0_0_5px_rgba(94,231,223,0.6)]`}
      />
      <span
        className={`${sizeClass.text} bg-[#199cfa] bg-clip-text font-bold tracking-wider text-transparent`}
      >
        BidSpace
      </span>
    </div>
  );
}

export default Logo;
