import { Application, Router } from "express";
import * as userController from "../../domain/user.controller";
import { authenticateUser } from "../../../../middleware/authorization";

export function defineUserRoutes(expressApp: Application) {
  const userRouter = Router();
  userRouter.post("/", userController.postUser);
  userRouter.get("/", userController.getUser);

  expressApp.use("/v1/users", authenticateUser, userRouter);
}
