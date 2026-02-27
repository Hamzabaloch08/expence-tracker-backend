import { Router } from "express";
import {
  addIncome,
  getIncomes,
  deleteIncome,
  downloadIncomeExcel,
} from "../controllers/incomeController.mjs";
import { authenticate } from "../middleware/auth.mjs";

const router = Router();

router.use(authenticate);

router.post("/", addIncome);
router.get("/", getIncomes);
router.delete("/:id", deleteIncome);
router.get("/download", downloadIncomeExcel);

export default router;
