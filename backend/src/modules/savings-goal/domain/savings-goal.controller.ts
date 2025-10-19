import { NextFunction, Request, Response } from "express";
import logger from "../../../logger";
import { SavingsGoalService } from "./savings-goal.service";
import {
  validatePostSavingsGoal,
  validateGetSavingsGoals,
  validateGetSavingsGoalById,
  validateUpdateSavingsGoal,
  validateDeleteSavingsGoal,
} from "./savings-goal.validator";

export class SavingsGoalController {
  constructor(private savingsGoalService: SavingsGoalService) {}

  postSavingsGoal = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.id;
    try {
      const {
        title,
        targetAmount,
        deadline,
        category,
        userId: id,
      } = validatePostSavingsGoal({
        ...req.body,
        userId,
      });

      logger.info(
        `SavingsGoalController: postSavingsGoal called with title: ${title}, targetAmount: ${targetAmount}, userId: ${userId}`
      );

      await this.savingsGoalService.addSavingsGoalToDatabase({
        userId: id,
        title,
        targetAmount,
        deadline,
        category,
      });

      res.status(201).send({ message: "Savings goal added successfully" });
    } catch (error) {
      next(error);
    }
  };

  getSavingsGoals = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.id;
    try {
      const { userId: id } = validateGetSavingsGoals({ userId });

      logger.info(
        `SavingsGoalController: getSavingsGoals called for userId: ${userId}`
      );

      const goals = await this.savingsGoalService.getSavingsGoalsFromDatabase(
        id
      );

      res.status(200).send(goals);
    } catch (error) {
      next(error);
    }
  };

  getSavingsGoalById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.id;
    const { goalId } = req.params;

    try {
      const { goalId: id, userId: uid } = validateGetSavingsGoalById({
        goalId,
        userId,
      });

      logger.info(
        `SavingsGoalController: getSavingsGoalById called for goalId: ${goalId}, userId: ${userId}`
      );

      const goal = await this.savingsGoalService.getSavingsGoalByIdFromDatabase(
        id,
        uid
      );

      res.status(200).send(goal);
    } catch (error) {
      next(error);
    }
  };

  updateSavingsGoal = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.id;
    const { goalId } = req.params;

    try {
      const {
        goalId: id,
        userId: uid,
        updatedGoal,
      } = validateUpdateSavingsGoal({
        goalId,
        userId,
        updatedGoal: req.body,
      });

      logger.info(
        `SavingsGoalController: updateSavingsGoal called for goalId: ${goalId}, userId: ${userId}`
      );

      await this.savingsGoalService.updateSavingsGoalInDatabase(
        id,
        uid,
        updatedGoal
      );

      res.status(200).send({ message: "Savings goal updated successfully" });
    } catch (error) {
      next(error);
    }
  };

  deleteSavingsGoal = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.id;
    const { goalId } = req.params;

    try {
      const { goalId: id, userId: uid } = validateDeleteSavingsGoal({
        goalId,
        userId,
      });

      logger.info(
        `SavingsGoalController: deleteSavingsGoal called for goalId: ${goalId}, userId: ${userId}`
      );

      await this.savingsGoalService.deleteSavingsGoalFromDatabase(id, uid);

      res.status(200).send({ message: "Savings goal deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}
