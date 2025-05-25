import { useRef } from "react";
import CategoryCard from "./CategoryCard";

interface CategorySliderProps {
  title: string;
  categories: string[];
  onCategorySelect: (category: string) => void;
  getImage: (category: string) => string; // Function to get image for a category
}

const CategorySlider: React.FC<CategorySliderProps> = ({
  title,
  categories,
  onCategorySelect,
  getImage,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex space-x-2">
          <button
            className="rounded-full bg-gray-800 p-2 hover:bg-gray-700"
            onClick={scrollLeft}
          >
            <span className="sr-only">Previous</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button
            className="rounded-full bg-gray-800 p-2 hover:bg-gray-700"
            onClick={scrollRight}
          >
            <span className="sr-only">Next</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={sliderRef}
        className="scrollbar-hide flex gap-4 overflow-x-auto pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category) => (
          <div key={category} className="w-48 flex-none">
            <CategoryCard
              name={category}
              image={getImage(category)} // Get the proper image
              onClick={() => onCategorySelect(category)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySlider;
