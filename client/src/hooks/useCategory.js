import { useState, useEffect } from "react";
import axios from "axios";

export default function useCategory() {
    const [categories, setCategories] = useState([]);

    const getCategories = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/category/get-category`);
            setCategories(data?.category || []);
        } catch (error) {
            console.log("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    return categories;
}
