import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { getDB, COLLECTIONS } from "../config/db.mjs";

// helper to make token
function makeToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// POST /api/auth/signup
export async function signup(req, res) {
  try {
    const users = getDB().collection(COLLECTIONS.USERS);
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const alreadyExists = await users.findOne({ email });
    if (alreadyExists) {
      return res
        .status(400)
        .json({ message: "This email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await users.insertOne({
      fullName,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Account created, please login now" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// POST /api/auth/login
export async function login(req, res) {
  try {
    const users = getDB().collection(COLLECTIONS.USERS);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await users.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Wrong email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Wrong email or password" });
    }

    const token = makeToken(user._id.toString());

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// GET /api/auth/check — token valid hai? user bhejo
export async function getMe(req, res) {
  try {
    const users = getDB().collection(COLLECTIONS.USERS);
    const user = await users.findOne({ _id: new ObjectId(req.userId) });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
