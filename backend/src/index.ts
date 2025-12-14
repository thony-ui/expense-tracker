import bodyParser from "body-parser";
import express from "express";
import cors from "cors"; // Add this import
import { defineUserRoutes } from "./modules/user";
import { Server } from "http";
import { defineChatRoutes } from "./modules/chat";
import { defineTransactionRoutes } from "./modules/transaction";
import { defineExchangeRateRouter } from "./modules/exchange-rate";
import { defineSavingsGoalRoutes } from "./modules/savings-goal";
import { defineInvestmentRoutes } from "./modules/investment";

require("dotenv").config(); // Load environment variables from .env file

const app = express();

// Configure CORS properly
app.use(
  cors({
    origin: [
      process.env.ALLOWED_ORIGIN_DEVELOPMENT!, // Development origin
      process.env.ALLOWED_ORIGIN_PRODUCTION!,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());

defineUserRoutes(app);
defineTransactionRoutes(app);
defineChatRoutes(app);
defineExchangeRateRouter(app);
defineSavingsGoalRoutes(app);
defineInvestmentRoutes(app);

const port = process.env.PORT || 8000;
let server: Server;

server = app.listen(port, () => {
  console.log("Backend server is running!");
});

export { app, server };
