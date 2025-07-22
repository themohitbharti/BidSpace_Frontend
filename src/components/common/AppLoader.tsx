import { FaRocket } from "react-icons/fa";

export default function AppLoader() {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="text-center">
        <div className="mb-8 flex items-center justify-center">
          <FaRocket className="mr-4 animate-bounce text-6xl text-[#199cfa] drop-shadow-[0_0_20px_rgba(25,156,250,0.6)]" />
          <span className="animate-pulse bg-gradient-to-r from-[#199cfa] via-cyan-400 to-[#199cfa] bg-clip-text text-6xl font-black tracking-wider text-transparent">
            BidSpace
          </span>
        </div>

        {/* Animated dots */}
        <div className="flex items-center justify-center space-x-2">
          <div className="h-3 w-3 animate-bounce rounded-full bg-blue-500"></div>
          <div
            className="h-3 w-3 animate-bounce rounded-full bg-cyan-400"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="h-3 w-3 animate-bounce rounded-full bg-blue-500"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
