import { ObjectId } from "mongodb";
import { getDB, COLLECTIONS } from "../config/db.mjs";
import { downloadAsExcel } from "../utils/excelHelper.mjs";

// POST /api/expense — add new expense
export async function addExpense(req, res) {
  try {
    const expenses = getDB().collection(COLLECTIONS.EXPENSES);
    const { category, amount, title, date } = req.body;

    if (!category || !amount || !title) {
      return res.status(400).json({ message: "Please provide category, amount and title" });
    }

    const newExpense = {
      userId: new ObjectId(req.userId),
      title,
      category,
      amount: Number(amount),
      date: date ? new Date(date) : new Date(),
      createdAt: new Date(),
    };

    const result = await expenses.insertOne(newExpense);
    newExpense._id = result.insertedId;

    res.status(201).json(newExpense);
  } catch (error) {
    console.error("Add expense error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// GET /api/expense — get all expenses of logged in user
export async function getExpenses(req, res) {
  try {
    const expenses = getDB().collection(COLLECTIONS.EXPENSES);
    const data = await expenses
      .find({ userId: new ObjectId(req.userId) })
      .sort({ date: -1 })
      .toArray();

    res.json(data);
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// DELETE /api/expense/:id — delete one expense
export async function deleteExpense(req, res) {
  try {
    const expenses = getDB().collection(COLLECTIONS.EXPENSES);
    const result = await expenses.deleteOne({
      _id: new ObjectId(req.params.id),
      userId: new ObjectId(req.userId),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// GET /api/expense/download — download all expenses as excel
export async function downloadExpenseExcel(req, res) {
  try {
    const expenses = getDB().collection(COLLECTIONS.EXPENSES);
    const data = await expenses
      .find({ userId: new ObjectId(req.userId) })
      .sort({ date: -1 })
      .toArray();

    const rows = data.map((item) => ({
      Title: item.title,
      Category: item.category,
      Amount: item.amount,
      Date: new Date(item.date).toLocaleDateString(),
    }));

    downloadAsExcel(res, rows, "Expenses", "expenses.xlsx");
  } catch (error) {
    console.error("Download expense excel error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
