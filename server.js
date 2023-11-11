import express from "express";
import cors from "cors";
import movies from "./api/movies.route.js";

const app = express();

app.use(express.static("build"));
app.use(cors());
app.use(express.json());

app.use("/api/v1/movies", movies);
app.use("*", (req, res) => {
  res.status(404).json({ error: "not found" });
});

// app.put("/api/v1/movies", (req, res) => {
//   console.log(req.body);
//   return res.json({ message: "put route" });
// });

export default app;
