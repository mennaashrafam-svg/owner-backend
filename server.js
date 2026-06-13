const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "owner-platform-secret-2024";

// التحقق من التوكن
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "غير مصرح" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "التوكن غير صالح" });
  }
};

// تسجيل الدخول
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  if (error || !user) return res.status(401).json({ message: "بيانات غلط" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "بيانات غلط" });
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

// تسجيل مستخدم جديد
app.post("/api/auth/register", async (req, res) => {
  const { email, password, name } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from("users")
    .insert({ email, password: hashed, name })
    .select()
    .single();
  if (error) return res.status(400).json({ message: error.message });
  const token = jwt.sign({ id: data.id, email: data.email }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: data.id, email: data.email, name: data.name } });
});

// جيب المحادثات
app.get("/api/conversations", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .order("date", { ascending: false });
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

// أضف محادثة
app.post("/api/conversations", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("conversations")
    .insert(req.body)
    .select();
  if (error) return res.status(500).json({ message: error.message });
  res.json(data[0]);
});

// جيب الموظفين
app.get("/api/agents", requireAuth, async (req, res) => {
  const { data, error } = await supabase.from("agents").select("*");
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

// تأكد إن الخادم شغال
app.get("/", (req, res) => {
  res.json({ message: "الخادم شغال بنجاح" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("الخادم شغال على البورت " + PORT);
});