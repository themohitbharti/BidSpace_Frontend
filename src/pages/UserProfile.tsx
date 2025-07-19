import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container } from "../components/index";
import {
  FaEnvelope,
  FaUser,
  FaClock,
  FaStar,
  FaShoppingBag,
  FaLock,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaKey,
} from "react-icons/fa";
import { updateUserProfile, changeUserPassword } from "../api/userApi";
import { getReservedProducts } from "../api/productApi";
import { updateUser } from "../store/authSlice";
import axios from "axios";

// Import the updateUser action if you have one for Redux state updates

export default function UserProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reservedProducts, setReservedProducts] = useState<number>(0);
  const [joinDate, setJoinDate] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isChangePasswordMode, setIsChangePasswordMode] =
    useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName,
      }));
    }
  }, [user]);

  // Fetch user's data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch reserved products using the API function
        const reservedResponse = await getReservedProducts();
        if (reservedResponse.success) {
          setReservedProducts(reservedResponse.data.length);
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

  useEffect(() => {
    if (searchParams.get("edit") === "1") {
      setIsEditMode(true);
    }
  }, [searchParams]);

  if (!user) {
    return (
      <div className="py-20 text-center text-white">
        Loading user profile...
      </div>
    );
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    // Reset form data when opening modal or canceling
    setFormData({
      fullName: user.fullName,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    // Reset password mode when closing modal
    if (isEditMode) {
      setIsChangePasswordMode(false);
    }

    setIsEditMode(!isEditMode);
  };

  // Toggle password change mode
  const togglePasswordMode = () => {
    setIsChangePasswordMode(!isChangePasswordMode);

    // Clear password fields when toggling
    if (!isChangePasswordMode) {
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (formData.fullName.trim() === "") {
      toast.error("Full name cannot be empty");
      return;
    }

    try {
      setIsSaving(true);

      if (isChangePasswordMode) {
        // Password change validation
        if (!formData.currentPassword) {
          toast.error("Current password is required");
          return;
        }

        if (formData.newPassword.length < 6) {
          toast.error("New password must be at least 8 characters");
          return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
          toast.error("New passwords don't match");
          return;
        }

        // Call password change API
        const passwordResponse = await changeUserPassword({
          oldPassword: formData.currentPassword, // Note the property name difference
          newPassword: formData.newPassword,
        });

        if (passwordResponse.success) {
          toast.success("Password changed successfully");

          // Exit password mode and modal
          setIsChangePasswordMode(false);
          setIsEditMode(false);
        } else {
          toast.error(passwordResponse.message || "Failed to change password");
        }
      } else {
        // Call profile update API
        const profileResponse = await updateUserProfile({
          fullName: formData.fullName,
        });

        if (profileResponse.success) {
          toast.success("Profile updated successfully");

          dispatch(updateUser(profileResponse.data));
          setIsEditMode(false);
        } else {
          toast.error(profileResponse.message || "Failed to update profile");
        }
      }
    } catch (err: unknown) {
      console.error("Error updating profile:", err);

      // Use proper type guard to check if it's an AxiosError
      if (axios.isAxiosError(err)) {
        // This is an Axios error with a response
        toast.error(err.response?.data?.message || "Failed to update profile");
      } else if (err instanceof Error) {
        // This is a standard JavaScript Error
        toast.error(err.message || "Failed to update profile");
      } else {
        // This is some other type of error
        toast.error("Failed to update profile");
      }
    } finally {
      setIsSaving(false);
    }
  };

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
              <button
                onClick={toggleEditMode}
                className="rounded-full bg-blue-600 px-6 py-2 font-medium transition hover:bg-blue-500"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* User stats section remains the same */}
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
                <div className="mb-4 flex items-center justify-between border-b border-gray-700 pb-2">
                  <h3 className="text-xl font-medium">Account Details</h3>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                      <FaUser className="text-blue-400" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm text-gray-400">Full Name</p>
                      <p className="font-medium">{user.fullName}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20">
                      <FaEnvelope className="text-purple-400" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  {/* Joined date */}
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

              {/* Rest of the components remain the same */}
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

      {/* Edit Profile Modal */}
      {isEditMode && (
        <>
          {/* Backdrop with blur effect - reduced blur */}
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-[1px] transition-opacity"
            onClick={toggleEditMode}
          ></div>

          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 z-50 w-11/12 max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-xl bg-gray-800 shadow-2xl transition-all md:max-w-lg">
            {/* Modal header */}
            <div className="border-b border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  {isChangePasswordMode ? "Change Password" : "Edit Profile"}
                </h3>
                <button
                  onClick={toggleEditMode}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isChangePasswordMode ? (
                  <>
                    {/* Profile editing section */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <FaUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 pl-10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">
                        Email
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={user.email}
                          className="block w-full cursor-not-allowed rounded-lg border border-gray-600 bg-gray-700 p-2.5 pl-10 text-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          disabled
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-400">
                        Email cannot be changed
                      </p>
                    </div>

                    {/* Password change button */}
                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={togglePasswordMode}
                        className="flex w-full items-center justify-center rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <FaKey className="mr-2" />
                        Change Password
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Password change section */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <FaLock className="text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 pr-10 pl-10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter current password"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <FaLock className="text-gray-400" />
                        </div>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 pr-10 pl-10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter new password"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-400">
                        Password must be at least 8 characters long
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <FaLock className="text-gray-400" />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 pr-10 pl-10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Confirm new password"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    {/* Back to profile editing */}
                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={togglePasswordMode}
                        className="flex w-full items-center justify-center rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <FaUser className="mr-2" />
                        Back to Profile Editing
                      </button>
                    </div>
                  </>
                )}

                {/* Action buttons */}
                <div className="mt-6 flex space-x-3 border-t border-gray-700 pt-4">
                  <button
                    type="button"
                    onClick={toggleEditMode}
                    className="flex-1 rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-blue-600/50"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
