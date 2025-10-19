import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import residentRoutes from "./routes/residentRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import parkingRoutes from "./routes/parkingRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import ekubEddirRoutes from "./routes/ekubEddirRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import utilityRoutes from "./routes/utilityRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import condominiumRoutes from "./routes/condominiumRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import bootstrapRoutes from "./routes/bootstrapRoutes.js";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./uploadthing.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173", 
      "https://rmsf-ebon.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "b3",
      "traceparent",
      "tracestate",
      "x-uploadthing-package",
      "x-uploadthing-version",
      "x-uploadthing-api-key",
      "x-uploadthing-be-adapter",
      "x-uploadthing-fe-package",
      "x-uploadthing-fe-version",
    ],
  })
);

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,b3,traceparent,tracestate,x-uploadthing-package,x-uploadthing-version,x-uploadthing-api-key,x-uploadthing-be-adapter,x-uploadthing-fe-package,x-uploadthing-fe-version');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve static files with explicit CORS headers
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static("uploads")
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/residents", residentRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/parking", parkingRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/groups", ekubEddirRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/utilities", utilityRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/condominiums", condominiumRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/bootstrap", bootstrapRoutes);
app.use("/api/uploadthing", createRouteHandler({ router: uploadRouter }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "CMSB Backend is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  
  // Set CORS headers for error responses
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  res.status(500).json({ error: err.message || "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`CMSB Backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
