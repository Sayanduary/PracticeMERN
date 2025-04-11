import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select, Modal } from "antd";
import { useAuth } from "../../context/auth";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;

const MAX_IMAGE_SIZE = 1000000; // 1MB

const UpdateProduct = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const params = useParams();

  const [productId, setProductId] = useState("");
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [originalPhoto, setOriginalPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successModal, setSuccessModal] = useState(false);
  const [updatedProductName, setUpdatedProductName] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);

  // Fetch single product
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/get-product/${params.slug}`
      );
      if (data?.success) {
        const product = data.product;
        setProductId(product._id);
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setCategory(product.category._id);
        setQuantity(product.quantity);
        setShipping(product.shipping);
        setOriginalPhoto(`${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${product._id}`);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Error fetching product");
    }
  };

  useEffect(() => {
    getSingleProduct();
    getAllCategory();
  }, []);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/category/get-category`
      );
      if (data?.success) setCategories(data?.category);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Product name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!price || price <= 0) newErrors.price = "Price must be greater than zero";
    if (!category) newErrors.category = "Category is required";
    if (quantity < 0) newErrors.quantity = "Quantity cannot be negative";
    if (photo && photo.size > MAX_IMAGE_SIZE) {
      newErrors.photo = "Image must be less than 1MB";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
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
      if (photo) productData.append("photo", photo);

      // Debug log
      console.log("Updating product with ID:", productId);
      console.log("Request URL:", `${import.meta.env.VITE_API_URL}/api/v1/product/update-product/${productId}`);

      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/product/update-product/${productId}`,
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );

      if (data?.success) {
        toast.success(`${name} updated successfully`);
        // Store just the name to avoid rendering issues
        setUpdatedProductName(name);
        setSuccessModal(true);
      } else {
        toast.error(data?.message || "Failed to update product");
      }
    } catch (err) {
      console.error("❌ Error updating product:", err);
      // Extract the error message with safety checks
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          "Error updating product. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToProducts = () => {
    navigate("/dashboard/admin/products");
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/product/delete-product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      toast.success("Product deleted successfully");
      setDeleteModal(false);
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.error("Error deleting product:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Failed to delete product";
      toast.error(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo);
    };
  }, [photo]);

  return (
    <Layout title="Dashboard - Update Product">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Update Product</h1>
            <form onSubmit={handleUpdate} className="m-1 w-75">
              {/* Category */}
              <Select
                variant="borderless"
                placeholder="Select a category"
                size="large"
                className={`form-select mb-3 ${errors.category ? "is-invalid" : ""}`}
                onChange={(value) => {
                  setCategory(value);
                  setErrors({ ...errors, category: "" });
                }}
                value={category}
                disabled={loading}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
              {errors.category && <div className="text-danger mb-2">{errors.category}</div>}

              {/* Photo */}
              <div className="mb-3">
                <label
                  htmlFor="upload-photo"
                  className={`btn btn-outline-secondary col-md-12 ${errors.photo ? "border-danger" : ""}`}
                >
                  {photo ? photo.name : "Upload New Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    id="upload-photo"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file?.size > MAX_IMAGE_SIZE) {
                        setErrors({ ...errors, photo: "Image must be less than 1MB" });
                      } else {
                        setPhoto(file);
                        setErrors({ ...errors, photo: "" });
                      }
                    }}
                    disabled={loading}
                  />
                </label>
                {photo && (
                  <button type="button" className="btn btn-sm btn-danger mt-2" onClick={() => setPhoto(null)}>
                    Remove Selected Photo
                  </button>
                )}
              </div>
              {errors.photo && <div className="text-danger mb-2">{errors.photo}</div>}

              {/* Preview */}
              <div className="mb-3 text-center">
                {photo ? (
                  <img src={URL.createObjectURL(photo)} alt="preview" height="200px" className="img img-responsive" />
                ) : originalPhoto ? (
                  <img src={originalPhoto} alt="preview" height="200px" className="img img-responsive" />
                ) : null}
              </div>

              {/* Fields */}
              <input
                type="text"
                value={name}
                placeholder="Product Name"
                className={`form-control mb-3 ${errors.name ? "is-invalid" : ""}`}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors({ ...errors, name: "" });
                }}
                disabled={loading}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}

              <textarea
                value={description}
                placeholder="Description"
                className={`form-control mb-3 ${errors.description ? "is-invalid" : ""}`}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors({ ...errors, description: "" });
                }}
                disabled={loading}
              />
              {errors.description && <div className="invalid-feedback">{errors.description}</div>}

              <input
                type="number"
                value={price}
                placeholder="Price"
                className={`form-control mb-3 ${errors.price ? "is-invalid" : ""}`}
                onChange={(e) => {
                  setPrice(e.target.value);
                  setErrors({ ...errors, price: "" });
                }}
                disabled={loading}
              />
              {errors.price && <div className="invalid-feedback">{errors.price}</div>}

              <input
                type="number"
                value={quantity}
                placeholder="Quantity"
                className={`form-control mb-3 ${errors.quantity ? "is-invalid" : ""}`}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  setErrors({ ...errors, quantity: "" });
                }}
                disabled={loading}
              />
              {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}

              <Select
                placeholder="Shipping"
                size="large"
                className="form-select mb-3"
                value={shipping ? "true" : "false"}
                onChange={(value) => setShipping(value === "true")}
                disabled={loading}
              >
                <Option value="true">Yes</Option>
                <Option value="false">No</Option>
              </Select>

              {/* Buttons */}
              <div className="d-flex gap-3">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      UPDATING...
                    </>
                  ) : (
                    "UPDATE PRODUCT"
                  )}
                </button>

                <button type="button" className="btn btn-danger" onClick={() => setDeleteModal(true)} disabled={loading || deleteLoading}>
                  {deleteLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      DELETING...
                    </>
                  ) : (
                    "DELETE PRODUCT"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        title="Product Updated Successfully"
        open={successModal}
        onCancel={() => setSuccessModal(false)}
        footer={[
          <button key="back" className="btn btn-primary" onClick={handleBackToProducts}>
            Back to Products
          </button>,
        ]}
      >
        <div className="text-center mb-4">
          <div className="text-success mb-3">
            <i className="fas fa-check-circle fa-3x"></i>
          </div>
          <h3>Success!</h3>
          <p>Product "{updatedProductName}" has been updated successfully.</p>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModal}
        title="Confirm Delete"
        onCancel={() => setDeleteModal(false)}
        onOk={handleDelete}
        okText="Yes, Delete"
        okButtonProps={{ danger: true, loading: deleteLoading }}
        confirmLoading={deleteLoading}
      >
        <p>Are you sure you want to delete this product? This action cannot be undone.</p>
      </Modal>
    </Layout>
  );
};

export default UpdateProduct;