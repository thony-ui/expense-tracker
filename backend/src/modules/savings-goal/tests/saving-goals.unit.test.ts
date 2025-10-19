import type { Request, Response, NextFunction } from "express";
import { SavingsGoalController } from "../domain/savings-goal.controller";
import { ISavingsGoal } from "../domain/savings-goal.interface";
import { SavingsGoalRepository } from "../domain/savings-goal.repository";
import { SavingsGoalService } from "../domain/savings-goal.service";

jest.mock("../../../logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});
// ...existing imports and setup...

describe("SavingsGoal Service", () => {
  it("should add a savings goal to the database", async () => {
    const mockSavingsGoalRepository = {
      addSavingsGoalToDatabase: jest.fn().mockResolvedValue(undefined),
    } as unknown as SavingsGoalRepository;

    const savingsGoalService = new SavingsGoalService(
      mockSavingsGoalRepository
    );

    const goalData: ISavingsGoal = {
      userId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      title: "Emergency Fund",
      targetAmount: 1000,
      currentAmount: 100,
      deadline: "2025-12-31",
      category: "General",
    };

    await savingsGoalService.addSavingsGoalToDatabase(goalData);

    expect(
      mockSavingsGoalRepository.addSavingsGoalToDatabase
    ).toHaveBeenCalledWith(goalData);
  });

  it("should throw an error if adding savings goal fails", async () => {
    const mockSavingsGoalRepository = {
      addSavingsGoalToDatabase: jest
        .fn()
        .mockRejectedValue(new Error("Database error")),
    } as unknown as SavingsGoalRepository;

    const savingsGoalService = new SavingsGoalService(
      mockSavingsGoalRepository
    );

    const goalData: ISavingsGoal = {
      userId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      title: "Emergency Fund",
      targetAmount: 1000,
      currentAmount: 100,
      deadline: "2025-12-31",
      category: "General",
    };

    await expect(
      savingsGoalService.addSavingsGoalToDatabase(goalData)
    ).rejects.toThrow("Database error");
  });

  it("should get savings goals from the database", async () => {
    const mockSavingsGoalRepository = {
      getSavingsGoalsFromDatabase: jest.fn().mockResolvedValue([
        {
          title: "Emergency Fund",
          targetAmount: 1000,
          currentAmount: 100,
          deadline: "2025-12-31",
          category: "General",
        },
      ]),
    } as unknown as SavingsGoalRepository;

    const savingsGoalService = new SavingsGoalService(
      mockSavingsGoalRepository
    );

    const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
    const goals = await savingsGoalService.getSavingsGoalsFromDatabase(userId);

    expect(
      mockSavingsGoalRepository.getSavingsGoalsFromDatabase
    ).toHaveBeenCalledWith(userId);
    expect(goals).toEqual([
      {
        title: "Emergency Fund",
        targetAmount: 1000,
        currentAmount: 100,
        deadline: "2025-12-31",
        category: "General",
      },
    ]);
  });

  it("should update a savings goal in the database", async () => {
    const mockSavingsGoalRepository = {
      updateSavingsGoalInDatabase: jest.fn().mockResolvedValue(undefined),
    } as unknown as SavingsGoalRepository;

    const savingsGoalService = new SavingsGoalService(
      mockSavingsGoalRepository
    );

    const goalId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
    const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
    const updatedGoal = {
      title: "Emergency Fund Updated",
      targetAmount: 2000,
      currentAmount: 500,
      deadline: "2026-01-01",
      category: "General",
    };

    await savingsGoalService.updateSavingsGoalInDatabase(
      goalId,
      userId,
      updatedGoal
    );

    expect(
      mockSavingsGoalRepository.updateSavingsGoalInDatabase
    ).toHaveBeenCalledWith(goalId, userId, updatedGoal);
  });

  it("should delete a savings goal from the database", async () => {
    const mockSavingsGoalRepository = {
      deleteSavingsGoalFromDatabase: jest.fn().mockResolvedValue(undefined),
    } as unknown as SavingsGoalRepository;

    const savingsGoalService = new SavingsGoalService(
      mockSavingsGoalRepository
    );

    const goalId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
    const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

    await savingsGoalService.deleteSavingsGoalFromDatabase(goalId, userId);

    expect(
      mockSavingsGoalRepository.deleteSavingsGoalFromDatabase
    ).toHaveBeenCalledWith(goalId, userId);
  });
});

describe("SavingsGoal Controller", () => {
  it("should call addSavingsGoalToDatabase with correct parameters", async () => {
    const mockSavingsGoalService = {
      addSavingsGoalToDatabase: jest.fn().mockResolvedValue(undefined),
    } as unknown as SavingsGoalService;

    const savingsGoalController = new SavingsGoalController(
      mockSavingsGoalService
    );

    const req = {
      user: { id: "f47ac10b-58cc-4372-a567-0e02b2c3d479" },
      body: {
        title: "Emergency Fund",
        targetAmount: 1000,
        currentAmount: 100,
        deadline: "2025-12-31",
        category: "General",
      },
      query: {},
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as Partial<Response>;

    const next = jest.fn();

    await savingsGoalController.postSavingsGoal(
      req as Request,
      res as Response,
      next
    );

    expect(
      mockSavingsGoalService.addSavingsGoalToDatabase
    ).toHaveBeenCalledWith({
      userId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      title: "Emergency Fund",
      targetAmount: 1000,
      currentAmount: 100,
      deadline: "2025-12-31",
      category: "General",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      message: "Savings goal added successfully",
    });
  });

  it("should handle errors in postSavingsGoal", async () => {
    const mockSavingsGoalService = {
      addSavingsGoalToDatabase: jest
        .fn()
        .mockRejectedValue(new Error("Error adding savings goal")),
    } as unknown as SavingsGoalService;

    const savingsGoalController = new SavingsGoalController(
      mockSavingsGoalService
    );

    const req = {
      user: { id: "f47ac10b-58cc-4372-a567-0e02b2c3d479" },
      body: {
        title: "Emergency Fund",
        targetAmount: 1000,
        currentAmount: 100,
        deadline: "2025-12-31",
        category: "General",
      },
      query: {},
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as Partial<Response>;

    const next = jest.fn();

    await savingsGoalController.postSavingsGoal(
      req as Request,
      res as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(new Error("Error adding savings goal"));
  });

  it("should call getSavingsGoalsFromDatabase with correct userId", async () => {
    const mockSavingsGoalService = {
      getSavingsGoalsFromDatabase: jest.fn().mockResolvedValue([
        {
          title: "Emergency Fund",
          targetAmount: 1000,
          currentAmount: 100,
          deadline: "2025-12-31",
          category: "General",
        },
      ]),
    } as unknown as SavingsGoalService;

    const savingsGoalController = new SavingsGoalController(
      mockSavingsGoalService
    );

    const req = {
      user: { id: "f47ac10b-58cc-4372-a567-0e02b2c3d479" },
      body: {},
      query: {},
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as Partial<Response>;

    const next = jest.fn();

    await savingsGoalController.getSavingsGoals(
      req as Request,
      res as Response,
      next
    );

    expect(
      mockSavingsGoalService.getSavingsGoalsFromDatabase
    ).toHaveBeenCalledWith("f47ac10b-58cc-4372-a567-0e02b2c3d479");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith([
      {
        title: "Emergency Fund",
        targetAmount: 1000,
        currentAmount: 100,
        deadline: "2025-12-31",
        category: "General",
      },
    ]);
  });

  it("should update a savings goal in the database", async () => {
    const mockSavingsGoalService = {
      updateSavingsGoalInDatabase: jest.fn().mockResolvedValue(undefined),
    } as unknown as SavingsGoalService;

    const savingsGoalController = new SavingsGoalController(
      mockSavingsGoalService
    );

    const req = {
      user: { id: "f47ac10b-58cc-4372-a567-0e02b2c3d479" },
      body: {
        title: "Emergency Fund Updated",
        targetAmount: 2000,
        currentAmount: 500,
        deadline: "2026-01-01",
        category: "General",
      },
      params: { goalId: "f47ac10b-58cc-4372-a567-0e02b2c3d479" },
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as Partial<Response>;

    const next = jest.fn();

    await savingsGoalController.updateSavingsGoal(
      req as Request,
      res as Response,
      next
    );

    expect(
      mockSavingsGoalService.updateSavingsGoalInDatabase
    ).toHaveBeenCalledWith(
      "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      {
        title: "Emergency Fund Updated",
        targetAmount: 2000,
        currentAmount: 500,
        deadline: "2026-01-01",
        category: "General",
      }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "Savings goal updated successfully",
    });
  });

  it("should delete a savings goal from the database", async () => {
    const mockSavingsGoalService = {
      deleteSavingsGoalFromDatabase: jest.fn().mockResolvedValue(undefined),
    } as unknown as SavingsGoalService;

    const savingsGoalController = new SavingsGoalController(
      mockSavingsGoalService
    );

    const req = {
      user: { id: "f47ac10b-58cc-4372-a567-0e02b2c3d479" },
      params: { goalId: "f47ac10b-58cc-4372-a567-0e02b2c3d479" },
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as Partial<Response>;

    const next = jest.fn();

    await savingsGoalController.deleteSavingsGoal(
      req as Request,
      res as Response,
      next
    );

    expect(
      mockSavingsGoalService.deleteSavingsGoalFromDatabase
    ).toHaveBeenCalledWith(
      "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "f47ac10b-58cc-4372-a567-0e02b2c3d479"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "Savings goal deleted successfully",
    });
  });
});
