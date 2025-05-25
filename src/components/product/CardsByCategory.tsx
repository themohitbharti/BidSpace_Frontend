import { ProductCard } from "../index";

function CardsByCategory() {
  const mockProduct = {
    _id: "1",
    title: "Headphone",
    basePrice: 60,
    currentPrice: 180, // Added currentPrice
    endTime: "2024-07-20T14:15:34.620Z", // Added endTime
    category: "Electronics",
    coverImages: [
      "https://res.cloudinary.com/dhlps26ic/image/upload/v1720943511/g73tjxkhgtjxbpjjdm4n.jpg",
    ],
    status: "live" as "unsold" | "live" | "sold",
  };

  return <ProductCard product={mockProduct} />;
}

export default CardsByCategory;
