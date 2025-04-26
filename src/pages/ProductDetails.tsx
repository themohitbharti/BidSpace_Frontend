import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { formatDistanceToNowStrict } from "date-fns";

// interface Bidder {
//   userId: string;
//   bidAmount: number;
//   _id: string;
// }

// interface Auction {
//   _id: string;
//   currentPrice: number;
//   endTime: string;
//   bidders: Bidder[];
// }

// interface Product {
//   _id: string;
//   title: string;
//   basePrice: number;
//   category: string;
//   coverImages: string[];
//   status: "live" | "sold" | "unsold";
// }

export default function ProductDetails() {
  const { selectedProduct: product } = useSelector(
    (state: RootState) => state.product,
  );
  const { selectedAuction: auction } = useSelector(
    (state: RootState) => state.product,
  );

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

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
