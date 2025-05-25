import React, { useState } from "react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectCategory = (category: string) => {
    onCategoryChange(category);
    setIsOpen(false);
  };

  // Capitalize first letter of category for display
  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="relative z-10">
      <button
        className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-lg hover:bg-blue-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Filter</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md bg-gray-800 shadow-xl">
          <div className="py-1">
            {categories.map((category) => (
              <button
                key={category}
                className={`block w-full px-4 py-2 text-left text-sm ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "text-gray-200 hover:bg-gray-700"
                }`}
                onClick={() => handleSelectCategory(category)}
              >
                {formatCategoryName(category)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
