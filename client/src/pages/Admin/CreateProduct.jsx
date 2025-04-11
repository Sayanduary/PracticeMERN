import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = "Product name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!price) newErrors.price = "Price is required";
    if (!category) newErrors.category = "Category is required";
    if (!quantity) newErrors.quantity = "Quantity is required";
    if (!photo) newErrors.photo = "Product image is required";
    
    // Validate photo size (must be less than 1MB)
    if (photo && photo.size > 1000000) {
      newErrors.photo = "Image must be less than 1MB";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create product handler
  const handleCreate = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }
    
    setLoading(true);
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("shipping", shipping);
      productData.append("photo", photo);
  
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/product/create-product`,
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      
      if (data?.success) {
        toast.success(`${name} created successfully`);
        // Reset form
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setQuantity("");
        setShipping(false);
        setPhoto(null);
        // Navigate to products page
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Failed to create product");
      }
    } catch (err) {
      console.error("❌ Error creating product:", err);
      toast.error(err.response?.data?.error || "Error creating product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Dashboard - Create Product">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Create Product</h1>
            <div className="m-1 w-75">
              {/* Category Select */}
              <Select
                variant="borderless"
                placeholder="Select a category"
                size="large"
                showSearch
                className={`form-select mb-3 ${errors.category ? "is-invalid" : ""}`}
                onChange={(value) => {
                  setCategory(value);
                  setErrors({...errors, category: ""});
                }}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
              {errors.category && <div className="text-danger mb-2">{errors.category}</div>}
              
              {/* Photo Upload */}
              <div className="mb-3">
                <label
                  htmlFor="upload-photo"
                  className={`btn btn-outline-secondary col-md-12 ${errors.photo ? "border-danger" : ""}`}
                >
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    id="upload-photo"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.size > 1000000) {
                        setErrors({...errors, photo: "Image must be less than 1MB"});
                      } else {
                        setPhoto(file);
                        setErrors({...errors, photo: ""});
                      }
                    }}
                    hidden
                  />
                </label>
              </div>
              {errors.photo && <div className="text-danger mb-2">{errors.photo}</div>}
              
              {/* Show photo preview */}
              {photo && !errors.photo && (
                <div className="mb-3 text-center">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="product_preview"
                    height="200px"
                    className="img img-responsive"
                  />
                </div>
              )}
              
              {/* Name */}
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="Enter product name"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors({...errors, name: ""});
                  }}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
              
              {/* Description */}
              <div className="mb-3">
                <textarea
                  value={description}
                  placeholder="Enter product description"
                  className={`form-control ${errors.description ? "is-invalid" : ""}`}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setErrors({...errors, description: ""});
                  }}
                />
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
              </div>
              
              {/* Price */}
              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="Enter product price"
                  className={`form-control ${errors.price ? "is-invalid" : ""}`}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    setErrors({...errors, price: ""});
                  }}
                />
                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
              </div>
              
              {/* Quantity */}
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="Enter product quantity"
                  className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    setErrors({...errors, quantity: ""});
                  }}
                />
                {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
              </div>
              
              {/* Shipping */}
              <Select
                variant="borderless"
                placeholder="Shipping"
                size="large"
                className="form-select mb-3"
                value={shipping.toString()}
                onChange={(value) => setShipping(value === "true")}
              >
                <Option value="true">Yes</Option>
                <Option value="false">No</Option>
              </Select>
              
              {/* Submit Button */}
              <div className="mb-3">
                <button 
                  className="btn btn-primary" 
                  onClick={handleCreate}
                  disabled={loading}
                >
                  {loading ? "CREATING..." : "CREATE PRODUCT"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;