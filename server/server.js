import express from "express";
import dotenv from "dotenv";
import router from "./routes/UserRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import extraRoutes from "./routes/ExtraRoutes.js";
import postRouter from "./routes/PostRoutes.js";
import SystemAssetsRoutes from "./routes/SystemAssetsRoutes.js";
import academicStructureRoutes from "./routes/AcademicStructureRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const allowedOrigins = [process.env.FRONT_URL, process.env.STUDENT_APP_URL];

app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

function originGuard(req, res, next) {
  const origin = req.headers.origin;
  if (!origin || !allowedOrigins.includes(origin)) {
    return res.status(403).json({ message: "Your Are Non Allowed User" });
  }
  next();
}

app.use(originGuard);
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api", router);
app.use("/api", extraRoutes);
app.use("/api", postRouter);
app.use("/api", SystemAssetsRoutes);
app.use("/api", academicStructureRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
