
import productModel from '../models/product.model.js';
import categoryModel from '../models/category.model.js';
import fs from "fs";
import slugify from "slugify";





export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    // Basic validation
    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).send({ error: "All fields are required" });
    }
    if (photo && photo.size > 1000000) {
      return res.status(400).send({ error: "Image must be less than 1MB" });
    }

    const product = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.status(201).send({ success: true, message: "Product Created", product });
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).send({ success: false, error: error.message });
  }
};



export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "ALlProducts ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};


export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};


export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};


export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};


export const updateProductController = async (req, res) => {
  try {
    // Add this debug line
    console.log("Update request received:", { body: req.fields, files: req.files, params: req.params });

    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files || {};

    // Validation
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is Required" });
      case !description:
        return res.status(400).send({ error: "Description is Required" });
      case !price:
        return res.status(400).send({ error: "Price is Required" });
      case !category:
        return res.status(400).send({ error: "Category is Required" });
      case !quantity:
        return res.status(400).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(400)
          .send({ error: "Photo should be less than 1mb" });
    }

    try {
      const product = await productModel.findByIdAndUpdate(
        req.params.pid,
        { ...req.fields, slug: slugify(name) },
        { new: true }
      );

      if (!product) {
        return res.status(404).send({
          success: false,
          error: "Product not found"
        });
      }

      if (photo) {
        product.photo.data = fs.readFileSync(photo.path);
        product.photo.contentType = photo.type;
        await product.save();
      }

      res.status(200).send({
        success: true,
        message: "Product Updated Successfully",
        product // Changed from products to product
      });
    } catch (dbError) {
      console.log("Database error:", dbError);
      return res.status(500).send({
        success: false,
        error: dbError.message,
        message: "Error updating product in database",
      });
    }
  } catch (error) {
    console.log("General error:", error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in Update product",
    });
  }
};

// Filter products by category
export const productFilterController = async (req, res) => {


  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }
    const products = await productModel.find(args)
    res.status(200).send({
      success: true,
      products,
    })


  } catch (error) {
    console.error("Product filter error:", error);
    res.status(500).send({
      success: false,
      message: "Error while filtering products",
      error,
    });
  }
};

export const productCountController = async (req, res) => {
  try {

    const total = await productModel.find({}).estimatedDocumentCount()
    res.status(200).send({
      success: true,
      total,
    })

  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: 'Error in Product Count',
      error,
      success: false,
    })
  }
}


export const productListController = async (req, res) => {
  try {

    const perPage = 6
    const page = req.params.page ? req.params.page : 1
    const products = await productModel.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 })

    res.status(200).send({
      success: true,
      products,
    })

  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: 'Error in Per Page CTRL'
    })
  }
};

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    console.log("Search request received with keyword:", keyword);
    
    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search keyword is required"
      });
    }

    // Use a more lenient search pattern
    const searchPattern = keyword.trim();
    console.log("Searching with pattern:", searchPattern);
    
    const result = await productModel.find({
      $or: [
        { name: { $regex: searchPattern, $options: "i" } },
        { description: { $regex: searchPattern, $options: "i" } }
      ]
    }).select("-photo");

    console.log(`Found ${result.length} products matching "${keyword}"`);
    
    return res.status(200).json({
      success: true,
      products: result
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      success: false,
      message: "Error searching products",
      error: error.message
    });
  }
};


export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;

    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid }, // exclude current product
      })
      .select("-photo")
      .limit(10)
      .populate("category");

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in getting related products",
      error,
    });
  }
};

export const productCategoryController = async (req, res) => {
  try {
    const category =await categoryModel.findOne({
      slug:req.params.slug
    })
    const products =await productModel.find({category}).populate('category')
    res.status(200).send({
      success: true,
      category,
      products

    });

    


  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error while getting product",
     
    });
  }
};