import { Router } from "express";
import {
  addExpense,
  getExpenses,
  deleteExpense,
  downloadExpenseExcel,
} from "../controllers/expenseController.mjs";
import { authenticate } from "../middleware/auth.mjs";

const router = Router();

router.use(authenticate);

router.post("/", addExpense);
router.get("/", getExpenses);
router.delete("/:id", deleteExpense);
router.get("/download", downloadExpenseExcel);

export default router;
