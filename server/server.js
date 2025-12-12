// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import path from "path";
// import { fileURLToPath } from "url";

// import connectDB from "./configs/db.js";
// import userRouter from "./routes/userRoutes.js";
// import resumeRouter from "./routes/resumeRoutes.js";
// import aiRouter from "./routes/aiRoutes.js";

// const APP_VERSION = process.env.APP_VERSION || "1.0.0";

// const app = express();
// const PORT = process.env.PORT || 3000;

// // ---- DATABASE CONNECTION ----
// try {
//   await connectDB();
//   console.log("Database connected successfully");
// } catch (err) {
//   console.error("Failed to connect to database:", err.message);
//   process.exit(1);
// }

// app.use(express.json());
// app.use(cors());

// // ---- API ROUTES ----
// app.use("/api/users", userRouter);
// app.use("/api/resumes", resumeRouter);
// app.use("/api/ai", aiRouter);

// // ---- STATIC FRONTEND (VITE BUILD) ----

// // fix __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // serve built frontend
// app.use(express.static(path.join(__dirname, "public")));

// // fallback to index.html for SPA routing
// // IMPORTANT: regex route (/.*/) prevents path-to-regexp v7 errors
// app.get(/.*/, (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// // ---- START SERVER ----
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server is running on port ${PORT}`);
// });


import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

const APP_VERSION = process.env.APP_VERSION || "1.0.0";

const app = express();
const PORT = process.env.PORT || 3000;

// ---- DATABASE CONNECTION ----
try {
  await connectDB();
  console.log("Database connected successfully");
} catch (err) {
  console.error("Failed to connect to database:", err.message);
  process.exit(1);
}

app.use(express.json());
app.use(cors());

// ---- HEALTH CHECK ENDPOINTS (MUST BE BEFORE CATCH-ALL) ----
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    version: APP_VERSION,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get("/ready", (req, res) => {
  // Check if MongoDB is connected
  if (mongoose.connection.readyState === 1) {
    res.status(200).json({
      status: "ready",
      database: "connected"
    });
  } else {
    res.status(503).json({
      status: "not ready",
      database: "disconnected"
    });
  }
});

// ---- API ROUTES ----
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);

// ---- STATIC FRONTEND (VITE BUILD) ----
// fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve built frontend
app.use(express.static(path.join(__dirname, "public")));

// fallback to index.html for SPA routing
// IMPORTANT: This MUST be LAST - it's a catch-all route
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ---- START SERVER ----
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});