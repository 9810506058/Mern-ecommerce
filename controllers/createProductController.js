import categoryModel from "../models/CategoryModel.js";
import fs from "fs";
import slugify from "slugify";
import ProductModel from "../models/ProductModel.js";
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, } =
    req.fields;
  const { photo } = req.files;
  //alidation
  switch (true) {
    case !name:
      return res.status(500).send({ error: "Name is Required" });
    case !description:
      return res.status(500).send({ error: "Description is Required" });
    case !price:
      return res.status(500).send({ error: "Price is Required" });
    case !category:
      return res.status(500).send({ error: "Category is Required" });
    case !quantity:
      return res.status(500).send({ error: "Quantity is Required" });
    case photo && photo.size > 1000000:
      return res
        .status(500)
        .send({ error: "photo is Required and should be less then 1mb" });
  }

  const products = new ProductModel({ ...req.fields, slug: slugify(name) });
  if (photo) {
    products.photo.data = fs.readFileSync(photo.path);
    products.photo.contentType = photo.type;
  }
  await products.save();
  res.status(201).send({
    success: true,
    message: "Product Created Successfully",
    products,
  });
} catch (error) {
  console.log(error);
  res.status(500).send({
    success: false,
    error,
    message: "Error in crearing product",
  });
}
};

//get all products
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
// get single product
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

// get photo
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

//delete controllerdelete controller
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
//upate producta
export const updateProductController = async (req, res) => {
try {
  const { name, description, price, category, quantity,  } =
    req.fields;
  const { photo } = req.files;
  //alidation
  switch (true) {
    case !name:
      return res.status(500).send({ error: "Name is Required" });
    case !description:
      return res.status(500).send({ error: "Description is Required" });
    case !price:
      return res.status(500).send({ error: "Price is Required" });
    case !category:
      return res.status(500).send({ error: "Category is Required" });
    case !quantity:
      return res.status(500).send({ error: "Quantity is Required" });
    case photo && photo.size > 1000000:
      return res
        .status(500)
        .send({ error: "photo is Required and should be less then 1mb" });
  }

  const products = await productModel.findByIdAndUpdate(
    req.params.pid,
    { ...req.fields, slug: slugify(name) },
    { new: true }
  );
  if (photo) {
    products.photo.data = fs.readFileSync(photo.path);
    products.photo.contentType = photo.type;
  }
  await products.save();
  res.status(201).send({
    success: true,
    message: "Product Updated Successfully",
    products,
  });
} catch (error) {
  console.log(error);
  res.status(500).send({
    success: false,
    error,
    message: "Error in Updte product",
  });
}
};
 

//search product
// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};
// filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

//related products controller
// similar products
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(5)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};
//category wise product
export const productcategorycontroller = async (req, res) => {
  try {
    const category=await categoryModel.findOne({slug:req.params.slug});
    const products = await productModel.find({category}).populate("category");
res.status(200).send({
  
  success: true,
  category,
  products
})
}
catch (error) {
  console.log(error);
  res.status(400).send({
    success: false,
    message: "error while geting related product",
    error,
  });
}
};
