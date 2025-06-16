import type { Request, Response, NextFunction } from "express";
import { TransactionController } from "../domain/transaction.controller";
import { ITransaction } from "../domain/transaction.interface";
import { TransactionRepository } from "../domain/transaction.repository";
import { TransactionService } from "../domain/transaction.service";

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

describe("Transaction Service", () => {
  it("should add an expense to the database", async () => {
    const mockTransactionRepository = {
      addTransactionToDatabase: jest.fn().mockResolvedValue(undefined),
    } as unknown as TransactionRepository;

    const expenseService = new TransactionService(mockTransactionRepository);

    const expenseData: ITransaction = {
      userId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      type: "Food",
      amount: 50,
      name: "Lunch",
      description: "Lunch at a restaurant",
      category: "Dining",
      date: "2023-10-01",
    };

    await expenseService.addTransactionToDatabase(expenseData);

    expect(
      mockTransactionRepository.addTransactionToDatabase
    ).toHaveBeenCalledWith(expenseData);
  });
  it("should throw an error if adding expense fails", async () => {
    const mockTransactionRepository = {
      addTransactionToDatabase: jest
        .fn()
        .mockRejectedValue(new Error("Database error")),
    } as unknown as TransactionRepository;

    const expenseService = new TransactionService(mockTransactionRepository);

    const expenseData: ITransaction = {
      userId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      type: "Food",
      amount: 50,
      name: "Lunch",
      description: "Lunch at a restaurant",
      category: "Dining",
      date: "2023-10-01",
    };

    await expect(
      expenseService.addTransactionToDatabase(expenseData)
    ).rejects.toThrow("Database error");
  });
  it("should get expenses from the database", async () => {
    const mockTransactionRepository = {
      getTransactionsFromDatabase: jest.fn().mockResolvedValue([
        {
          type: "Food",
          amount: 50,
          name: "Lunch",
          description: "Lunch at a restaurant",
          category: "Dining",
          date: "2023-10-01",
        },
      ]),
    } as unknown as TransactionRepository;

    const expenseService = new TransactionService(mockTransactionRepository);

    const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
    const expenses = await expenseService.getTransactionsFromDatabase(userId);

    expect(
      mockTransactionRepository.getTransactionsFromDatabase
    ).toHaveBeenCalledWith(userId, undefined);
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
  it("should get yearly expenses from the database", async () => {
    const mockTransactionRepository = {
      getYearlyTransactionsFromDatabase: jest.fn().mockResolvedValue([
        {
          type: "Food",
          amount: 50,
          name: "Lunch",
          description: "Lunch at a restaurant",
          category: "Dining",
          date: "2023-10-01",
        },
      ]),
    } as unknown as TransactionRepository;
    const expenseService = new TransactionService(mockTransactionRepository);
    const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
    const expenses = await expenseService.getYearlyTransactionsFromDatabase(
      userId,
      undefined
    );
    expect(
      mockTransactionRepository.getYearlyTransactionsFromDatabase
    ).toHaveBeenCalledWith(userId, undefined);
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
  it("should get monthly expenses from the database", async () => {
    const mockTransactionRepository = {
      getMonthlyTransactionsFromDatabase: jest.fn().mockResolvedValue([
        {
          type: "Food",
          amount: 50,
          name: "Lunch",
          description: "Lunch at a restaurant",
          category: "Dining",
          date: "2023-10-01",
        },
      ]),
    } as unknown as TransactionRepository;
    const expenseService = new TransactionService(mockTransactionRepository);
    const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
    const expenses = await expenseService.getMonthlyTransactionsFromDatabase(
      userId,
      undefined
    );
    expect(
      mockTransactionRepository.getMonthlyTransactionsFromDatabase
    ).toHaveBeenCalledWith(userId, undefined);
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
  it("should get weekly expenses from the database", async () => {
    const mockTransactionRepository = {
      getWeeklyTransactionsFromDatabase: jest.fn().mockResolvedValue([
        {
          type: "Food",
          amount: 50,
          name: "Lunch",
          description: "Lunch at a restaurant",
          category: "Dining",
          date: "2023-10-01",
        },
      ]),
    } as unknown as TransactionRepository;
    const expenseService = new TransactionService(mockTransactionRepository);
    const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
    const expenses = await expenseService.getWeeklyTransactionsFromDatabase(
      userId,
      undefined
    );
    expect(
      mockTransactionRepository.getWeeklyTransactionsFromDatabase
    ).toHaveBeenCalledWith(userId, undefined);
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
  it("should get daily expenses from the database", async () => {
    const mockTransactionRepository = {
      getDailyTransactionsFromDatabase: jest.fn().mockResolvedValue([
        {
          type: "Food",
          amount: 50,
          name: "Lunch",
          description: "Lunch at a restaurant",
          category: "Dining",
          date: "2023-10-01",
        },
      ]),
    } as unknown as TransactionRepository;
    const expenseService = new TransactionService(mockTransactionRepository);
    const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
    const expenses = await expenseService.getDailyTransactionsFromDatabase(
      userId,
      undefined
    );
    expect(
      mockTransactionRepository.getDailyTransactionsFromDatabase
    ).toHaveBeenCalledWith(userId, undefined);
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
    const mockTransactionRepository = {
      getTransactionsFromDatabase: jest
        .fn()
        .mockRejectedValue(new Error("Database error")),
    } as unknown as TransactionRepository;

    const expenseService = new TransactionService(mockTransactionRepository);

    const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

    await expect(
      expenseService.getTransactionsFromDatabase(userId)
    ).rejects.toThrow("Database error");
  });
});

describe("Transaction Controller", () => {
  it("should call addTransactionToDatabase with correct parameters", async () => {
    const mockTransactionService = {
      addTransactionToDatabase: jest.fn().mockResolvedValue(undefined),
    } as unknown as TransactionService;

    const expenseController = new TransactionController(mockTransactionService);

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
      query: {},
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as Partial<Response>;

    const next = jest.fn();

    await expenseController.postTransaction(
      req as Request,
      res as Response,
      next
    );

    expect(
      mockTransactionService.addTransactionToDatabase
    ).toHaveBeenCalledWith({
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
      message: "Transaction added successfully",
    });
  });

  it("should handle errors in postTransaction", async () => {
    const mockTransactionService = {
      addTransactionToDatabase: jest
        .fn()
        .mockRejectedValue(new Error("Error adding expense")),
    } as unknown as TransactionService;

    const expenseController = new TransactionController(mockTransactionService);

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
      query: {},
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as Partial<Response>;

    const next = jest.fn();

    await expenseController.postTransaction(
      req as Request,
      res as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(new Error("Error adding expense"));
  });

  it("should call getTransactionsFromDatabase with correct userId", async () => {
    const mockTransactionService = {
      getTransactionsFromDatabase: jest.fn().mockResolvedValue([
        {
          type: "Food",
          amount: 50,
          name: "Lunch",
          description: "Lunch at a restaurant",
          category: "Dining",
          date: "2023-10-01",
        },
      ]),
    } as unknown as TransactionService;
    const expenseController = new TransactionController(mockTransactionService);
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
    await expenseController.getTransactions(
      req as Request,
      res as Response,
      next
    );
    expect(
      mockTransactionService.getTransactionsFromDatabase
    ).toHaveBeenCalledWith("f47ac10b-58cc-4372-a567-0e02b2c3d479", undefined);
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
  it("should filter expenses by transaction type", async () => {
    const mockTransactionService = {
      getTransactionsFromDatabase: jest.fn().mockResolvedValue([
        {
          type: "Food",
          amount: 50,
          name: "Lunch",
          description: "Lunch at a restaurant",
          category: "Dining",
          date: "2023-10-01",
        },
      ]),
    } as unknown as TransactionService;

    const expenseController = new TransactionController(mockTransactionService);

    const req = {
      user: { id: "f47ac10b-58cc-4372-a567-0e02b2c3d479" },
      body: {},
      query: { transactionType: "Food" },
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as Partial<Response>;

    const next = jest.fn();

    await expenseController.getTransactions(
      req as Request,
      res as Response,
      next
    );

    expect(
      mockTransactionService.getTransactionsFromDatabase
    ).toHaveBeenCalledWith("f47ac10b-58cc-4372-a567-0e02b2c3d479", "Food");
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
  it("should return an empty array if the transation type does not match", async () => {
    const mockTransactionService = {
      getTransactionsFromDatabase: jest.fn().mockResolvedValue([]),
    } as unknown as TransactionService;

    const expenseController = new TransactionController(mockTransactionService);

    const req = {
      user: { id: "f47ac10b-58cc-4372-a567-0e02b2c3d479" },
      body: {},
      query: { transactionType: "NonExistentType" },
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as Partial<Response>;

    const next = jest.fn();

    await expenseController.getTransactions(
      req as Request,
      res as Response,
      next
    );

    expect(
      mockTransactionService.getTransactionsFromDatabase
    ).toHaveBeenCalledWith(
      "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "NonExistentType"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith([]);
  });
});
