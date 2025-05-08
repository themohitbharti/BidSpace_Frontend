import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";
import axios from "axios";
import { addProductWithAuction } from "../store/productSlice";

interface UploadFormInputs {
  title: string;
  basePrice: number;
  description: string;
  category: string;
  auctionDuration: number; // Changed from condition to auctionDuration
}

// Define allowed auction durations (in hours)
const AUCTION_DURATIONS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24, 48, 72, 96, 120, 144, 168,
];

// Add this near the top of your file with your other constants
// Use the same categories as in your Categories.tsx file for consistency
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

function UploadItem() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue,
  } = useForm<UploadFormInputs>({
    defaultValues: {
      auctionDuration: 24, // Default to 24 hours
    },
  });
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sliderValue, setSliderValue] = useState(AUCTION_DURATIONS.indexOf(24)); // Set initial index
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const MAX_IMAGES = 5;

  // Watch the auction duration value for display
  const auctionDuration = watch("auctionDuration");

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value);
    setSliderValue(idx);
    setValue("auctionDuration", AUCTION_DURATIONS[idx], {
      shouldValidate: true,
    });
  };

  useEffect(() => {
    if (files.length > 0) {
      const urls = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(urls);
      return () => urls.forEach(URL.revokeObjectURL);
    } else {
      setImagePreviews([]);
    }
  }, [files]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected) {
      // Only add new files if under the limit
      if (files.length + selected.length <= MAX_IMAGES) {
        setFiles((prev) => [...prev, ...Array.from(selected)]);
      } else {
        // Show error when trying to exceed limit
        setUploadError(`Maximum ${MAX_IMAGES} images allowed`);
        // Clear error after 3 seconds
        setTimeout(() => setUploadError(null), 3000);
      }
    }
  };

  const removeImage = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<UploadFormInputs> = async (data) => {
    if (files.length === 0) {
      setError("title", {
        type: "manual",
        message: "At least one image required",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("basePrice", data.basePrice.toString());
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("endTime", data.auctionDuration.toString());
      // Append each image to formData with the key "coverImages"
      files.forEach((file) => formData.append("coverImages", file));

      // Use axiosInstance instead of axios directly
      const response = await axiosInstance.post("/product/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const res = response.data;

      if (res.success) {
        // Success! Update the redux store with new product and auction
        dispatch(addProductWithAuction(res.data));

        // Show success message
        toast.success("Product listed and auction started successfully");

        // Navigate to product details
        navigate("/product-details");
      } else {
        throw new Error(res.message || "Upload failed");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setUploadError(err.response?.data?.message || "Upload failed");
      } else if (err instanceof Error) {
        setUploadError(err.message);
      } else {
        setUploadError("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to format duration display
  const formatDuration = (hours: number) => {
    if (hours < 24) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days} day${days > 1 ? "s" : ""}${remainingHours > 0 ? ` ${remainingHours} hour${remainingHours > 1 ? "s" : ""}` : ""}`;
    }
  };

  // Helper function to get formatted labels for specific positions
  const getDurationLabel = (index: number) => {
    const hours = AUCTION_DURATIONS[index];
    if (hours < 24) {
      return `${hours}h`;
    } else {
      return `${hours / 24}d`;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden text-white">
      <div className="grid w-full grid-cols-1 md:grid-cols-2">
        {/* Left Column - Upload Image Section */}
        <div className="m-4 flex h-[calc(100vh-5rem)] flex-col justify-start">
          <h2 className="mt-6 mb-4 text-2xl font-bold">Add Images</h2>

          {/* Upload Image Box */}
          <div className="mb-3 flex h-112 w-[90%] flex-col items-center justify-center rounded-xl border border-gray-700 bg-black p-5">
            {files.length >= MAX_IMAGES ? (
              /* Disabled upload state - completely different element when limit reached */
              <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-800 bg-gray-900 text-gray-500 opacity-50">
                <span className="text-lg">Upload Limit Reached</span>
                <p className="mt-1 text-sm">
                  Maximum {MAX_IMAGES} images allowed
                </p>
                <p className="mt-2 text-xs">Remove an image to upload more</p>
              </div>
            ) : (
              /* Normal upload state - only shown when under limit */
              <label
                htmlFor="imageUpload"
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-600 text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mb-2 h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-lg">Upload Images</span>
                <span className="mt-1 text-sm text-gray-400">
                  or drag & drop
                </span>
                <input
                  type="file"
                  id="imageUpload"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={onFileChange}
                />
              </label>
            )}
          </div>

          {/* Image Previews with delete buttons */}
          <div className="mb-4 flex flex-wrap gap-2">
            {imagePreviews.map((src, idx) => (
              <div
                key={idx}
                className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-700"
              >
                <img
                  src={src}
                  alt={`Preview ${idx}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Show current image count */}
          <div className="mb-2 text-sm text-gray-400">
            {files.length} of {MAX_IMAGES} images uploaded
          </div>

          {/* Display errors */}
          {(errors.title?.type === "manual" || error) && (
            <p className="mt-1 text-red-500">
              {errors.title?.message || error}
            </p>
          )}
        </div>

        {/* Form Fields */}
        <div className="m-4 ml-0 flex h-[calc(100vh-6rem)] flex-col justify-between rounded-xl bg-black p-5">
          <div className="overflow-auto">
            <h2 className="mt-6 mb-4 text-2xl font-bold">List Your Item</h2>
            {error && <p className="mb-4 text-red-500">{error}</p>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Title */}
              <div>
                <label className="mb-1 block text-sm text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full rounded-2xl bg-gray-800 p-3"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              {/* Base Price */}
              <div>
                <label className="mb-1 block text-sm text-gray-300">
                  Base Price
                </label>
                <input
                  type="number"
                  placeholder="Base Price"
                  className="w-full rounded-2xl bg-gray-800 p-3"
                  {...register("basePrice", {
                    required: "Base price is required",
                    valueAsNumber: true,
                  })}
                />
                {errors.basePrice && (
                  <p className="text-sm text-red-500">
                    {errors.basePrice.message}
                  </p>
                )}
              </div>
              {/* Description */}
              <div>
                <label className="mb-1 block text-sm text-gray-300">
                  Description
                </label>
                <textarea
                  placeholder="Description"
                  className="w-full resize-none rounded-2xl bg-gray-800 p-3"
                  rows={4}
                  {...register("description", {
                    required: "Description is required",
                  })}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
              {/* Category */}
              <div>
                <label className="mb-1 block text-sm text-gray-300">
                  Category
                </label>
                <select
                  className="w-full rounded-2xl bg-gray-800 p-3"
                  {...register("category", {
                    required: "Category is required",
                  })}
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category.toLowerCase()}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-sm text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>
              {/* Enhanced Auction Duration Slider */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="block text-sm text-gray-300">
                    Auction Duration
                  </label>
                  <span className="text-sm font-medium text-white">
                    {formatDuration(auctionDuration)}
                  </span>
                </div>

                {/* Custom styled slider */}
                <div className="relative py-4">
                  <input
                    type="range"
                    min="0"
                    max={AUCTION_DURATIONS.length - 1}
                    step="1"
                    value={sliderValue}
                    onChange={handleSliderChange}
                    className="range-input-no-thumb absolute z-10 h-8 w-full cursor-pointer appearance-none bg-transparent outline-none"
                    style={{
                      // These style overrides help with the custom appearance
                      WebkitAppearance: "none",
                      margin: 0,
                    }}
                  />

                  {/* Track background */}
                  <div className="absolute top-[18px] h-4 w-full rounded-full bg-gray-700"></div>

                  {/* Filled track */}
                  <div
                    className="absolute top-[18px] h-4 rounded-full bg-blue-500"
                    style={{
                      width: `${(sliderValue / (AUCTION_DURATIONS.length - 1)) * 100}%`,
                      transition: "width 0.1s ease-in-out",
                    }}
                  ></div>

                  {/* Thumb indicator */}
                  <div
                    className="absolute top-[14px] h-6 w-6 rounded-full border-2 border-white bg-blue-600 shadow-md"
                    style={{
                      left: `calc(${(sliderValue / (AUCTION_DURATIONS.length - 1)) * 100}% - 12px)`,
                      transition: "left 0.1s ease-in-out",
                    }}
                  ></div>
                </div>

                {/* Duration marks */}
                <div className="mt-6 flex justify-between text-xs text-gray-400">
                  <span>{getDurationLabel(0)}</span>
                  <span>{getDurationLabel(6)}</span>
                  <span>{getDurationLabel(12)}</span>
                  <span>{getDurationLabel(AUCTION_DURATIONS.length - 1)}</span>
                </div>

                {errors.auctionDuration && (
                  <p className="text-sm text-red-500">
                    {errors.auctionDuration.message}
                  </p>
                )}
              </div>
            </form>
          </div>

          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className={`mt-4 w-full rounded-2xl p-3 font-semibold ${
              isSubmitting
                ? "cursor-not-allowed bg-gray-400 text-gray-700"
                : "bg-white text-black hover:bg-blue-100"
            }`}
          >
            {isSubmitting ? "Uploading..." : "Upload Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadItem;
