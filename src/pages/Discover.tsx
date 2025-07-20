import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProductsByCategory } from "../api/productApi";
import { Product } from "../types";
import CategoryFilter from "../components/category/CategoryFilter";
import CategorySlider from "../components/category/CategorySlider";
import ProductCard from "../components/product/ProductCard";

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

import { CATEGORIES } from "../constants/categories";

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
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialStatus = searchParams.get("status") || "live";
  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<
    Record<string, Product[]>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryLoading, setCategoryLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Update the useEffect for fetching products to get more products when a specific category is selected
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // If "all" is selected, pass "all" as category
        const categoryToFetch =
          selectedCategory === "all" ? "all" : selectedCategory;
        const limit = 15; // or 10 as per your preference

        const response = await getProductsByCategory(
          categoryToFetch,
          selectedStatus,
          1,
          limit,
        );

        if (response.success) {
          setProducts(response.data);
          setPage(1);
          setHasMore(response.data.length === limit);
        } else {
          // Check if the message indicates no products were found
          if (
            response.message &&
            response.message.includes("No products found")
          ) {
            // This is not an error, just an empty result
            setProducts([]);
            setHasMore(false);
          } else {
            // This is an actual error
            setError(response.message || "Failed to load products");
          }
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedStatus]); // <-- Add selectedStatus as dependency

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

  useEffect(() => {
    const urlCategory = searchParams.get("category") || "all";
    const urlStatus = searchParams.get("status") || "live";
    setSelectedCategory(urlCategory);
    setSelectedStatus(urlStatus);
    // eslint-disable-next-line
  }, []);

  // Update category change to include status in URL
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    navigate(
      category === "all"
        ? `/discover?status=${selectedStatus}`
        : `/discover?category=${encodeURIComponent(category)}&status=${selectedStatus}`,
    );
    setTimeout(() => {
      const productsSection = document.getElementById(
        "selected-category-products",
      );
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Add a handler for status change that updates the URL and hides featured
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    navigate(
      selectedCategory === "all"
        ? `/discover?status=${status}`
        : `/discover?category=${encodeURIComponent(selectedCategory)}&status=${status}`,
    );
    setTimeout(() => {
      const productsSection = document.getElementById(
        "selected-category-products",
      );
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
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
        selectedCategory === "all" ? "Tech" : selectedCategory;

      const response = await getProductsByCategory(
        categoryToFetch,
        "live",
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

  // Hide featured sections if either category or status is filtered
  const showFeatured = selectedCategory === "all" && selectedStatus === "live";

  // Helper for filter chips
  const isDefaultCategory = selectedCategory === "all";
  const isDefaultStatus = selectedStatus === "live";

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
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
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

        {/* Active Filters Chips */}
        {(!isDefaultCategory || !isDefaultStatus) && (
          <div className="mb-6 flex flex-wrap gap-3">
            {!isDefaultCategory && (
              <span className="flex items-center rounded-full border border-blue-500 bg-gray-900 px-4 py-1 text-sm text-blue-300 shadow">
                {formatCategoryName(selectedCategory)}
                <button
                  className="ml-2 rounded-full bg-blue-600 p-1 text-white hover:bg-blue-700"
                  aria-label="Remove category filter"
                  onClick={() => handleCategoryChange("all")}
                >
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M6 6l8 8M6 14L14 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </span>
            )}
            {!isDefaultStatus && (
              <span className="flex items-center rounded-full border border-blue-500 bg-gray-900 px-4 py-1 text-sm text-blue-300 shadow">
                {formatCategoryName(selectedStatus)}
                <button
                  className="ml-2 rounded-full bg-blue-600 p-1 text-white hover:bg-blue-700"
                  aria-label="Remove status filter"
                  onClick={() => handleStatusChange("live")}
                >
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M6 6l8 8M6 14L14 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </span>
            )}
          </div>
        )}

        {/* Conditionally show featured categories and summer collection */}
        {showFeatured && (
          <>
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
                    const productsForCategory =
                      categoryProducts[category] || [];
                    const hasProducts = productsForCategory.length > 0;

                    return (
                      <div
                        key={category}
                        className="rounded-lg bg-gray-900 p-6"
                      >
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

            {/* Summer Collection Section - Only show when in "all" view */}
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
          </>
        )}

        {/* Selected Category Products */}
        <div
          id="selected-category-products"
          className={`mb-12 ${selectedCategory !== "all" ? "rounded-lg border-2 border-blue-500 bg-gray-900/50 p-6" : ""}`}
        >
          <h2 className="mb-6 flex items-center justify-between text-2xl font-bold">
            <span>
              {selectedCategory === "all"
                ? "All Products"
                : `${formatCategoryName(selectedCategory)} Collection`}
            </span>

            {selectedCategory !== "all" && (
              <span className="text-sm text-blue-300">
                Showing {products.length} product(s)
              </span>
            )}
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-500">{error}</div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center">
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
                    d="M20 12H4M8 8V16M16 16V8"
                  />
                </svg>
              </div>
              <p className="text-lg text-gray-300">
                No products available in the{" "}
                {formatCategoryName(selectedCategory)} category
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Check back soon for new listings
              </p>
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
      </div>
    </div>
  );
}
