import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  // get token from header like "Bearer eyJhbG..."
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, please login first" });
  }

  // remove "Bearer " part and get actual token
  token = token.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token expired or invalid, login again" });
  }
}
