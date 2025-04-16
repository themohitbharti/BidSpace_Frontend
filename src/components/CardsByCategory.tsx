
import { ProductCard } from "./index";

function CardsByCategory() {
  const mockProduct = {
    _id: "1",
    title: "Headphone",
    basePrice: 60,
    category: "Electronics",
    coverImages: [
      "https://res.cloudinary.com/dhlps26ic/image/upload/v1720943511/g73tjxkhgtjxbpjjdm4n.jpg",
    ],
    status: "live" as "unsold" | "live" | "sold",
  };

  const mockAuction = {
    _id: "1",
    currentPrice: 180,
    endTime: "2024-07-20T14:15:34.620Z",
    bidders: [],
  };

  return <ProductCard product={mockProduct} auction={mockAuction} />;
}

export default CardsByCategory;
