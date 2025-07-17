import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useAppDispatch } from "../../store/hooks";
import { placeBid } from "../../store/productSlice";

interface LiveBidMessage {
  userId: string;
  username: string;
  bidAmount: number;
  timestamp: string;
}

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

  // Validate props immediately to prevent rendering with invalid data
  useEffect(() => {
    if (!auctionId) {
      console.error("LiveBidding: Missing auctionId prop");
    }
    if (typeof currentPrice !== "number" || isNaN(currentPrice)) {
      console.error("LiveBidding: Invalid currentPrice prop:", currentPrice);
    }
  }, [auctionId, currentPrice]);

  // Get current user info and bid loading/error states from Redux
  const user = useSelector((state: RootState) => state.auth.user);
  const bidLoading = useSelector(
    (state: RootState) => state.product.bidLoading,
  );
  const bidError = useSelector((state: RootState) => state.product.bidError);

  // Update minimum bid when current price changes
  useEffect(() => {
    setBidAmount(minBid);
  }, [currentPrice, basePrice, minBid]);

  // Set error from Redux if it exists
  useEffect(() => {
    if (bidError) {
      setError(bidError);
      setTimeout(() => setError(null), 3000);
    }
  }, [bidError]);

  useEffect(() => {
    // Connect to the WebSocket server
    const socketInstance = io(
      import.meta.env.VITE_API_URL || "http://localhost:3000",
    );

    // Join the auction room
    socketInstance.emit("joinAuction", auctionId);

    // Listen for new bids
    socketInstance.on("newBid", (bidMessage: LiveBidMessage) => {
      setMessages((prev) => [bidMessage, ...prev]);
      // Update minimum bid amount when new bids come in
      if (bidMessage.bidAmount >= bidAmount) {
        setBidAmount(bidMessage.bidAmount + 1);
      }
    });

    return () => {
      socketInstance.emit("leaveAuction", auctionId);
      socketInstance.disconnect();
    };
  }, [auctionId, bidAmount]);

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
      setError("Bid must be higher than the current price");
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
        // Success is handled by the reducer updating the state
        // Show success message
        setError(null);
      })
      .catch((err) => {
        console.log(err);
        // Error already handled by setting bidError in Redux
      })
      .finally(() => {
        setIsPlacingBid(false);
      });
  };

  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-medium">Place Your Bid</h3>

      {/* Live bid feed */}
      <div className="h-48 overflow-y-auto rounded-lg bg-gray-800 p-3">
        {messages.length > 0 ? (
          <div className="flex flex-col gap-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-md bg-gray-700 p-2 text-sm"
              >
                <div className="h-6 w-6 rounded-full bg-blue-600 text-center">
                  <span className="text-xs leading-6">
                    {msg.username.charAt(0)}
                  </span>
                </div>
                <span className="font-medium text-blue-400">
                  {msg.username}
                </span>{" "}
                bid{" "}
                <span className="font-medium text-green-400">
                  {msg.bidAmount} Coins
                </span>
              </div>
            ))}
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
