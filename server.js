import express from "express";
import cors from "cors";
import flowers from "./api/flowers.route.js";
import port from "./index.js";

const app = express();
app.listen(port, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

app.use(express.static("build"));
app.use(cors());
app.use(express.json());

app.use("/api/v1/flowers", flowers);
app.use("*", (req, res) => {
  res.status(404).json({ error: "not found" });
});

export default app;
