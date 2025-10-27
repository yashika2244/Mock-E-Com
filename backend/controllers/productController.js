import Product from "../models/productModel.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Seed initial products if not present
export const seedProducts = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      {
        name: "Laptop",
        price: 70000,
        image: "https://th.bing.com/th/id/R.394d42a12a654a01aff55a4ac589de48?rik=8meqYWp%2fRiAmDw&riu=http%3a%2f%2fstore.hp.com%2fUKStore%2fHtml%2fMerch%2fImages%2fc05475056_1750x1285.jpg&ehk=hFHW0bsoA4Vrq9NqTnBn9ZROJe9jXLuXOG2U%2bb2O7Wk%3d&risl=&pid=ImgRaw&r=0"
      },
      {
        name: "Headphones",
        price: 3000,
        image: "https://th.bing.com/th/id/OIP.OctJq06i6wIxTXsGBFIx9AHaHa?w=195&h=195&c=7&r=0&o=7&pid=1.7&rm=3"
      },
      {
        name: "Mouse",
        price: 800,
        image: "https://th.bing.com/th/id/OIP.mAkxS19YxYV0ueGlHF3GKQHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3"
      },
      {
        name: "Keyboard",
        price: 1500,
        image: "https://www.bing.com/th/id/OIP.zYkjL9efC_KJhkUeghdsUwHaFj?w=236&h=211&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2"
      },
      {
        name: "Smartphone",
        price: 25000,
        image: "https://th.bing.com/th/id/OIP.hPDY-tDFjAOYM3Rl7m0SoAHaE7?w=304&h=202&c=7&r=0&o=7&pid=1.7&rm=3"
      }
    ]);
    console.log("Seeded mock products with images");
  }
};
