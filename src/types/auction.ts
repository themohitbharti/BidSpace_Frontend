export interface LiveBidMessage {
  userId: string;
  username: string;
  bidAmount: number;
  timestamp: string;
  auctionId: string;
  currentPrice: number;
}

export interface Bidder {
  userId: string;
  bidAmount: number;
  bidTime?: string; // Optional since it might not always be present
  username?: string; // Optional since historical bids might not have username
}

export interface TopBidder {
  userId: string;
  username: string;
  bidAmount: number;
  timestamp: string;
  isRealtime: boolean;
}
