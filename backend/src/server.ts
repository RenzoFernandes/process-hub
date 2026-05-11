import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { areaRoutes } from "./routes/areaRoutes";
import { processRoutes } from "./routes/processRoutes";

dotenv.config();

const app = express();

// Middlewares globais: liberam consumo via frontend e leitura de JSON no body.
app.use(cors());
app.use(express.json());

app.use("/areas", areaRoutes);
app.use("/processes", processRoutes);
app.get("/", (req, res) => {
  res.json({ message: "ProcessHub API is running" });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
