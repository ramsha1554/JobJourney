// Load environment variables BEFORE any other imports
const dotenv = require("dotenv");
dotenv.config({ path: require("path").resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Start DB connection (db.js will validate env)
connectDB();

const app = express();

app.use(express.json());

// Explicit CORS config for deployed frontend -> deployed API preflight requests
app.use(
  cors({
    origin: ["https://job-journey-gold.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Handle preflight explicitly
app.options("*", cors());
app.use(helmet());

app.use(morgan("dev"));

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
