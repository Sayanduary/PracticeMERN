import React, { useState } from "react";
import { useSearch } from "../../context/Search";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const [values, setValues, fetchResults, loading, contextError] = useSearch();
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    
    if (!values.keyword || values.keyword.trim() === "") {
      setLocalError("Please enter something to search");
      return;
    }
    
    try {
      await fetchResults(values.keyword);
      navigate("/search");
    } catch (error) {
      console.error("Search submission error:", error);
      setLocalError("An error occurred while searching");
    }
  };

  return (
    <div>
      <form className="d-flex" role="search" onSubmit={handleSubmit}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={values.keyword}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              keyword: e.target.value,
            }))
          }
        />
        <button
          className="btn btn-outline-success"
          type="submit"
          disabled={!values.keyword || values.keyword.trim() === "" || loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {(localError || contextError) && (
        <div className="text-danger mt-2">{localError || contextError}</div>
      )}
    </div>
  );
};

export default SearchInput;