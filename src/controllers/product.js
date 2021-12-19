/** @format */

const Product = require("../models/product");
const slugify = require("slugify");
const Category = require("../models/category");

// function createProducts(products, parentId = null) {
//   const productList = [];
//   let product;
//   if (parentId == null) {
//     product = products.filter((cat) => cat.parentId == undefined);
//   } else {
//     product = products.filter((cat) => cat.parentId == parentId);
//   }

//   for (let prod of product) {
//     productList.push({
//       _id: prod._id,
//       name: prod.name,
//       slug: prod.slug,
//       parentId: prod.parentId,
//       price: prod.price,
//       productPictures: prod.productPictures,
//       quantity: prod.quantity,
//       category: prod.category,
//       children: createProducts(products, prod._id),
//     });
//   }
//   return productList;
// }

exports.uploadImages = (req, res) => {
  const arr = [];
  req.files.map((img) => {
    arr.push(img.filename);
  });

  return res.status(200).json({ arr });
};

exports.createProduct = (req, res) => {
  const {
    name,
    price,
    description,
    color,
    skuCode,
    S_size,
    M_size,
    X_size,
    XL_size,
    X2L_size,
    X3L_size,
    productPictures,
    category,
  } = req.body.products;

  // if (req.files.length > 0) {
  //   productPictures = [
  //     req.files.map((file) => {
  //       return file.filename;
  //     }),
  //   ];
  // }

  const quantity =
    parseInt(S_size) +
    parseInt(M_size) +
    parseInt(X_size) +
    parseInt(XL_size) +
    parseInt(X2L_size) +
    parseInt(X3L_size);
  const slug = slugify(name);

  const product = new Product({
    name,
    slug,
    price,
    quantity,
    size: {
      S_quantity: S_size,
      M_quantity: M_size,
      X_quantity: X_size,
      XL_quantity: XL_size,
      X2L_quantity: X2L_size,
      X3L_quantity: X3L_size,
    },
    description,
    color,
    productPictures,
    category,
    skuCode,
  });

  product.save((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      return res.status(200).json({ product });
    }
  });
};

exports.createProducts = (req, res) => {
  req.body.product.map((e) => {
    const {
      name,
      price,
      description,
      color,
      skuCode,
      S_size,
      M_size,
      X_size,
      XL_size,
      X2L_size,
      X3L_size,
      productPictures,
      category,
      createdBy,
    } = e;

    // if (req.files.length > 0) {
    //   productPictures = [
    //     req.files.map((file) => {
    //       return file.filename;
    //     }),
    //   ];
    // }

    const quantity =
      parseInt(S_size) +
      parseInt(M_size) +
      parseInt(X_size) +
      parseInt(XL_size) +
      parseInt(X2L_size) +
      parseInt(X3L_size);
    const slug = slugify(name);

    const product = new Product({
      name,
      slug,
      price,
      quantity,
      size: {
        S_quantity: S_size,
        M_quantity: M_size,
        X_quantity: X_size,
        XL_quantity: XL_size,
        X2L_quantity: X2L_size,
        X3L_quantity: X3L_size,
      },
      description,
      color,
      productPictures,
      skuCode,
      category,
      createdBy,
    });

    product.save((error, product) => {
      // if (error) return res.status(400).json({ error });
      // if (product) {
      //   return res.status(200).json({ product });
      // }
    });
  });
};

exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug: slug })
    .select("_id")
    .exec((error, category) => {
      if (error) {
        return res.status(400).json({ error });
      }

      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) {
            return res.status(400).json({ error });
          } else {
            res.status(200).json({ products });
          }
        });
      }
    });
};

exports.postProducts = async (req, res) => {
  const products = await Product.find({ createdBy: req.user._id })
    .select(
      "_id name price quantity slug description productPictures category skuCode"
    )
    .populate({ path: "category", select: "_id name" })
    .exec();

  res.status(200).json({ products });
};

exports.getProducts = (req, res) => {
  Product.find({}).exec((error, Products) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (Products) {
      // const productList = createProducts(Products);

      return res.status(200).json({ Products });
    }
  });
};

exports.getProductDetailsById = (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Product.findOne({ _id: productId }).exec((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) {
        res.status(200).json({ product });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

// new update
exports.deleteProductById = (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    Product.deleteOne({ _id: productId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.deleteAllProducts = (req, res) => {
  Product.deleteMany({}).exec((error, Products) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (Products) {
      // const productList = createProducts(Products);

      return res.status(200).json({ Products });
    }
  });
};
