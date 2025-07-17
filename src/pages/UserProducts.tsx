import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Container, ProductCard } from "../components/index";
import { Product } from "../types";
import {
  getPurchasedProducts,
  getListedProducts,
  getReservedProducts,
} from "../api/productApi";
import axios from "axios";

export default function UserProducts() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [listedProducts, setListedProducts] = useState<Product[]>([]);
  const [reservedProducts, setReservedProducts] = useState<Product[]>([]);

  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  // Add this to handle the tab query parameter
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "purchased";

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // Fetch user's products
  useEffect(() => {
    const fetchUserProducts = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch purchased products using API function
        const purchasedResponse = await getPurchasedProducts();
        if (purchasedResponse.success) {
          setPurchasedProducts(purchasedResponse.data);
        }

        // Fetch listed products using API function
        const listedResponse = await getListedProducts();
        if (listedResponse.success) {
          setListedProducts(listedResponse.data);
        }

        // Fetch reserved products using API function
        const reservedResponse = await getReservedProducts();
        if (reservedResponse.success) {
          setReservedProducts(reservedResponse.data);
        }
      } catch (err) {
        console.error("Error fetching user products:", err);

        // Use proper error handling
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message || "Failed to load user products",
          );
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load user products");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProducts();
  }, [user]);

  // Handler for product card clicks
  const handleProductClick = (productId: string) => {
    navigate(`/product-details/${productId}`);
  };

  if (!user) {
    return (
      <div className="py-20 text-center text-white">
        Loading user profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* Profile Header with background image */}
      <div className="relative">
        {/* Background banner image */}
        <div className="h-72 w-full overflow-hidden bg-gradient-to-r from-blue-900 to-purple-900">
          <img
            src="/src/assets/profile_banner.jpg"
            alt="Profile banner"
            className="h-full w-full object-cover opacity-70"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        {/* Profile content overlay */}
        <Container>
          <div className="relative -mt-24 flex flex-col items-center md:flex-row md:items-end">
            {/* Profile image */}
            <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-gray-900 bg-gray-800">
              <img
                src={`/src/assets/DP.png`}
                alt={user.fullName}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/src/assets/default_avatar.jpg";
                }}
              />
            </div>

            {/* Profile info */}
            <div className="mt-4 flex-1 md:mt-0 md:ml-6">
              <h1 className="text-center text-3xl font-bold md:text-left">
                {user.fullName}
              </h1>
              <p className="text-center text-gray-400 md:text-left">
                @{user.fullName.toLowerCase().replace(/\s+/g, "")}
              </p>
            </div>

            {/* Edit profile button (right aligned) */}
            <div className="mt-4 md:mt-0">
              <button className="rounded-full bg-blue-600 px-6 py-2 font-medium transition hover:bg-blue-500">
                Edit Profile
              </button>
            </div>
          </div>

          {/* User stats */}
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            <div className="flex flex-col items-center rounded-xl bg-gray-800/50 p-4 text-center">
              <span className="text-lg font-bold">
                {user.productsListed?.length || 0}
              </span>
              <span className="text-sm text-gray-400">Products Listed</span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-gray-800/50 p-4 text-center">
              <span className="text-lg font-bold">
                {user.productsPurchased?.length || 0}
              </span>
              <span className="text-sm text-gray-400">Products Purchased</span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-gray-800/50 p-4 text-center">
              <span className="text-lg font-bold">
                {reservedProducts.length}
              </span>
              <span className="text-sm text-gray-400">Products Reserved</span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-gray-800/50 p-4 text-center">
              <span className="text-lg font-bold">87</span>
              <span className="text-sm text-gray-400">Collections</span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-gray-800/50 p-4 text-center">
              <span className="text-lg font-bold">{user.coins}</span>
              <span className="text-sm text-gray-400">Coins</span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-gray-800/50 p-4 text-center">
              <span className="text-lg font-bold">{user.reservedCoins}</span>
              <span className="text-sm text-gray-400">Reserved Coins</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Navigation tabs */}
      <div className="border-b border-gray-800 bg-gray-900">
        <Container>
          <div className="flex space-x-4 py-4">
            <button
              onClick={() => navigate("/profile/products")}
              className={`px-4 py-2 ${activeTab === "purchased" ? "border-b-2 border-blue-500 text-blue-400" : "text-gray-400"}`}
            >
              Recently Acquired
            </button>
            <button
              onClick={() => navigate("/profile/products?tab=listed")}
              className={`px-4 py-2 ${activeTab === "listed" ? "border-b-2 border-blue-500 text-blue-400" : "text-gray-400"}`}
            >
              Products Listed
            </button>
            <button
              onClick={() => navigate("/profile/products?tab=active")}
              className={`px-4 py-2 ${activeTab === "active" ? "border-b-2 border-blue-500 text-blue-400" : "text-gray-400"}`}
            >
              Active Bids
            </button>
          </div>
        </Container>
      </div>

      {/* Products sections */}
      <Container>
        {activeTab === "purchased" && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">Recently Acquired</h2>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="py-12 text-center text-red-500">{error}</div>
            ) : purchasedProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {purchasedProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onClick={() => handleProductClick(product._id)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-8 text-center shadow-lg">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
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
                <h3 className="mt-4 text-lg font-semibold text-white">
                  No purchased products yet
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  Products you buy will appear here
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "listed" && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">Products Listed</h2>
            {isLoading ? (
              <div className="flex justify-center py-6">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : listedProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {listedProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onClick={() => handleProductClick(product._id)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-8 text-center shadow-lg">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  No listed products
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  Start selling by listing your first product
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "active" && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">Active Bids</h2>
            {isLoading ? (
              <div className="flex justify-center py-6">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : reservedProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {reservedProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onClick={() => handleProductClick(product._id)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-8 text-center shadow-lg">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  No active bids
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  Products you are bidding on will appear here
                </p>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
