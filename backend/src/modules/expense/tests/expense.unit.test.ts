import { ExpenseController } from "../domain/expense.controller";
import { IExpense } from "../domain/expense.interface";
import { ExpenseRepository } from "../domain/expense.repository";
import { ExpenseService } from "../domain/expense.service";
import type { Request, Response, NextFunction } from "express";

jest.mock("../../../logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe("Expense Service", () => {
  it("should add an expense to the database", async () => {
    const mockExpenseRepository = {
      addExpenseToDatabase: jest.fn().mockResolvedValue(undefined),
    } as unknown as ExpenseRepository;

    const expenseService = new ExpenseService(mockExpenseRepository);

    const expenseData: IExpense = {
      userId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      type: "Food",
      amount: 50,
      name: "Lunch",
      description: "Lunch at a restaurant",
      category: "Dining",
      date: "2023-10-01",
    };

    await expenseService.addExpenseToDatabase(expenseData);

    expect(mockExpenseRepository.addExpenseToDatabase).toHaveBeenCalledWith(
      expenseData
    );
  });
  it("should throw an error if adding expense fails", async () => {
    const mockExpenseRepository = {
      addExpenseToDatabase: jest
        .fn()
        .mockRejectedValue(new Error("Database error")),
    } as unknown as ExpenseRepository;

    const expenseService = new ExpenseService(mockExpenseRepository);

    const expenseData: IExpense = {
      userId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      type: "Food",
      amount: 50,
      name: "Lunch",
      description: "Lunch at a restaurant",
      category: "Dining",
      date: "2023-10-01",
    };

    await expect(
      expenseService.addExpenseToDatabase(expenseData)
    ).rejects.toThrow("Database error");
  });
  it("should get expenses from the database", async () => {
    const mockExpenseRepository = {
      getExpensesFromDatabase: jest.fn().mockResolvedValue([
        {
          type: "Food",
          amount: 50,
          name: "Lunch",
          description: "Lunch at a restaurant",
          category: "Dining",
          date: "2023-10-01",
        },
      ]),
    } as unknown as ExpenseRepository;

    const expenseService = new ExpenseService(mockExpenseRepository);

    const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
    const expenses = await expenseService.getExpensesFromDatabase(userId);

    expect(mockExpenseRepository.getExpensesFromDatabase).toHaveBeenCalledWith(
      userId
    );
    expect(expenses).toEqual([
      {
        type: "Food",
        amount: 50,
        name: "Lunch",
        description: "Lunch at a restaurant",
        category: "Dining",
        date: "2023-10-01",
      },
    ]);
  });
  it("should throw an error if getting expenses fails", async () => {
    const mockExpenseRepository = {
      getExpensesFromDatabase: jest
        .fn()
        .mockRejectedValue(new Error("Database error")),
    } as unknown as ExpenseRepository;

    const expenseService = new ExpenseService(mockExpenseRepository);

    const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

    await expect(
      expenseService.getExpensesFromDatabase(userId)
    ).rejects.toThrow("Database error");
  });
});

describe("Expense Controller", () => {
  it("should call addExpenseToDatabase with correct parameters", async () => {
    const mockExpenseService = {
      addExpenseToDatabase: jest.fn().mockResolvedValue(undefined),
    } as unknown as ExpenseService;

    const expenseController = new ExpenseController(mockExpenseService);

    const req = {
      user: { id: "f47ac10b-58cc-4372-a567-0e02b2c3d479" },
      body: {
        type: "Food",
        amount: 50,
        name: "Lunch",
        description: "Lunch at a restaurant",
        category: "Dining",
        date: "2023-10-01",
      },
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as Partial<Response>;

    const next = jest.fn();

    await expenseController.postExpense(req as Request, res as Response, next);

    expect(mockExpenseService.addExpenseToDatabase).toHaveBeenCalledWith({
      userId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      type: "Food",
      amount: 50,
      name: "Lunch",
      description: "Lunch at a restaurant",
      category: "Dining",
      date: "2023-10-01",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      message: "Expense added successfully",
    });
  });

  it("should handle errors in postExpense", async () => {
    const mockExpenseService = {
      addExpenseToDatabase: jest
        .fn()
        .mockRejectedValue(new Error("Error adding expense")),
    } as unknown as ExpenseService;

    const expenseController = new ExpenseController(mockExpenseService);

    const req = {
      user: { id: "f47ac10b-58cc-4372-a567-0e02b2c3d479" },
      body: {
        type: "Food",
        amount: 50,
        name: "Lunch",
        description: "Lunch at a restaurant",
        category: "Dining",
        date: "2023-10-01",
      },
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as Partial<Response>;

    const next = jest.fn();

    await expenseController.postExpense(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(new Error("Error adding expense"));
  });

  it("should call getExpensesFromDatabase with correct userId", async () => {
    const mockExpenseService = {
      getExpensesFromDatabase: jest.fn().mockResolvedValue([
        {
          type: "Food",
          amount: 50,
          name: "Lunch",
          description: "Lunch at a restaurant",
          category: "Dining",
          date: "2023-10-01",
        },
      ]),
    } as unknown as ExpenseService;
    const expenseController = new ExpenseController(mockExpenseService);
    const req = {
      user: { id: "f47ac10b-58cc-4372-a567-0e02b2c3d479" },
      body: {},
    } as Partial<Request>;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as Partial<Response>;
    const next = jest.fn();
    await expenseController.getExpenses(req as Request, res as Response, next);
    expect(mockExpenseService.getExpensesFromDatabase).toHaveBeenCalledWith(
      "f47ac10b-58cc-4372-a567-0e02b2c3d479"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith([
      {
        type: "Food",
        amount: 50,
        name: "Lunch",
        description: "Lunch at a restaurant",
        category: "Dining",
        date: "2023-10-01",
      },
    ]);
  });
});
