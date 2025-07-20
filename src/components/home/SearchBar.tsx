import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  CATEGORIES,
  CATEGORY_IMAGES,
  defaultImage,
} from "../../constants/categories";

const CATEGORY_SUGGESTIONS = CATEGORIES.slice(0, 4);

export default function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use Redux for recent searches and search results
  const { recentSearches, searchResults, isLoading } = useSelector(
    (state: RootState) => state.search,
  );
  const dispatch = useAppDispatch();

  // Utility: Save to localStorage
  const saveRecentSearches = (searches: string[]) => {
    localStorage.setItem("recentSearches", JSON.stringify(searches));
  };

  // Utility: Load from localStorage
  const loadRecentSearches = (): string[] => {
    const data = localStorage.getItem("recentSearches");
    return data ? JSON.parse(data) : [];
  };

  // On mount, load recent searches from localStorage
  useEffect(() => {
    if (recentSearches.length === 0) {
      const searches = loadRecentSearches();
      searches.forEach((search) => {
        dispatch(addRecentSearch(search));
      });
    }
  }, [dispatch, recentSearches.length]);

  // When recentSearches changes, update localStorage
  useEffect(() => {
    if (recentSearches.length > 0) {
      saveRecentSearches(recentSearches);
    }
  }, [recentSearches]);

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
          autoComplete="off"
          style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        />
        <Button
          className="flex items-center justify-center rounded-none bg-blue-500 px-6 text-white"
          onClick={() => {
            if (query.trim()) {
              dispatch(addRecentSearch(query.trim()));
              dispatch(searchProducts(query.trim()));
            }
          }}
        >
          <span className="sr-only">Search</span>
          {/* Thicker, professional white magnifying glass SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
            strokeWidth={2.5}
            className="h-6 w-6"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2.5" />
            <line
              x1="16.5"
              y1="16.5"
              x2="21"
              y2="21"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </Button>
      </div>

      {/* Overlay for shadow effect */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 transition-opacity duration-200"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Enhanced pop-up suggestions */}
      {open && (
        <div className="absolute top-full left-0 z-40 mt-1 w-full overflow-hidden rounded-lg bg-gray-900 p-4 text-white shadow-lg">
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
            <div className="space-y-6">
              {/* Show only if there are recent searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-400">
                    Recent Searches
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {recentSearches
                      .slice(-4) // Only last 4
                      .reverse() // Most recent first
                      .map((search, idx) => (
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
              )}

              {/* Space Recommended for you */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400">
                  Space Recommended for you
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {CATEGORY_SUGGESTIONS.map((category) => (
                    <div
                      key={category}
                      className="cursor-pointer overflow-hidden rounded-lg"
                      onClick={() => {
                        setOpen(false);
                        navigate(
                          `/discover?category=${encodeURIComponent(category)}`,
                        );
                      }}
                    >
                      <div className="aspect-square w-full overflow-hidden">
                        <img
                          src={CATEGORY_IMAGES[category] || defaultImage}
                          alt={category}
                          className="h-full w-full bg-gray-800 object-cover"
                        />
                      </div>
                      <p className="mt-1 text-center text-xs">{category}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Celestial Tags */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400">
                  Celestial Tags
                </h3>
                <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
                  {CATEGORIES.map((category, i) => (
                    <span
                      key={i}
                      onClick={() => {
                        setOpen(false);
                        navigate(
                          `/discover?category=${encodeURIComponent(category)}`,
                        );
                      }}
                      className="cursor-pointer rounded-full bg-gray-800 px-3 py-1 text-sm whitespace-nowrap transition hover:bg-blue-700"
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
