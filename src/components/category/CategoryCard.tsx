import React from "react";

interface CategoryCardProps {
  name: string;
  image: string; // Change from 'any' to 'string' for proper type safety
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  image,
  onClick,
}) => {
  return (
    <div
      className="relative aspect-square transform cursor-pointer overflow-hidden rounded-lg transition-all hover:scale-105"
      onClick={onClick}
    >
      {/* Use <img> instead of background-image */}
      <img
        src={image}
        alt={name}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Reduced opacity overlay - 30% instead of 50% */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />

      {/* Category name */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-medium text-white drop-shadow-lg">
          {name}
        </span>
      </div>
    </div>
  );
};

export default CategoryCard;
