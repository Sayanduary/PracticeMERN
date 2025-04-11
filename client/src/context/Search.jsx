import { useState,  useContext, createContext } from "react";



const SearchContext = createContext();

const SearchProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    keyword :"",
    results :[],
  });








 // ✅ Dependency array ensures it runs only once

  return (
    <SearchContext.Provider value={[auth, setAuth]}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook
const useSearch = () => useContext(SearchContext);

// eslint-disable-next-line react-refresh/only-export-components
export { useSearch, SearchProvider };
