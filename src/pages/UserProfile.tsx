import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Container } from "../components/index";
import {
  FaEnvelope,
  FaUser,
  FaClock,
  FaStar,
  FaShoppingBag,
} from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";

export default function UserProfile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reservedProducts, setReservedProducts] = useState<number>(0);
  const [joinDate, setJoinDate] = useState<string>("");

  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // Fetch user's data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch reserved products
        const reservedResponse = await axiosInstance.get("/product/waiting");
        if (reservedResponse.data.success) {
          setReservedProducts(reservedResponse.data.data.length);
        }

        // Format join date
        if (user.createdAt) {
          const date = new Date(user.createdAt);
          setJoinDate(
            date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          );
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

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
              <span className="text-lg font-bold">{reservedProducts}</span>
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

      {/* Main profile information section */}
      <Container>
        <div className="py-12">
          <h2 className="mb-8 text-2xl font-bold">User Information</h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-500">{error}</div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {/* User details card */}
              <div className="rounded-xl bg-gray-800/50 p-6 backdrop-blur">
                <h3 className="mb-4 border-b border-gray-700 pb-2 text-xl font-medium">
                  Account Details
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                      <FaUser className="text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-400">Full Name</p>
                      <p className="font-medium">{user.fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20">
                      <FaEnvelope className="text-purple-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                      <FaClock className="text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-400">Joined On</p>
                      <p className="font-medium">{joinDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity stats card */}
              <div className="rounded-xl bg-gray-800/50 p-6 backdrop-blur">
                <h3 className="mb-4 border-b border-gray-700 pb-2 text-xl font-medium">
                  Activity
                </h3>

                <div className="space-y-6">
                  {/* Products listed */}
                  <div className="relative overflow-hidden rounded-lg bg-gray-900/50 p-4">
                    <div className="absolute -top-3 -right-3 h-16 w-16 rounded-full bg-blue-500/10"></div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Products Listed</p>
                        <p className="text-2xl font-bold">
                          {user.productsListed?.length || 0}
                        </p>
                      </div>
                      <div className="rounded-full bg-blue-500/20 p-3">
                        <FaShoppingBag className="text-xl text-blue-400" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <button
                        onClick={() => navigate("/profile/products?tab=listed")}
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        View all listings →
                      </button>
                    </div>
                  </div>

                  {/* Products purchased */}
                  <div className="relative overflow-hidden rounded-lg bg-gray-900/50 p-4">
                    <div className="absolute -top-3 -right-3 h-16 w-16 rounded-full bg-green-500/10"></div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">
                          Products Purchased
                        </p>
                        <p className="text-2xl font-bold">
                          {user.productsPurchased?.length || 0}
                        </p>
                      </div>
                      <div className="rounded-full bg-green-500/20 p-3">
                        <FaStar className="text-xl text-green-400" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <button
                        onClick={() => navigate("/profile/products")}
                        className="text-sm text-green-400 hover:text-green-300"
                      >
                        View purchased items →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wallet card */}
              <div className="overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 md:col-span-2">
                <div className="p-6">
                  <h3 className="mb-4 text-xl font-medium">Your Wallet</h3>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="overflow-hidden rounded-xl bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-6">
                      <p className="text-sm text-gray-300">Available Coins</p>
                      <p className="mt-2 text-3xl font-bold">{user.coins}</p>
                      <div className="mt-4">
                        <button className="rounded bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500">
                          Buy More Coins
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-xl bg-gray-800 p-6">
                      <div>
                        <p className="text-sm text-gray-300">Reserved Coins</p>
                        <p className="mt-2 text-3xl font-bold">
                          {user.reservedCoins}
                        </p>
                      </div>
                      <p className="mt-4 text-xs text-gray-400">
                        Reserved coins are allocated to ongoing auctions and
                        cannot be used for new bids.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 bg-gray-900/50 p-4">
                  <p className="text-center text-sm text-gray-400">
                    Need help with your transactions?{" "}
                    <a href="#" className="text-blue-400 hover:text-blue-300">
                      Contact Support
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
