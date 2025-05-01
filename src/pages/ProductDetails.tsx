import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { fetchProductDetails } from "../store/productSlice";
import { formatDistanceToNowStrict } from "date-fns";
import { useAppDispatch } from "../store/hooks";
import LiveBidding from "../components/LiveBidding";

export default function ProductDetails() {
  const { productId } = useParams();
  const dispatch = useAppDispatch();
  const {
    selectedProduct: product,
    selectedAuction: auction,
    loading,
    error,
  } = useSelector((state: RootState) => state.product);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Fetch product details when component mounts or productId changes
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
    }
  }, [dispatch, productId]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-400 border-t-blue-500"></div>
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

  const mainImage = product.coverImages[selectedIdx];
  const timeLeft = formatDistanceToNowStrict(new Date(auction.endTime), {
    addSuffix: true,
  });

  const badgeColor =
    product.status === "live"
      ? "bg-green-600"
      : product.status === "sold"
        ? "bg-red-600"
        : "bg-yellow-600";
  const badgeText =
    product.status === "unsold" ? "Out of Stock" : product.status.toUpperCase();

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
          <div className="overflow-hidden rounded-2xl">
            <img
              src={mainImage}
              alt="main"
              className="h-full w-full rounded-2xl object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex w-full flex-col gap-6 lg:w-1/3">
          <span
            className={`inline-block rounded-full px-4 py-1 text-sm ${badgeColor}`}
          >
            {badgeText}
          </span>
          <h1 className="text-4xl font-semibold">{product.title}</h1>
          <p className="text-3xl">€{product.basePrice}</p>

          <div className="flex items-center gap-4">
            <span>Quantity</span>
            <div className="flex items-center overflow-hidden rounded-full bg-blue-600">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 text-xl"
              >
                –
              </button>
              <span className="px-6">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 text-xl"
              >
                +
              </button>
            </div>
          </div>

          <button className="w-full rounded-full bg-white py-3 text-lg font-semibold text-black transition hover:bg-gray-200">
            Bid Now
          </button>
        </div>
      </div>

      {/* Product Description and Details Section */}
      <div className="mx-auto max-w-7xl px-4 pt-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Description */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-2xl font-semibold">Product Description</h2>
            <div className="rounded-xl bg-gray-900 p-6">
              <p className="leading-relaxed text-gray-300">
                {product.description ||
                  "No description available for this product."}
              </p>

              {/* Product Specifications */}
              <div className="mt-8">
                <h3 className="mb-4 text-xl font-medium">Specifications</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex justify-between rounded-lg bg-gray-800 p-3">
                    <span className="text-gray-400">Category</span>
                    <span>{product.category}</span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-gray-800 p-3">
                    <span className="text-gray-400">Condition</span>
                    <span>New</span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-gray-800 p-3">
                    <span className="text-gray-400">Starting Price</span>
                    <span>€{product.basePrice}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Auction Activity Box */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Auction Activity</h2>
            <div className="rounded-xl bg-gray-900 p-6">
              {/* Current Auction Status */}
              <div className="mb-4 rounded-lg bg-gray-800 p-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Bid</span>
                  <span className="font-semibold text-blue-400">
                    €{auction.currentPrice}
                  </span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-gray-400">Time Left</span>
                  <span className="font-semibold text-green-400">
                    {timeLeft}
                  </span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-gray-400">Total Bids</span>
                  <span>{auction.bidders?.length || 0}</span>
                </div>
              </div>

              {/* Bid History / Live Activity */}
              <div className="mt-6">
                <h3 className="mb-3 text-lg font-medium">Recent Activity</h3>
                <div className="h-64 overflow-y-auto rounded-lg bg-gray-800 p-4">
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
                            bid €
                            <span className="text-green-400">
                              {bid.bidAmount}
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

              {/* Place Bid Section */}
              <div className="mt-6">
                <h3 className="mb-3 text-lg font-medium">Place Your Bid</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="w-full rounded-lg bg-gray-800 px-4 py-2 text-white"
                    placeholder={`Min €${auction.currentPrice + 1}`}
                    min={auction.currentPrice + 1}
                  />
                  <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500">
                    Bid
                  </button>
                </div>
              </div>
              {product.status === "live" && (
                <LiveBidding
                  auctionId={auction._id}
                  currentPrice={auction.currentPrice}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live Auction Bar */}
      <div className="fixed bottom-0 left-0 w-full border-t border-gray-700 bg-gray-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-white lg:px-8">
          <div>
            <p className="text-sm">Live Auction</p>
            <p className="text-lg font-semibold">
              Current Bid: €{auction.currentPrice}
            </p>
            <p className="text-xs text-gray-400">Ends {timeLeft}</p>
          </div>
          <button className="rounded-full bg-blue-600 px-6 py-2 transition hover:bg-blue-500">
            Join Live
          </button>
        </div>
      </div>
    </div>
  );
}
