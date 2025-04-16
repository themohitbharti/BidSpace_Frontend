export default function HomeStats() {
  return (
    <div className="w-full rounded-lg bg-gray-800/30 p-6 text-center text-white">
      <div className="flex items-center justify-center">
        <div className="px-6">
          <h2 className="text-3xl font-bold">10K+</h2>
          <p className="text-base text-gray-400">Auctions</p>
        </div>

        {/* Tech-style divider */}
        <div className="relative flex h-16 items-center">
          <div className="absolute h-12 w-[2px] bg-gradient-to-b from-transparent via-blue-400 to-transparent"></div>
        </div>

        <div className="px-6">
          <h2 className="text-3xl font-bold">1.2K+</h2>
          <p className="text-base text-gray-400">Sellers</p>
        </div>

        {/* Tech-style divider */}
        <div className="relative flex h-16 items-center">
          <div className="absolute h-12 w-[2px] bg-gradient-to-b from-transparent via-blue-400 to-transparent"></div>
        </div>

        <div className="px-6">
          <h2 className="text-3xl font-bold">300K+</h2>
          <p className="text-base text-gray-400">Buyers</p>
        </div>
      </div>
    </div>
  );
}
