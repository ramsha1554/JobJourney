// Load environment variables BEFORE any other imports (local development only)
const dotenv = require("dotenv");
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: require("path").resolve(__dirname, ".env") });
}

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["https://job-journey-gold.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(helmet());
app.use(morgan("dev"));

const REQUIRED_ENV_VARS = [
  "JWT_SECRET",
  "MONGODB_URI",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const missing = REQUIRED_ENV_VARS.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.error(`[server] Missing required environment variables: ${missing.join(", ")}.`);
  console.error("[server] Refusing to start.");
  process.exit(1);
}

const auth = require("./routes/authRoutes");
const jobs = require("./routes/jobRoutes");
const tasks = require("./routes/taskRoutes");
const resumes = require("./routes/resumeRoutes");
const analytics = require("./routes/analyticsRoutes");
const ai = require("./routes/aiRoutes");

app.use("/api/auth", auth);
app.use("/api/jobs", jobs);
app.use("/api/tasks", tasks);
app.use("/api/resumes", resumes);
app.use("/api/analytics", analytics);
app.use("/api/ai", ai);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Global error handler — MUST be last, after all routes
app.use((err, req, res, next) => {
  console.error("Global error:", JSON.stringify({
    message: err?.message,
    stack: err?.stack,
    name: err?.name,
  }));
  res.status(500).json({ success: false, error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});