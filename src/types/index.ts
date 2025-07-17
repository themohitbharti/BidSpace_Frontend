export interface Bidder {
  userId: string;
  username: string;
  bidAmount: number;
  bidTime: string;
  _id: string;
}

export interface Product {
  _id: string;
  title: string;
  basePrice: number;
  currentPrice: number | null;
  endTime: string;
  category: string;
  coverImages: string[];
  description?: string;
  status: string;
  listedBy: string;
  createdAt?: string;
  updatedAt?: string;
  __v: number;
  auctionId?: string;
  finalSoldPrice?: number;
}

export interface Auction {
  _id: string;
  productId: string;
  startPrice: number;
  currentPrice: number | null;
  endTime: string;
  bidders: Bidder[];
  createdAt?: string;
  updatedAt?: string;
  __v: number;
}

export interface ProductAuctionResponse {
  product: Product;
  auction: Auction;
}
