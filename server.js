const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "الخادم شغال بنجاح" });
});

app.get("/api/conversations", (req, res) => {
  res.json({ data: [], message: "جاهز لاستقبال بيانات حقيقية" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("الخادم شغال على البورت " + PORT);
});