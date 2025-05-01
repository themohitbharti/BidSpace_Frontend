export interface Bidder {
  userId: string;
  bidAmount: number;
  _id: string;
}

export interface Product {
  _id: string;
  title: string;
  basePrice: number;
  currentPrice: number;
  endTime: string;
  category: string;
  coverImages: string[];
  description?: string; // Add description field
  status: "live" | "unsold" | "sold";
  auctionId?: string;
}

export interface Auction {
  _id: string;
  currentPrice: number;
  endTime: string;
  bidders: Bidder[];
}

export interface ProductWithAuction {
  product: Product;
  auction?: Auction; // Make auction optional
}
