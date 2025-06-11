import bodyParser from "body-parser";
import express from "express";
import cors from "cors"; // Add this import
import { defineUserRoutes } from "./modules/user";
import { Server } from "http";

const app = express();

// Configure CORS properly
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Add your frontend URLs
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());

defineUserRoutes(app);
let server: Server;

server = app.listen(8000, () => {
  console.log("Backend server is running on http://localhost:8000");
});

export { app, server };
