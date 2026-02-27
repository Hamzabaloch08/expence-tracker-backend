import { MongoClient } from "mongodb";

// db name and collection names
const DB_NAME = "expense-tracker";
export const COLLECTIONS = {
  USERS: "users",
  INCOMES: "incomes",
  EXPENSES: "expenses",
};

let db;
let client;

export async function connectDB() {
  if (db) return db;
  client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db(DB_NAME);
  console.log("MongoDB connected successfully");
  return db;
}

export function getDB() {
  if (!db) throw new Error("Database not initialized. Call connectDB first.");
  return db;
}
