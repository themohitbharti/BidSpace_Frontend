import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import { Input } from "../index";
import { Button } from "../index";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useAppDispatch } from "../../store/hooks";
import {
  addRecentSearch,
  searchProducts,
  clearSearchResults,
  SearchProduct,
} from "../../store/searchSlice";
import debounce from "lodash.debounce";

const SUGGESTIONS = [
  {
    id: 1,
    name: "Starry Night Jeans",
    image: "/images/products/starry-night.jpg",
  },
  {
    id: 2,
    name: "Meteor Sneakers",
    image: "/images/products/meteor-sneakers.jpg",
  },
  { id: 3, name: "Nebula Hoodie", image: "/images/products/nebula-hoodie.jpg" },
  {
    id: 4,
    name: "Galactic Backpack",
    image: "/images/products/galactic-backpack.jpg",
  },
];

// Default popular categories
const POPULAR_CATEGORIES = [
  "Cosmic Clothing",
  "Stellar Accessories",
  "Interstellar Home Decor",
];

export default function SearchBar() {
  const navigate = useNavigate(); // Add this
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use Redux for recent searches and search results
  const { recentSearches, searchResults, isLoading } = useSelector(
    (state: RootState) => state.search,
  );
  const dispatch = useAppDispatch();

  // Replace useCallback with useMemo for the debounced function
  const debouncedSearch = useMemo(
    () =>
      debounce((searchTerm: string) => {
        if (searchTerm.trim().length > 0) {
          dispatch(searchProducts(searchTerm.trim()));
        } else {
          dispatch(clearSearchResults());
        }
      }, 500),
    [dispatch], // Dependencies remain the same
  );

  // Effect to trigger search when query changes
  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  // Initial population of recent searches when component mounts
  useEffect(() => {
    const fetchRecentSearches = async () => {
      try {
        // This would be replaced with your actual API call
        const recentSearchStrings = [
          "Space Odyssey Jeans",
          "Galaxy Shorts",
          "Nebula Jeans",
          "Meteor Jeans",
        ];

        // Populate recent searches in Redux
        recentSearchStrings.forEach((search) => {
          dispatch(addRecentSearch(search));
        });
      } catch (error) {
        console.error("Error fetching recent searches:", error);
      }
    };

    // Only populate if recentSearches is empty
    if (recentSearches.length === 0) {
      fetchRecentSearches();
    }
  }, [dispatch, recentSearches.length]);

  const handleSelect = (item: string) => {
    setQuery(item);
    setOpen(false);

    // Add to recent searches in Redux when selected
    dispatch(addRecentSearch(item));

    // Trigger a search with the selected item
    dispatch(searchProducts(item));
  };

  // Add a new function to handle product click
  const handleProductClick = (product: SearchProduct) => {
    // Store search term in recent searches
    dispatch(addRecentSearch(product.title));

    // Close dropdown
    setOpen(false);

    // Navigate to product details page with product ID
    navigate(`/product-details/${product._id}`);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Search & Find */}
      <div className="flex w-full items-center overflow-hidden rounded-lg bg-gray-800">
        <Input
          placeholder="Explore the universe of auctions"
          className="flex-grow border-none bg-transparent text-black focus:ring-0"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            // give click a chance to register
            setTimeout(() => setOpen(false), 100);
          }}
        />
        <Button
          className="rounded-none bg-blue-500 px-6 text-white"
          onClick={() => {
            if (query.trim()) {
              dispatch(addRecentSearch(query.trim()));
              dispatch(searchProducts(query.trim()));
            }
          }}
        >
          <span className="sr-only">Search</span>
          🔍
        </Button>
      </div>

      {/* Enhanced pop-up suggestions */}
      {open && (
        <div className="absolute top-full left-0 z-10 mt-1 w-full overflow-hidden rounded-lg bg-gray-900 p-4 text-white shadow-lg">
          {/* Add filters INSIDE popup, at the top */}
          <div className="mb-4 flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="border-gray-600 text-white transition-colors hover:border-blue-400 hover:bg-blue-500"
            >
              Live
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 text-white transition-colors hover:border-blue-400 hover:bg-blue-500"
            >
              Sold
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 text-white transition-colors hover:border-blue-400 hover:bg-blue-500"
            >
              Unsold
            </Button>
          </div>
          {isLoading ? (
            // Show loading indicator
            <div className="flex justify-center py-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-blue-600"></div>
            </div>
          ) : query.length > 0 && searchResults.length > 0 ? (
            // Show API search results when there are matches
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-400">
                Search Results
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {searchResults.map((product: SearchProduct) => (
                  <div
                    key={product._id}
                    className="cursor-pointer rounded-lg bg-gray-800 p-3 hover:bg-gray-700"
                    onClick={() => handleProductClick(product)} // Update to use new handler
                  >
                    <div className="flex items-center gap-3">
                      {product.coverImages &&
                        product.coverImages.length > 0 && (
                          <div className="h-12 w-12 overflow-hidden rounded-md">
                            <div
                              className="h-full w-full bg-gray-700"
                              style={{
                                backgroundImage: `url(${product.coverImages[0]})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            />
                          </div>
                        )}
                      <div>
                        <p className="text-sm font-medium">{product.title}</p>
                        <p className="text-xs text-gray-400">
                          ${product.basePrice}
                        </p>
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                            product.status === "live"
                              ? "bg-green-600/80"
                              : product.status === "sold"
                                ? "bg-red-600/80"
                                : "bg-yellow-600/80"
                          }`}
                        >
                          {product.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : query.length > 0 ? (
            // No results found message
            <div className="py-4 text-center text-gray-400">
              No results found for "{query}"
            </div>
          ) : (
            // Default view - show recommendations when search bar is just clicked
            <div className="space-y-6">
              {/* Recent Searches as TEXT blocks */}
              {recentSearches.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-400">
                    Recent Searches
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {recentSearches.map((search, idx) => (
                      <div
                        key={idx}
                        className="cursor-pointer rounded-lg bg-gray-800 p-3 hover:bg-gray-700"
                        onClick={() => handleSelect(search)}
                      >
                        <p className="text-sm font-medium">{search}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Show placeholder if no recent searches
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-400">
                    Recent Searches
                  </h3>
                  <p className="text-sm text-gray-500">No recent searches</p>
                </div>
              )}

              {/* Space Recommended for you */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400">
                  Space Recommended for you
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {SUGGESTIONS.map((item) => (
                    <div
                      key={item.id}
                      className="cursor-pointer overflow-hidden rounded-lg"
                      onClick={() => handleSelect(item.name)}
                    >
                      <div className="aspect-square w-full overflow-hidden">
                        <div
                          className="h-full w-full bg-gray-800"
                          style={{
                            backgroundImage: `url(${item.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                      </div>
                      <p className="mt-1 text-center text-xs">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Celestial Tags */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400">
                  Celestial Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_CATEGORIES.map((category, i) => (
                    <span
                      key={i}
                      onClick={() => handleSelect(category)}
                      className="cursor-pointer rounded-full bg-gray-800 px-3 py-1 text-sm hover:bg-gray-700"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
