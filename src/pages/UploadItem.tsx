import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface UploadFormInputs {
  title: string;
  basePrice: number;
  description: string;
  category: string;
  condition: string;
}

function UploadItem() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<UploadFormInputs>();
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setUploadError] = useState<string | null>(null);
  const navigate = useNavigate();
  const MAX_IMAGES = 5;

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
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("basePrice", data.basePrice.toString());
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("condition", data.condition);

      files.forEach((file) => formData.append("images", file));

      const res = await axios.post("/api/products/upload", formData);
      if (res.data.success) {
        navigate("/");
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      setUploadError("Something went wrong during upload");
      console.error(err);
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
                <svg className="mb-2 h-10 w-10" /*…*/ />
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
                  <option value="fashion">Fashion</option>
                  <option value="tech">Tech</option>
                  <option value="home">Home</option>
                  <option value="collectibles">Collectibles</option>
                </select>
                {errors.category && (
                  <p className="text-sm text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>
              {/* Condition */}
              <div>
                <label className="mb-1 block text-sm text-gray-300">
                  Condition
                </label>
                <select
                  className="w-full rounded-2xl bg-gray-800 p-3"
                  {...register("condition", {
                    required: "Condition is required",
                  })}
                >
                  <option value="">Select Condition</option>
                  <option value="new">New</option>
                  <option value="used">Used</option>
                </select>
                {errors.condition && (
                  <p className="text-sm text-red-500">
                    {errors.condition.message}
                  </p>
                )}
              </div>
            </form>
          </div>

          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="mt-4 w-full rounded-2xl bg-white p-3 font-semibold text-black"
          >
            Upload Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadItem;
