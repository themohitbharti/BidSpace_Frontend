import { useEffect, useState } from "react";
import {
  HeroSlider,
  SearchBar,
  Container,
  HomeStats,
  ProductCard,
  SliderSection,
  LoadingContainer,
} from "../components/index";
import { useNavigate } from "react-router-dom";
import { getRecentProducts, getTrendingProducts } from "../api/productApi";
import { Product } from "../types";

export default function Home() {
  const navigate = useNavigate();
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [isRecentLoading, setIsRecentLoading] = useState<boolean>(true);
  const [isTrendingLoading, setIsTrendingLoading] = useState<boolean>(true);
  const [recentError, setRecentError] = useState<string | null>(null);
  const [trendingError, setTrendingError] = useState<string | null>(null);

  // Fetch recent products on component mount
  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        setIsRecentLoading(true);
        setRecentError(null);

        const response = await getRecentProducts();

        if (response.success) {
          setRecentProducts(response.data);
        } else {
          throw new Error(
            response.message || "Failed to fetch recent products",
          );
        }
      } catch (err) {
        console.error("Error fetching recent products:", err);
        setRecentError("Failed to load recent products");
      } finally {
        setIsRecentLoading(false);
      }
    };

    fetchRecentProducts();
  }, []);

  // Fetch trending products on component mount
  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        setIsTrendingLoading(true);
        setTrendingError(null);

        const response = await getTrendingProducts();

        if (response.success) {
          setTrendingProducts(response.data);
        } else {
          throw new Error(
            response.message || "Failed to fetch trending products",
          );
        }
      } catch (err) {
        console.error("Error fetching trending products:", err);
        setTrendingError("Failed to load trending products");
      } finally {
        setIsTrendingLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  const handleProductClick = (productId: string) => {
    navigate(`/product-details/${productId}`);
  };

  return (
    <div>
      <HeroSlider />

      <div className="py-12">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <h2 className="mb-6 text-3xl font-bold text-white">
                Find Your Favourite Bids
              </h2>
              <div className="max-w-2xl">
                <SearchBar />
              </div>
            </div>
            <div className="flex items-center lg:col-span-1">
              <HomeStats />
            </div>
          </div>
        </Container>
      </div>

      {/* Enhanced Product Sections */}
      <div className="space-y-20 py-16">
        <Container>
          {/* "New on BidSpace" section */}
          <div className="relative">
            <div className="mb-12 text-center">
              <h2 className="relative mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-5xl font-black tracking-tight text-transparent">
                New on BidSpace
              </h2>
              <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"></div>
              <p className="mt-4 text-lg font-medium text-gray-300">
                Fresh arrivals ready for bidding
              </p>
            </div>

            {isRecentLoading ? (
              <LoadingContainer minHeight="min-h-[400px]" />
            ) : recentError ? (
              <div className="py-16 text-center">
                <div className="mx-auto max-w-md rounded-xl border border-red-500/20 bg-red-900/20 p-8 backdrop-blur-sm">
                  <p className="text-xl font-semibold text-red-400">
                    {recentError}
                  </p>
                </div>
              </div>
            ) : recentProducts.length > 0 ? (
              <SliderSection
                title=""
                items={recentProducts}
                renderCard={(product, idx) => (
                  <div
                    key={idx}
                    className="w-[18rem] flex-shrink-0 transform transition-all duration-300 hover:scale-105"
                    onClick={() => handleProductClick(product._id)}
                  >
                    <ProductCard product={product} />
                  </div>
                )}
              />
            ) : (
              <div className="mx-auto max-w-md rounded-xl border border-gray-700/50 bg-gray-800/30 p-12 text-center backdrop-blur-sm">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <h3 className="mt-6 text-xl font-bold text-white">
                  No recent products found
                </h3>
                <p className="mt-2 text-gray-400">
                  Check back soon for new auction listings
                </p>
              </div>
            )}
          </div>

          {/* Stylish Divider */}
          <div className="relative flex items-center justify-center py-16">
            <div className="absolute inset-0 flex items-center">
              <div className="border-gradient-to-r w-full border-t from-transparent via-blue-500/30 to-transparent"></div>
            </div>
            <div className="relative flex items-center space-x-4 bg-gray-900 px-8">
              <div className="h-3 w-3 animate-pulse rounded-full bg-blue-500"></div>
              <div className="animation-delay-150 h-2 w-2 animate-pulse rounded-full bg-cyan-400"></div>
              <div className="animation-delay-300 h-3 w-3 animate-pulse rounded-full bg-blue-400"></div>
            </div>
          </div>

          {/* "Trending Now" section */}
          <div className="relative">
            <div className="mb-12 text-center">
              <h2 className="relative mb-4 bg-gradient-to-r from-orange-400 via-red-400 to-pink-500 bg-clip-text text-5xl font-black tracking-tight text-transparent">
                Trending Now
              </h2>
              <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-orange-500 to-pink-400"></div>
              <p className="mt-4 text-lg font-medium text-gray-300">
                Hot items everyone's watching
              </p>
            </div>

            {isTrendingLoading ? (
              <LoadingContainer minHeight="min-h-[400px]" />
            ) : trendingError ? (
              <div className="py-16 text-center">
                <div className="mx-auto max-w-md rounded-xl border border-red-500/20 bg-red-900/20 p-8 backdrop-blur-sm">
                  <p className="text-xl font-semibold text-red-400">
                    {trendingError}
                  </p>
                </div>
              </div>
            ) : trendingProducts.length > 0 ? (
              <SliderSection
                title=""
                items={trendingProducts}
                renderCard={(product, idx) => (
                  <div
                    key={idx}
                    className="w-[18rem] flex-shrink-0 transform transition-all duration-300 hover:scale-105"
                    onClick={() => handleProductClick(product._id)}
                  >
                    <ProductCard product={product} />
                  </div>
                )}
              />
            ) : (
              <div className="mx-auto max-w-md rounded-xl border border-gray-700/50 bg-gray-800/30 p-12 text-center backdrop-blur-sm">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <h3 className="mt-6 text-xl font-bold text-white">
                  No trending products found
                </h3>
                <p className="mt-2 text-gray-400">
                  Popular items will appear here soon
                </p>
              </div>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}
