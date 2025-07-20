import React, { useState } from "react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

const STATUS_OPTIONS = ["live", "sold", "unsold"];

const formatName = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [submenu, setSubmenu] = useState<"category" | "status" | null>(null);

  return (
    <div className="relative z-20">
      <button
        className="flex items-center space-x-2 rounded-lg border border-blue-500 bg-blue-600 px-4 py-2 text-white shadow-md transition hover:bg-blue-700 focus:outline-none"
        onClick={() => setIsOpen((open) => !open)}
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
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-blue-500 bg-gray-900 shadow-2xl">
          {!submenu ? (
            <div className="flex flex-col gap-2 px-4 py-4">
              <button
                className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-left text-base text-gray-200 transition hover:bg-blue-700 hover:text-white"
                onClick={() => setSubmenu("category")}
              >
                Category
              </button>
              <button
                className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-left text-base text-gray-200 transition hover:bg-blue-700 hover:text-white"
                onClick={() => setSubmenu("status")}
              >
                Status
              </button>
            </div>
          ) : submenu === "category" ? (
            <div className="px-4 py-2">
              <button
                className="mb-3 text-xs text-gray-400 hover:text-blue-400"
                onClick={() => setSubmenu(null)}
              >
                ← Back
              </button>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      selectedCategory === category
                        ? "border-blue-500 bg-blue-600 text-white"
                        : "border-gray-700 bg-gray-800 text-gray-200 hover:border-blue-400 hover:bg-blue-700 hover:text-white"
                    }`}
                    onClick={() => {
                      onCategoryChange(category);
                      setIsOpen(false);
                      setSubmenu(null);
                    }}
                  >
                    {formatName(category)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="px-4 py-2">
              <button
                className="mb-3 text-xs text-gray-400 hover:text-blue-400"
                onClick={() => setSubmenu(null)}
              >
                ← Back
              </button>
              <div className="grid grid-cols-2 gap-3">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      selectedStatus === status
                        ? "border-blue-500 bg-blue-600 text-white"
                        : "border-gray-700 bg-gray-800 text-gray-200 hover:border-blue-400 hover:bg-blue-700 hover:text-white"
                    }`}
                    onClick={() => {
                      onStatusChange(status);
                      setIsOpen(false);
                      setSubmenu(null);
                    }}
                  >
                    {formatName(status)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
