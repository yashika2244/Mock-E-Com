import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { seedProducts } from "./controllers/productController.js";

import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";

dotenv.config();
connectDB();

const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mock-e-com.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());


app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);


app.get("/", (req, res) => res.send("API is running..."));


const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await seedProducts();
  console.log(`Server running on port ${PORT}`);
});
