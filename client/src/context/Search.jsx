import { useState, useContext, createContext } from "react";
import axios from "axios";

const SearchContext = createContext();

// Configure axios with default settings
axios.defaults.headers.common["Accept"] = "application/json";

const SearchProvider = ({ children }) => {
  const [searchValues, setSearchValues] = useState({
    keyword: "",
    results: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch results from the API
  const fetchResults = async (keyword) => {
    if (!keyword || keyword.trim() === "") return [];

    setLoading(true);
    setError(null);

    console.log("Searching for:", keyword);

    try {
      // Try with the correct API path
      const endpoint = `${
        import.meta.env.VITE_API_URL
      }/api/v1/product/search/${keyword}`;
      console.log("Calling API endpoint:", endpoint);

      const { data } = await axios.get(endpoint);

      console.log("Search response data type:", typeof data);
      console.log("Search response data:", data);

      if (data && data.success && Array.isArray(data.products)) {
        setSearchValues({
          keyword,
          results: data.products,
        });
        return data.products;
      } else {
        console.warn("API returned unexpected data structure");
        setSearchValues((prev) => ({
          ...prev,
          keyword,
          results: [],
        }));
        setError("No products found or invalid response format");
        return [];
      }
    } catch (error) {
      console.error("Search error:", error);

      if (
        typeof error.response?.data === "string" &&
        error.response.data.includes("<!doctype html>")
      ) {
        console.error(
          "Received HTML instead of JSON. Backend server may not be running or proxy is misconfigured."
        );
        setError(
          "Backend connection issue. Please check server or proxy configuration."
        );
      } else {
        setError(error.message || "Failed to search products");
      }

      setSearchValues((prev) => ({
        ...prev,
        keyword,
        results: [],
      }));
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchContext.Provider
      value={[searchValues, setSearchValues, fetchResults, loading, error]}
    >
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook for easier context usage
const useSearch = () => useContext(SearchContext);

export { useSearch, SearchProvider };
