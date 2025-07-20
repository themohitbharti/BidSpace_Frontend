import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { fetchProductDetails } from "../store/productSlice";
import { formatDistanceToNowStrict } from "date-fns";
import { useAppDispatch } from "../store/hooks";
import LiveBidding from "../components/product/LiveBidding";
import {
  addWishlistItem,
  removeWishlistItem,
  fetchWishlist,
} from "../store/wishlistSlice";
import { toast } from "react-toastify";

export default function ProductDetails() {
  const { productId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // All selectors at the top
  const {
    selectedProduct: product,
    selectedAuction: auction,
    loading,
    error,
  } = useSelector((state: RootState) => state.product);

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const userCoins = useSelector(
    (state: RootState) => state.auth.user?.coins || 0,
  );
  const wishlist = useSelector((state: RootState) => state.wishlist.items);

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [sparkle, setSparkle] = useState(false);

  // Fetch product details when component mounts or productId changes
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (isLoggedIn && wishlist.length === 0) {
      dispatch(fetchWishlist());
    }
  }, [isLoggedIn, wishlist.length, dispatch]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-white min-h-[60vh]">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent shadow-lg"></div>
          <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full border-4 border-blue-400 opacity-20"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return <div className="py-20 text-center text-red-400">Error: {error}</div>;
  }

  // Show not found state
  if (!product || !auction) {
    return (
      <div className="py-20 text-center text-white">Product not found</div>
    );
  }

  // Now it's safe to use product and wishlist
  const isWishlisted = wishlist.some((p) => p._id === product._id);

  const mainImage = product.coverImages[selectedIdx];

  // Safe date calculation with validation
  let timeLeft = "unknown";
  try {
    if (auction.endTime) {
      const endDate = new Date(auction.endTime);
      // Check if the parsed date is valid
      if (!isNaN(endDate.getTime())) {
        timeLeft = formatDistanceToNowStrict(endDate, {
          addSuffix: true,
        });
      } else {
        console.error("Invalid date format:", auction.endTime);
      }
    }
  } catch (dateError) {
    console.error("Error formatting date:", dateError);
  }

  const badgeColor =
    product.status === "live"
      ? "bg-green-600"
      : product.status === "sold"
        ? "bg-red-600"
        : "bg-yellow-600";
  const badgeText =
    product.status === "unsold" ? "Out of Stock" : product.status.toUpperCase();

  // Calculate if the user needs to take action (not logged in or insufficient coins)
  const minBid =
    auction.currentPrice !== null
      ? auction.currentPrice + 1
      : product.basePrice;
  const needsUserAction = !isLoggedIn || userCoins < minBid;

  const handleWishlistClick = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setSparkle(true);
    setTimeout(() => setSparkle(false), 700);
    try {
      if (!isWishlisted) {
        const result = await dispatch(addWishlistItem(product._id)).unwrap();
        toast.success(result.message || "Added to wishlist");
      } else {
        const result = await dispatch(removeWishlistItem(product._id)).unwrap();
        toast.info(result.message || "Removed from wishlist");
      }
    } catch (err) {
      if (typeof err === "string") {
        toast.error(err);
      } else if (typeof err === "object" && err !== null && "message" in err) {
        // @ts-expect-error: message might exist
        toast.error(err.message || "Operation failed");
      } else {
        toast.error("Failed to update wishlist");
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-black pb-32 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pt-8 lg:flex-row lg:px-8">
        {/* Thumbnails */}
        <div className="flex flex-row gap-4 lg:flex-col">
          {product.coverImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelectedIdx(i)}
              className={`h-32 w-20 overflow-hidden rounded-lg border-2 ${
                i === selectedIdx ? "border-blue-500" : "border-transparent"
              }`}
            >
              <img
                src={src}
                alt={`thumb-${i}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Main Image */}
        <div className="flex-1">
          <div className="flex h-full min-h-[400px] items-center justify-center overflow-hidden rounded-2xl bg-gray-900/50">
            <img
              src={mainImage}
              alt="main"
              className="h-auto max-h-[70vh] w-full rounded-2xl object-contain"
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex w-full flex-col gap-6 lg:w-1/3">
          <span
            className={`inline-block w-fit rounded-full px-4 py-1 text-sm ${badgeColor}`}
          >
            {badgeText}
          </span>
          <h1 className="text-4xl font-semibold">{product.title}</h1>

          {/* Updated Price Display */}
          <div className="flex items-baseline gap-3">
            {auction.bidders && auction.bidders.length > 0 ? (
              <span className="text-3xl font-bold">
                {auction.currentPrice} Coins
              </span>
            ) : (
              <span className="text-3xl font-bold text-gray-400">
                No bids yet
              </span>
            )}
            <span className="text-sm text-gray-400">
              Base:{" "}
              <span
                className={
                  auction.bidders && auction.bidders.length > 0
                    ? "line-through"
                    : undefined
                }
              >
                {product.basePrice} Coins
              </span>
            </span>
          </div>

          {/* Product Description */}
          <div className="mt-2">
            <h2 className="mb-2 text-xl font-semibold">Description</h2>
            <p className="leading-relaxed text-gray-300">
              {product.description ||
                "No description available for this product."}
            </p>
          </div>

          {/* Specifications */}
          <div className="mt-2">
            <h3 className="mb-2 text-lg font-medium">Specifications</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between rounded-lg bg-gray-800/50 p-3">
                <span className="text-gray-400">Category</span>
                <span>{product.category}</span>
              </div>
              <div className="flex justify-between rounded-lg bg-gray-800/50 p-3">
                <span className="text-gray-400">Starting Price</span>
                <span>{product.basePrice} Coins</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => {
                document
                  .getElementById("auction-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex-1 rounded-full bg-white py-3 text-lg font-semibold text-black transition hover:bg-gray-200"
            >
              Bid Now
            </button>
            <button
              onClick={handleWishlistClick}
              className={`relative rounded-full border-2 border-white p-3 transition hover:bg-white/10 ${
                isWishlisted ? "border-blue-400 bg-blue-600" : ""
              }`}
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              {/* Sparkle Animation Overlay */}
              {sparkle && (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  {/* Larger, blue animated stars */}
                  <svg
                    className="absolute top-1/2 left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 animate-ping text-blue-400 opacity-80"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <polygon points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8" />
                  </svg>
                  <svg
                    className="absolute top-1/3 left-1/3 h-6 w-6 animate-pulse text-blue-500 opacity-70"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <polygon points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8" />
                  </svg>
                  <svg
                    className="absolute right-1/4 bottom-1/4 h-4 w-4 animate-bounce text-blue-300 opacity-60"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <polygon points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8" />
                  </svg>
                </span>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={isWishlisted ? "#fff" : "none"}
                stroke={isWishlisted ? "#2563eb" : "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Auction Activity Section with loading state */}
      <div className="mx-auto max-w-7xl px-4 pt-12 lg:px-8">
        <div id="auction-section" className="mx-auto">
          <h2 className="mb-4 text-2xl font-semibold">Auction Activity</h2>

          {loading ? (
            <div className="rounded-xl bg-gray-900 p-6 text-center min-h-[200px] flex items-center justify-center">
              <div className="relative">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent shadow-lg"></div>
                <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border-4 border-blue-400 opacity-20"></div>
              </div>
            </div>
          ) : !auction || !auction._id ? (
            <div className="rounded-xl bg-gray-900 p-6 text-center">
              <p>Auction information is not available</p>
            </div>
          ) : (
            <div className="rounded-xl bg-gray-900 p-6">
              {/* Rest of your existing auction section */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Current Auction Status */}
                <div className="rounded-lg bg-gray-800 p-4">
                  <h3 className="mb-3 text-lg font-medium">Current Status</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Bid</span>
                      <span className="font-semibold text-blue-400">
                        {auction.currentPrice !== null
                          ? `${auction.currentPrice} Coins`
                          : "No bids yet"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time Left</span>
                      <span className="font-semibold text-green-400">
                        {timeLeft}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Bids</span>
                      <span>{auction.bidders?.length || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Bid History / Live Activity */}
                <div className="md:col-span-2">
                  <h3 className="mb-3 text-lg font-medium">Recent Activity</h3>
                  <div className="h-48 overflow-y-auto rounded-lg bg-gray-800 p-4">
                    <div className="flex flex-col gap-3">
                      {auction.bidders && auction.bidders.length > 0 ? (
                        auction.bidders.slice(0, 10).map((bid, index) => (
                          <div
                            key={bid._id || index}
                            className="flex items-center gap-2 rounded-md bg-gray-700 p-2 text-sm"
                          >
                            <div className="h-8 w-8 rounded-full bg-blue-600 text-center">
                              <span className="leading-8">
                                {bid.userId.charAt(0)}
                              </span>
                            </div>
                            <p>
                              <span className="font-medium text-blue-400">
                                User {bid.userId.substring(0, 6)}
                              </span>{" "}
                              bid{" "}
                              <span className="text-green-400">
                                {bid.bidAmount} Coins
                              </span>
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500">
                          No bids placed yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* LiveBidding component - with better validation */}
              {product.status === "live" && auction && auction._id && (
                <div className="mt-6">
                  <LiveBidding
                    auctionId={auction._id}
                    currentPrice={auction.currentPrice}
                    basePrice={product.basePrice}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Live Auction Bar - Use the variables instead of inline selectors */}
      {needsUserAction && (
        <div className="fixed bottom-0 left-0 w-full border-t border-gray-700 bg-gray-900">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-white lg:px-8">
            <div>
              <p className="text-sm">Live Auction</p>
              <p className="text-lg font-semibold">
                Current Bid: {auction.currentPrice} Coins
              </p>
              <p className="text-xs text-gray-400">Ends {timeLeft}</p>
            </div>
            {!isLoggedIn ? (
              <button
                onClick={() => navigate("/login")}
                className="rounded-full bg-blue-600 px-6 py-2 transition hover:bg-blue-500"
              >
                Login to Bid
              </button>
            ) : (
              <button
                onClick={() => {
                  /* Add buy coins logic here */
                }}
                className="rounded-full bg-green-600 px-6 py-2 transition hover:bg-green-500"
              >
                Buy Coins
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
