import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProductsByCategory } from "../api/productApi";
import { Product } from "../types";
import CategoryFilter from "../components/CategoryFilter";
import CategorySlider from "../components/CategorySlider";
import ProductCard from "../components/ProductCard";

// At the top of your file, update the imports to include the new categories:
import TechImage from "../assets/categories/tech.png";
import FashionImage from "../assets/categories/Fashion.jpg";
import FoodImage from "../assets/categories/Food.jpg";
import HomeImage from "../assets/categories/Home.jpg";
import CollectiblesImage from "../assets/categories/Collectibles.avif";
import defaultImage from "../assets/categories/Food.jpg";

// Add the new category images from the assets directory
import ToysImage from "../assets/categories/Toys.jpg";
import MusicImage from "../assets/categories/Music.jpeg";
import FootwearImage from "../assets/categories/Footwear.jpg";
import ClothesImage from "../assets/categories/Clothes.jpg";

import Category_banner from "../assets/Category_banner.jpg";

// Available categories
const CATEGORIES = [
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

// Featured categories to display in separate sections
const FEATURED_CATEGORIES = ["Tech", "Food", "Music"];

// Update your CATEGORY_IMAGES mapping to include the new categories:
const CATEGORY_IMAGES: Record<string, string> = {
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

// Update your getCategoryImage function:
const getCategoryImage = (category: string): string => {
  return CATEGORY_IMAGES[category] || defaultImage;
};

export default function Categories() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<
    Record<string, Product[]>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryLoading, setCategoryLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Fetch products for the selected category
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // If "all" is selected, get products from all categories
        const categoryToFetch =
          selectedCategory === "all" ? "Tech" : selectedCategory;

        const response = await getProductsByCategory(
          categoryToFetch,
          "live",
          "no",
          1,
          15,
        );

        if (response.success) {
          setProducts(response.data);
          setPage(1);
          setHasMore(response.data.length === 15);
        } else {
          setError(response.message || "Failed to load products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // Fetch products for each featured category
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setCategoryLoading(true);

      try {
        const categoryData: Record<string, Product[]> = {};

        // Make a separate API call for each featured category
        const fetchPromises = FEATURED_CATEGORIES.map(async (category) => {
          try {
            const response = await getProductsByCategory(
              category,
              "live",
              "no",
              1,
              4, // Limit to 4 products per category
            );

            // Store products if successful, otherwise store empty array
            categoryData[category] = response.success ? response.data : [];
          } catch (err) {
            console.error(`Error fetching products for ${category}:`, err);
            // Still include the category with empty products
            categoryData[category] = [];
          }
        });

        await Promise.all(fetchPromises);
        setCategoryProducts(categoryData);
      } catch (err) {
        console.error("Error fetching category products:", err);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategoryProducts();
  }, []);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Handle product click
  const handleProductClick = (productId: string) => {
    navigate(`/product-details/${productId}`);
  };

  // Load more products
  const handleLoadMore = async () => {
    try {
      const nextPage = page + 1;

      // If "all" is selected, get products from the first category as default
      const categoryToFetch =
        selectedCategory === "all" ? "tech" : selectedCategory;

      const response = await getProductsByCategory(
        categoryToFetch,
        "live",
        "no",
        nextPage,
        15,
      );

      if (response.success) {
        if (response.data.length > 0) {
          setProducts((prev) => [...prev, ...response.data]);
          setPage(nextPage);
          setHasMore(response.data.length === 15);
        } else {
          setHasMore(false);
        }
      } else {
        // Handle unsuccessful API responses
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more products:", err);
      setHasMore(false);
    }
  };

  // Format category name for display
  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="min-h-screen pb-16 text-white">
      {/* Category Header/Banner */}
      <div
        className="relative mb-8 h-48 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${Category_banner})` }}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <h1 className="text-4xl font-bold">Discover Products</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="mb-8 flex justify-end">
          <CategoryFilter
            categories={["all", ...CATEGORIES]}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* All Categories Grid */}
        <div className="mb-12">
          <CategorySlider
            title="All Categories"
            categories={CATEGORIES}
            onCategorySelect={handleCategoryChange}
            getImage={getCategoryImage} // Pass the function to get images
          />
        </div>

        {/* Featured Categories Grid - 2x2 */}
        {categoryLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold">Featured Categories</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {FEATURED_CATEGORIES.map((category) => {
                const productsForCategory = categoryProducts[category] || [];
                const hasProducts = productsForCategory.length > 0;

                return (
                  <div key={category} className="rounded-lg bg-gray-900 p-6">
                    <div className="relative mb-4 h-24 overflow-hidden rounded-lg">
                      {/* Replace CSS background-image with an actual img element */}
                      <img
                        src={getCategoryImage(category)}
                        alt={`${category} category`}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="bg-opacity-50 absolute inset-0 bg-black" />

                      <div className="absolute inset-0 flex items-center justify-between px-4">
                        <h3 className="text-xl font-bold text-white">
                          {formatCategoryName(category)} Collection
                        </h3>
                        {hasProducts && (
                          <button
                            className="rounded-full bg-blue-600 px-4 py-1 text-sm hover:bg-blue-700"
                            onClick={() => handleCategoryChange(category)}
                          >
                            View All
                          </button>
                        )}
                      </div>
                    </div>

                    {hasProducts ? (
                      <div className="grid grid-cols-2 gap-4">
                        {productsForCategory.slice(0, 4).map((product) => (
                          <ProductCard
                            key={product._id}
                            product={product}
                            onClick={() => handleProductClick(product._id)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <div className="mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mx-auto h-10 w-10 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M20 12H4M8 8V16M16 16V8"
                            />
                          </svg>
                        </div>
                        <p className="text-base text-gray-400">
                          No products in this category yet
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Check back soon
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Category Products */}
        <div className="mb-12">
          <h2 className="mb-6 flex items-center justify-between text-2xl font-bold">
            <span>
              {selectedCategory === "all"
                ? "All Products"
                : `${formatCategoryName(selectedCategory)} Collection`}
            </span>
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-500">{error}</div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              No products found in this category
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onClick={() => handleProductClick(product._id)}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    className="rounded-md bg-blue-600 px-6 py-2 hover:bg-blue-700"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Category-Specific Featured Sections - Now in 2x2 Grid */}
        {categoryLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="mb-16">
            <h2 className="mb-6 text-2xl font-bold">Featured Categories</h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {FEATURED_CATEGORIES.map((category) => {
                const productsForCategory = categoryProducts[category] || [];
                const hasProducts = productsForCategory.length > 0;

                // Always render the section regardless of whether there are products
                return (
                  <div key={category} className="rounded-lg bg-gray-900 p-6">
                    <h3 className="mb-4 flex items-center justify-between text-xl font-bold">
                      <span>{formatCategoryName(category)} Collection</span>
                      {hasProducts && (
                        <button
                          className="rounded-full bg-blue-600 px-4 py-1 text-sm hover:bg-blue-700"
                          onClick={() => handleCategoryChange(category)}
                        >
                          View All
                        </button>
                      )}
                    </h3>

                    {hasProducts ? (
                      <div className="grid grid-cols-2 gap-4">
                        {productsForCategory.slice(0, 4).map((product) => (
                          <ProductCard
                            key={product._id}
                            product={product}
                            onClick={() => handleProductClick(product._id)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <div className="mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mx-auto h-10 w-10 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M20 12H4M8 8V16M16 16V8"
                            />
                          </svg>
                        </div>
                        <p className="text-base text-gray-400">
                          No products in this category yet
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Check back soon
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Summer Collection Section */}
        <div className="mb-12">
          <h2 className="mb-6 flex items-center justify-between text-2xl font-bold">
            <span>Summer Collection</span>
            {categoryProducts["fashion"] &&
              categoryProducts["fashion"].length > 0 && (
                <div className="flex space-x-2">
                  <button
                    className="rounded-full bg-gray-800 p-2 hover:bg-gray-700"
                    onClick={() => handleCategoryChange("fashion")}
                  >
                    View All
                  </button>
                </div>
              )}
          </h2>

          {categoryProducts["fashion"] &&
          categoryProducts["fashion"].length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categoryProducts["fashion"].slice(0, 4).map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onClick={() => handleProductClick(product._id)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-gray-900 py-10 text-center">
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <p className="text-lg text-gray-400">
                Summer collection coming soon
              </p>
              <p className="mt-2 text-gray-500">
                Be the first to know when new items drop
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
