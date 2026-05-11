import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { areaRoutes } from "./routes/areaRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/areas", areaRoutes);

app.get("/", (req, res) => {
  res.json({ message: "ProcessHub API is running" });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});