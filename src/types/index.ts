export interface Bidder {
  userId: string;
  bidAmount: number;
  _id: string;
}

export interface Product {
  _id: string;
  title: string;
  basePrice: number;
  currentPrice: number; // Added property
  endTime: string; // Added property
  category: string;
  coverImages: string[];
  status: "live" | "unsold" | "sold"; // Use union type instead of string
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
