const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });

const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const Message = require("./models/Message");

const bootstrap = async () => {
  await connectDB();

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: process.env.CLIENT_URL, credentials: true } });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Unauthorized"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = { id: String(decoded.id), role: decoded.role };
      return next();
    } catch (error) {
      return next(new Error("Unauthorized"));
    }
  });

  app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));

  app.get("/api/health", (req, res) => res.json({ success: true }));
  app.use("/api/auth", require("./routes/authRoutes"));
  app.use("/api/users", require("./routes/userRoutes"));
  app.use("/api/jobs", require("./routes/jobRoutes"));
  app.use("/api/proposals", require("./routes/proposalRoutes"));
  app.use("/api/dashboard", require("./routes/dashboardRoutes"));
  app.use("/api/chat", require("./routes/chatRoutes"));
  app.use("/api/currency", require("./routes/currencyRoutes"));
  app.use("/api/reports", require("./routes/reportRoutes"));

  io.on("connection", (socket) => {
    socket.on("join", ({ userId }) => {
      if (String(userId) !== String(socket.user.id)) return;
      socket.join(String(socket.user.id));
    });

    socket.on("sendMessage", async ({ receiverId, text }) => {
      if (!receiverId || !text?.trim()) return;
      const senderId = String(socket.user.id);
      const safeReceiverId = String(receiverId);
      const conversationId = [senderId, safeReceiverId].sort().join("_");
      const message = await Message.create({ senderId, receiverId: safeReceiverId, text: text.trim(), conversationId });
      io.to(safeReceiverId).to(senderId).emit("receiveMessage", message);
    });
  });

  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Server running on ${PORT}`));
};

bootstrap();
