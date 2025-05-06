import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import connect_db from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import ProductRoutes from "./routes/ProductRoutes.js";

dotenv.config();
const app = express();

//database config
connect_db();
//middlewares
app.use(express.json());
app.use(morgan("dev"));
//routes
app.use(cors());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", ProductRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the world</h1>");
});
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Server is running on ${process.env.DEV_MODE} mode on port  ${PORT} `.bgBlue
  );
});
