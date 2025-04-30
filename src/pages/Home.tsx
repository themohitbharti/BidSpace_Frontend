import { useEffect, useState } from "react";
import {
  HeroSlider,
  SearchBar,
  Container,
  HomeStats,
  ProductCard,
  SliderSection,
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
          // API now directly returns products with currentPrice and endTime
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
          // API now directly returns products with currentPrice and endTime
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

  // Handler for product card clicks
  const handleProductClick = (productId: string) => {
    navigate(`/product-details/${productId}`);
  };

  return (
    <div>
      <HeroSlider />

      <div className="py-12">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-3">
            {/* Search Section - Takes up 2/3 of the space */}
            <div className="space-y-6 lg:col-span-2">
              <h2 className="mb-6 text-3xl font-bold text-white">
                Find Your Favourite Bids
              </h2>
              <div className="max-w-2xl">
                <SearchBar />
              </div>
            </div>

            {/* Stats Section - Takes up 1/3 of the space */}
            <div className="flex items-center lg:col-span-1">
              <HomeStats />
            </div>
          </div>
        </Container>
      </div>

      <Container>
        {/* "New on BidSpace" section with loading/error states */}
        {isRecentLoading ? (
          <div className="my-8 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : recentError ? (
          <div className="my-8 text-center text-red-500">{recentError}</div>
        ) : recentProducts.length > 0 ? (
          <SliderSection
            title="New on BidSpace"
            items={recentProducts}
            renderCard={(product, idx) => (
              <div onClick={() => handleProductClick(product._id)}>
                <ProductCard key={idx} product={product} />
              </div>
            )}
          />
        ) : (
          <div className="my-8 text-center text-white">
            No recent products found
          </div>
        )}

        {/* "Trending Now" section with loading/error states */}
        {isTrendingLoading ? (
          <div className="my-8 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : trendingError ? (
          <div className="my-8 text-center text-red-500">{trendingError}</div>
        ) : trendingProducts.length > 0 ? (
          <SliderSection
            title="Trending Now"
            items={trendingProducts}
            renderCard={(product, idx) => (
              <div onClick={() => handleProductClick(product._id)}>
                <ProductCard key={idx} product={product} />
              </div>
            )}
          />
        ) : (
          <div className="my-8 text-center text-white">
            No trending products found
          </div>
        )}
      </Container>
    </div>
  );
}
