import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: {
    type: String,
    default: "https://via.placeholder.com/300x300"
  },
    discount: {
    type: Number, 
    default: 0
  }
});

const Product = mongoose.model("Product", productSchema);
export default Product;