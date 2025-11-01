const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "mysecretkey";

// Hardcoded sample user
const user = {
  username: "sahil",
  password: "12345",
};

// -----------------------------
// 1️⃣ LOGIN ROUTE (Issue JWT)
// -----------------------------
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === user.username && password === user.password) {
    // Generate JWT token (valid for 1 hour)
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// -----------------------------
// 2️⃣ AUTH MIDDLEWARE
// -----------------------------
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "Missing Authorization header" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = decoded;
    next();
  });
};

// -----------------------------
// 3️⃣ PROTECTED ROUTE
// -----------------------------
app.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: `Welcome ${req.user.username}, you have access to protected data!`,
  });
});

// -----------------------------
// 4️⃣ PUBLIC ROUTE
// -----------------------------
app.get("/public", (req, res) => {
  res.json({ message: "This is a public route accessible to everyone." });
});

// -----------------------------
// 5️⃣ START SERVER
// -----------------------------
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
