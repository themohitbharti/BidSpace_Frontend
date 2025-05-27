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
  description?: string;
  status: "live" | "unsold" | "sold";
  listedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  auctionId?: string;
  finalSoldPrice?: number;
}

export interface Auction {
  _id: string;
  productId: string;
  startPrice: number;
  currentPrice: number;
  endTime: string;
  bidders: Bidder[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ProductWithAuction {
  product: Product;
  auction?: Auction;
}
