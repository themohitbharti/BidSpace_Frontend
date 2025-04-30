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
import { Product, Auction, ProductWithAuction } from "../types";

export default function Home() {
  const navigate = useNavigate();
  const [recentProducts, setRecentProducts] = useState<ProductWithAuction[]>(
    [],
  );
  const [trendingProducts, setTrendingProducts] = useState<
    ProductWithAuction[]
  >([]);
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
          // Transform API data to match the expected format
          const recentProductsWithAuctions = response.data.map(
            (product: Product) => {
              // Create a default auction object if there isn't one associated
              const defaultAuction: Auction = {
                _id: product._id,
                currentPrice: product.basePrice,
                endTime: new Date(
                  Date.now() + 7 * 24 * 60 * 60 * 1000,
                ).toISOString(), // 7 days from now
                bidders: [],
              };

              return {
                product,
                auction: defaultAuction,
              };
            },
          );

          setRecentProducts(recentProductsWithAuctions);
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
          // Transform API data to match the expected format
          const trendingProductsWithAuctions = response.data.map(
            (product: Product) => {
              // Create a default auction object if there isn't one associated
              const defaultAuction: Auction = {
                _id: product._id,
                currentPrice: product.basePrice,
                endTime: new Date(
                  Date.now() + 7 * 24 * 60 * 60 * 1000,
                ).toISOString(), // 7 days from now
                bidders: [],
              };

              return {
                product,
                auction: defaultAuction,
              };
            },
          );

          setTrendingProducts(trendingProductsWithAuctions);
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

  // Mock data for sliders (backup)
  const mockProducts = [
    {
      _id: "1",
      title: "Cosmic Headphones",
      basePrice: 60,
      category: "Electronics",
      coverImages: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      ],
      status: "live",
    },
    {
      _id: "2",
      title: "Nebula Watch",
      basePrice: 120,
      category: "Fashion",
      coverImages: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1999&q=80",
      ],
      status: "live",
    },
    {
      _id: "3",
      title: "Galactic Sneakers",
      basePrice: 95,
      category: "Fashion",
      coverImages: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      ],
      status: "live",
    },
    {
      _id: "4",
      title: "Interstellar Drone",
      basePrice: 299,
      category: "Tech",
      coverImages: [
        "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      ],
      status: "live",
    },
    {
      _id: "5",
      title: "Space Camera",
      basePrice: 199,
      category: "Electronics",
      coverImages: [
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      ],
      status: "live",
    },
  ];

  const mockAuctions = [
    {
      _id: "1",
      currentPrice: 85,
      endTime: "2025-05-20T14:15:34.620Z",
      bidders: [],
    },
    {
      _id: "2",
      currentPrice: 150,
      endTime: "2025-05-18T10:30:00.000Z",
      bidders: [],
    },
    {
      _id: "3",
      currentPrice: 120,
      endTime: "2025-05-22T18:45:00.000Z",
      bidders: [],
    },
    {
      _id: "4",
      currentPrice: 350,
      endTime: "2025-05-19T12:00:00.000Z",
      bidders: [],
    },
    {
      _id: "5",
      currentPrice: 230,
      endTime: "2025-05-23T09:15:00.000Z",
      bidders: [],
    },
  ];

  // Use recentProducts for Stellar Savings only if it's loaded
  const stellarSavings =
    recentProducts.length > 0
      ? [...recentProducts].reverse()
      : mockProducts.slice(0, 5).map((product, index) => ({
          product,
          auction: mockAuctions[index],
        }));

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
            renderCard={({ product, auction }, idx) => (
              <div onClick={() => handleProductClick(product._id)}>
                <ProductCard key={idx} product={product} auction={auction} />
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
            renderCard={({ product, auction }, idx) => (
              <div onClick={() => handleProductClick(product._id)}>
                <ProductCard key={idx} product={product} auction={auction} />
              </div>
            )}
          />
        ) : (
          <div className="my-8 text-center text-white">
            No trending products found
          </div>
        )}

        <SliderSection
          title="Stellar Savings"
          items={stellarSavings}
          renderCard={({ product, auction }, idx) => (
            <div onClick={() => handleProductClick(product._id)}>
              <ProductCard key={idx} product={product} auction={auction} />
            </div>
          )}
        />
      </Container>
    </div>
  );
}
