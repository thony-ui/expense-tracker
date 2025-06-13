import { IExpense } from "../domain/expense.interface";
import { ExpenseService } from "../domain/expense.service";

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
    };

    const expenseService = new ExpenseService(mockExpenseRepository);

    const expenseData: IExpense = {
      userId: "123",
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
    };

    const expenseService = new ExpenseService(mockExpenseRepository);

    const expenseData: IExpense = {
      userId: "123",
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
});
