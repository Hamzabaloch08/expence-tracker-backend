import { ObjectId } from "mongodb";
import { getDB, COLLECTIONS } from "../config/db.mjs";
import { downloadAsExcel } from "../utils/excelHelper.mjs";

// POST /api/income — add new income
export async function addIncome(req, res) {
  try {
    const incomes = getDB().collection(COLLECTIONS.INCOMES);
    const { title, source, amount, date } = req.body;

    if (!title || !source || !amount) {
      return res
        .status(400)
        .json({ message: "Please provide title, source and amount" });
    }

    const newIncome = {
      userId: new ObjectId(req.userId),
      title,
      source,
      amount: Number(amount),
      date: date ? new Date(date) : new Date(),
      createdAt: new Date(),
    };

    const result = await incomes.insertOne(newIncome);
    newIncome._id = result.insertedId;

    res.status(201).json(newIncome);
  } catch (error) {
    console.error("Add income error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// GET /api/income — get all incomes of logged in user
export async function getIncomes(req, res) {
  try {
    const incomes = getDB().collection(COLLECTIONS.INCOMES);
    const data = await incomes
      .find({ userId: new ObjectId(req.userId) })
      .sort({ date: -1 })
      .toArray();

    res.json(data);
  } catch (error) {
    console.error("Get incomes error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// DELETE /api/income/:id — delete one income
export async function deleteIncome(req, res) {
  try {
    const incomes = getDB().collection(COLLECTIONS.INCOMES);
    const result = await incomes.deleteOne({
      _id: new ObjectId(req.params.id),
      userId: new ObjectId(req.userId),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    console.error("Delete income error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// GET /api/income/download — download all incomes as excel
export async function downloadIncomeExcel(req, res) {
  try {
    const incomes = getDB().collection(COLLECTIONS.INCOMES);
    const data = await incomes
      .find({ userId: new ObjectId(req.userId) })
      .sort({ date: -1 })
      .toArray();

    const rows = data.map((item) => ({
      Title: item.title,
      Source: item.source,
      Amount: item.amount,
      Date: new Date(item.date).toLocaleDateString(),
    }));

    downloadAsExcel(res, rows, "Income", "income.xlsx");
  } catch (error) {
    console.error("Download income excel error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
