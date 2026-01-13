import express from "express";
import dotenv from "dotenv";
import "./database/Databases.js";
import router from "./routes/user-routes/UserRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
