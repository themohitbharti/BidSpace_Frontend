// components/ProductCard.tsx

import { formatDistanceToNowStrict } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Product } from "../../types";

interface Props {
  product: Product;
  onClick?: () => void;
}

const ProductCard = ({ product, onClick }: Props) => {
  // Make sure to handle cases where user is not logged in
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const wishlist = useSelector(
    (state: RootState) => state.wishlist.items || [],
  );

  // Only check wishlist if user is logged in and wishlist exists
  const isWishlisted =
    isLoggedIn && wishlist.length > 0
      ? wishlist.some((p) => p._id === product._id)
      : false;

  return (
    <div
      className="flex h-[430px] w-full max-w-xs cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-700/30 bg-gradient-to-b from-slate-400 to-slate-200 shadow-lg backdrop-blur-sm transition hover:scale-[1.02] hover:shadow-xl"
      onClick={onClick}
    >
      {/* Image with status overlay */}
      <div className="relative h-52 w-full overflow-hidden rounded-t-xl border-b border-slate-700/20">
        <img
          src={product.coverImages[0]}
          alt={product.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <span
          className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold shadow-md ${
            product.status === "live"
              ? "bg-green-500/90 text-white ring-1 ring-green-300"
              : product.status === "sold"
                ? "bg-red-500/90 text-white ring-1 ring-red-300"
                : "bg-amber-500/90 text-white ring-1 ring-amber-300"
          }`}
        >
          {product.status.toUpperCase()}
        </span>
        <span className="absolute bottom-3 left-3 rounded-md bg-slate-800/70 px-2 py-1 text-xs text-slate-100 backdrop-blur-sm">
          {product.category}
        </span>

        {/* Wishlist indicator - only show if logged in and wishlisted */}
        {isLoggedIn && isWishlisted && (
          <div className="absolute top-3 left-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden p-4">
        {/* Title */}
        <div className="mb-3">
          <h3 className="truncate text-xl font-bold text-slate-800 transition hover:text-[#199cfa]">
            {product.title}
          </h3>
        </div>

        {/* Price Section */}
        <div className="mb-4 rounded-lg bg-slate-100 p-2">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">Current Bid</p>
            <p className="text-xl font-bold text-emerald-600">
              {product.currentPrice == null ? "-" : `$${product.currentPrice}`}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">Base Price</p>
            <p className="text-xs text-slate-600">${product.basePrice}</p>
          </div>
        </div>

        {/* Time Remaining */}
        <div className="mb-4">
          <p className="text-sm font-medium">
            {product.status === "live" ? (
              <span className="flex items-center text-blue-600">
                <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-blue-500"></span>
                Ends{" "}
                <span className="ml-1 font-bold">
                  {formatDistanceToNowStrict(new Date(product.endTime), {
                    addSuffix: true,
                  })}
                </span>
              </span>
            ) : (
              <span className="flex items-center text-slate-500">
                <span className="mr-2 h-2 w-2 rounded-full bg-slate-400"></span>
                Auction ended
              </span>
            )}
          </p>
        </div>

        {/* CTA Button */}
        <button
          className={`mt-auto w-full rounded-lg px-4 py-2.5 font-medium shadow-sm transition ${
            product.status === "live"
              ? "bg-blue-600 text-white shadow-blue-200/30 hover:bg-blue-700 hover:shadow-blue-200/50"
              : "cursor-not-allowed bg-slate-300 text-slate-500"
          }`}
          disabled={product.status !== "live"}
        >
          {product.status === "live" ? "Place Bid" : "Auction Closed"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
