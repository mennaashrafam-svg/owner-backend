const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "الخادم شغال بنجاح" });
});

app.get("/api/conversations", async (req, res) => {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .order("date", { ascending: false });
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.post("/api/conversations", async (req, res) => {
  const { data, error } = await supabase
    .from("conversations")
    .insert(req.body)
    .select();
  if (error) return res.status(500).json({ message: error.message });
  res.json(data[0]);
});

app.get("/api/agents", async (req, res) => {
  const { data, error } = await supabase
    .from("agents")
    .select("*");
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("الخادم شغال على البورت " + PORT);
});