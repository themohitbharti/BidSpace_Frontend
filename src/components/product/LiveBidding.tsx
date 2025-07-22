import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useAppDispatch } from "../../store/hooks";
import { placeBid } from "../../store/productSlice";
import { LiveBidMessage } from "../../types/auction";

interface LiveBiddingProps {
  auctionId: string;
  currentPrice: number | null;
  basePrice: number;
}

export default function LiveBidding({
  auctionId,
  currentPrice,
  basePrice,
}: LiveBiddingProps) {
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<LiveBidMessage[]>([]);
  const minBid = currentPrice !== null ? currentPrice + 1 : basePrice;
  const [bidAmount, setBidAmount] = useState<number>(minBid);
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use ref to access current bidAmount without causing re-renders
  const bidAmountRef = useRef(bidAmount);

  // Update ref when bidAmount changes
  useEffect(() => {
    bidAmountRef.current = bidAmount;
  }, [bidAmount]);

  // Get current user info and bid loading/error states from Redux
  const user = useSelector((state: RootState) => state.auth.user);
  const bidLoading = useSelector(
    (state: RootState) => state.product.bidLoading,
  );
  const bidError = useSelector((state: RootState) => state.product.bidError);

  // Validate props immediately to prevent rendering with invalid data
  useEffect(() => {
    if (!auctionId) {
      console.error("LiveBidding: Missing auctionId prop");
    }
  }, [auctionId]);

  // Update minimum bid when current price changes
  useEffect(() => {
    setBidAmount(minBid);
  }, [minBid]);

  // Set error from Redux if it exists
  useEffect(() => {
    if (bidError) {
      setError(bidError);
      setTimeout(() => setError(null), 3000);
    }
  }, [bidError]);

  // Socket connection and event handling
  useEffect(() => {
    if (!auctionId) {
      console.log("❌ No auctionId provided, skipping socket connection");
      return;
    }

    console.log(
      "📍 Socket URL:",
      import.meta.env.VITE_API_URL || "http://localhost:2000",
    );
    console.log("🎯 Auction ID:", auctionId);

    const socketInstance = io(
      import.meta.env.VITE_API_URL || "http://localhost:2000",
      {
        forceNew: true,
        transports: ["websocket", "polling"],
      },
    );

    socketInstance.on("connect", () => {
      console.log(
        "✅ Socket connected successfully with ID:",
        socketInstance.id,
      );
      console.log("🚀 Attempting to join auction room:", auctionId);
      socketInstance.emit("joinAuctionRoom", auctionId);
      console.log("📤 Emitted joinAuction event with auctionId:", auctionId);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    // Listen for new bids from other users
    socketInstance.on("newBid", (bidMessage: LiveBidMessage) => {
      console.log("🎉 New bid received:", bidMessage);

      // Only add if it's not from the current user (avoid duplicates)
      if (user && bidMessage.userId !== user._id) {
        setMessages((prev) => [bidMessage, ...prev.slice(0, 15)]);
      }

      // Update minimum bid amount if the new bid is higher
      if (bidMessage.bidAmount >= bidAmountRef.current) {
        setBidAmount(bidMessage.bidAmount + 1);
        console.log("💰 Updated bid amount to:", bidMessage.bidAmount + 1);
      }
    });

    socketInstance.on("connect_error", (error) => {
      console.error("🚨 Socket connection error:", error);
    });

    return () => {
      console.log("🧹 Cleaning up socket connection for auction:", auctionId);
      socketInstance.emit("leaveAuction", auctionId);
      socketInstance.disconnect();
    };
  }, [auctionId, user]);

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Enhanced validation with clearer error messages
    if (!auctionId || auctionId.trim() === "") {
      console.error("Cannot place bid: Missing auction ID");
      setError("Auction information is missing. Please refresh the page.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (!user) {
      setError("You must be logged in to place a bid");
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (bidAmount < minBid) {
      setError(`Bid must be at least ${minBid} Coins`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsPlacingBid(true);

    // Dispatch the API call through Redux
    dispatch(placeBid({ auctionId, bidAmount }))
      .unwrap()
      .then(() => {
        // Success - add optimistic update for current user
        setError(null);

        const optimisticBid: LiveBidMessage = {
          userId: user._id,
          username: user.fullName,
          bidAmount,
          timestamp: new Date().toISOString(),
          auctionId,
          currentPrice: bidAmount,
        };

        // Add current user's bid immediately at the top
        setMessages((prev) => [optimisticBid, ...prev.slice(0, 15)]);
      })
      .catch((err) => {
        console.log("Bid error:", err);
        setError(err || "Failed to place bid");
        setTimeout(() => setError(null), 3000);
      })
      .finally(() => {
        setIsPlacingBid(false);
      });
  };

  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-medium">Live Activity</h3>

      {/* Live bid feed - Latest bids at top */}
      <div className="h-48 overflow-y-auto rounded-lg bg-gray-800 p-3">
        {messages.length > 0 ? (
          <div className="flex flex-col gap-2">
            {messages.map((msg, idx) => {
              const isCurrentUser = user && msg.userId === user._id;
              const displayName = isCurrentUser ? "You" : msg.username;

              return (
                <div
                  key={`${msg.userId}-${msg.timestamp}-${idx}`}
                  className={`flex items-center gap-2 rounded-md p-2 text-sm ${
                    isCurrentUser
                      ? "border border-blue-500/30 bg-blue-900/50"
                      : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`h-6 w-6 rounded-full text-center ${
                      isCurrentUser ? "bg-blue-600" : "bg-gray-600"
                    }`}
                  >
                    <span className="text-xs leading-6">
                      {isCurrentUser
                        ? "Y"
                        : msg.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span
                    className={`font-medium ${
                      isCurrentUser ? "text-blue-300" : "text-blue-400"
                    }`}
                  >
                    {displayName}
                  </span>{" "}
                  bid{" "}
                  <span className="font-medium text-green-400">
                    {msg.bidAmount} Coins
                  </span>
                  <div className="ml-auto flex items-center gap-2">
                  {isCurrentUser && (
                      <span className="rounded bg-blue-600/20 px-2 py-0.5 text-xs text-blue-300">
                        Your bid
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">No live activity yet</p>
        )}
      </div>

      {/* Bid form */}
      <form onSubmit={handleBidSubmit} className="mt-4">
        <div className="flex gap-2">
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            className="w-full rounded-lg bg-gray-800 px-4 py-2 text-white"
            placeholder={`Min ${minBid} Coins`}
            min={minBid}
            required
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500 disabled:opacity-50"
            disabled={isPlacingBid || bidLoading}
          >
            {isPlacingBid || bidLoading ? "Bidding..." : "Place Bid"}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </form>
    </div>
  );
}
