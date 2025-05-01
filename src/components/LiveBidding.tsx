import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface LiveBidMessage {
  userId: string;
  username: string;
  bidAmount: number;
  timestamp: string;
}

interface LiveBiddingProps {
  auctionId: string;
  currentPrice: number;
}

export default function LiveBidding({
  auctionId,
  currentPrice,
}: LiveBiddingProps) {
  const [messages, setMessages] = useState<LiveBidMessage[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(currentPrice + 1);
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current user info from Redux store (adjust based on your auth implementation)
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // Connect to the WebSocket server
    const socketInstance = io(
      import.meta.env.VITE_API_URL || "http://localhost:3000",
    );
    setSocket(socketInstance);

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

    // Listen for bid responses
    socketInstance.on(
      "bidResponse",
      (response: { success: boolean; message: string }) => {
        setIsPlacingBid(false);
        if (!response.success) {
          setError(response.message);
          setTimeout(() => setError(null), 3000);
        }
      },
    );

    return () => {
      socketInstance.emit("leaveAuction", auctionId);
      socketInstance.disconnect();
    };
  }, [auctionId, bidAmount]);

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !user) return;

    if (bidAmount <= currentPrice) {
      setError("Bid must be higher than the current price");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsPlacingBid(true);
    // Now we're using the socket to send a bid
    socket.emit("placeBid", {
      auctionId,
      userId: user._id,
      username: user.fullName || `User_${user._id.substring(0, 6)}`,
      bidAmount,
    });
  };

  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-medium">Live Activity</h3>

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
                bid €
                <span className="font-medium text-green-400">
                  {msg.bidAmount}
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
            placeholder={`Min €${currentPrice + 1}`}
            min={currentPrice + 1}
            required
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500 disabled:opacity-50"
            disabled={isPlacingBid}
          >
            {isPlacingBid ? "Bidding..." : "Place Bid"}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </form>
    </div>
  );
}
