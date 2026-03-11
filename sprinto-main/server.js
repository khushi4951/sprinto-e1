/**
 * Sprint Management App (Express + Vanilla JS SPA)
 *
 * Client-Server Architecture (high level):
 * - Client: a Single Page Application (HTML/CSS/JS) served from `/public`
 * - Server: Express REST APIs under `/api/*` that return JSON
 * - Data: stored in JSON files under `/data` using Node's `fs` module
 *
 * Request Lifecycle (high level):
 * - Incoming request -> logger middleware -> JSON body parsing -> routing -> controller -> JSON response
 * - Errors bubble to centralized error-handling middleware
 */

const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");

const { logger } = require("./middleware/logger");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const sprintRoutes = require("./routes/sprintRoutes");
const issueRoutes = require("./routes/issueRoutes");
const teamRoutes = require("./routes/teamRoutes");

const { ensureDataFilesExist } = require("./data/store");

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure the JSON "database" exists before serving traffic.
ensureDataFilesExist();

// Middleware runs in order for every request (unless a route ends the response earlier).
app.use(logger);
app.use(express.json()); // Body parser for JSON request payloads.
app.use(cookieParser()); // Parses Cookie header into req.cookies

// Serve static client assets (SPA) from /public.
app.use(express.static(path.join(__dirname, "public")));

// API routes (server-side)
app.use("/api/auth", authRoutes);
app.use("/api/sprints", sprintRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/team", teamRoutes);

// SPA fallback: serve index.html for unknown non-API GET routes.
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`);
});

