import TechImage from "../assets/categories/tech.png";
import FashionImage from "../assets/categories/Fashion.jpg";
import FoodImage from "../assets/categories/Food.jpg";
import HomeImage from "../assets/categories/Home.jpg";
import CollectiblesImage from "../assets/categories/Collectibles.avif";
import ToysImage from "../assets/categories/Toys.jpg";
import MusicImage from "../assets/categories/Music.jpeg";
import FootwearImage from "../assets/categories/Footwear.jpg";
import ClothesImage from "../assets/categories/Clothes.jpg";
import defaultImage from "../assets/categories/Food.jpg";

export const CATEGORIES = [
  "Tech",
  "Fashion",
  "Food",
  "Home",
  "Collectibles",
  "Toys",
  "Music",
  "Footwear",
  "Clothes",
];

export const CATEGORY_IMAGES: Record<string, string> = {
    Tech: TechImage,
    Fashion: FashionImage,
    Food: FoodImage,
    Home: HomeImage,
    Collectibles: CollectiblesImage,
    Toys: ToysImage,
    Music: MusicImage,
    Footwear: FootwearImage,
    Clothes: ClothesImage,
  };
  export { defaultImage };
