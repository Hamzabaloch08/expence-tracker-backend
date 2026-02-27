import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.mjs";

import authRoutes from "./routes/authRoutes.mjs";
import incomeRoutes from "./routes/incomeRoutes.mjs";
import expenseRoutes from "./routes/expenseRoutes.mjs";

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// connect DB before handling requests (cached for serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expense", expenseRoutes);

// health check
app.get("/", (req, res) => {
  res.json({ message: "Expense Tracker API is running" });
});

// only listen when running locally (not on Vercel)

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

export default app;
