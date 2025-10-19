"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants";
import type { ITransaction } from "@/lib/types";
import { useGetTransaction } from "@/app/queries/use-get-transaction";
import { useUpdateTransaction } from "@/app/mutations/use-update-transaction";
import PopoverExchangeRateData from "../popover-exchange-rate-data";
import { ArrowBigRight } from "lucide-react";
import { useGetSavingsGoals } from "@/app/queries/use-get-savings-goals";

interface EditTransactionFormProps {
  onSuccess: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  transactionId: string;
}

export function EditTransactionForm({
  onSuccess,
  setOpen,
  transactionId,
}: EditTransactionFormProps) {
  const { data: transaction, isLoading: isLoadingTransaction } =
    useGetTransaction(transactionId);

  const { mutateAsync: updateTransaction } = useUpdateTransaction();
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    type: "expense",
    allocateToGoal: false,
    savingsGoalId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<{
    rate: number;
    targetCurrency: string;
  }>({
    rate: 1,
    targetCurrency: "Singapore Dollar",
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        name: transaction.name,
        amount: transaction.base_amount.toString(),
        description: transaction.description,
        category: transaction.category,
        date: transaction.date,
        type: transaction.type,
        allocateToGoal: transaction.savings_goals ? true : false,
        savingsGoalId: transaction.savings_goals
          ? transaction.savings_goals.id
          : "",
      });
      setExchangeRate({
        rate: transaction.exchange_rate,
        targetCurrency: transaction.converted_currency,
      });
    }
  }, [transaction]);

  const { data: savingsGoals = [] } = useGetSavingsGoals();

  const categories =
    formData.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    const transaction: Omit<ITransaction, "id"> = {
      name: formData.name,
      amount: Number(
        (Number.parseFloat(formData.amount) / exchangeRate.rate).toFixed(2)
      ),
      description: formData.description,
      category: formData.category,
      date: formData.date,
      type: formData.type as "income" | "expense",
      base_currency: "Singapore Dollar",
      converted_currency: exchangeRate.targetCurrency,
      base_amount: Number.parseFloat(formData.amount),
      converted_amount: Number.parseFloat(
        (Number.parseFloat(formData.amount) / exchangeRate.rate).toFixed(2)
      ),
      exchange_rate: exchangeRate.rate,
      savingsGoalId: !formData.allocateToGoal
        ? undefined
        : formData.savingsGoalId || undefined,
    };

    await updateTransaction({ transactionId, transaction });
    setIsLoading(false);
    onSuccess();
  };
  if (isLoadingTransaction) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full">
        Loading...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <PopoverExchangeRateData
          exchangeRate={exchangeRate}
          setExchangeRate={setExchangeRate}
        />
        <ArrowBigRight />
        <p className="font-bold">SGD</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value: "income" | "expense") => {
              if (!value) return;
              setFormData({ ...formData, type: value });
            }}
          >
            <SelectTrigger className="dark:border-gray-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            required
            className="dark:border-gray-500"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="dark:border-gray-500"
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => {
            if (!value) return;
            setFormData({ ...formData, category: value });
          }}
        >
          <SelectTrigger className="dark:border-gray-500">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                <span className="flex items-center gap-2">
                  <span>{category.icon}</span>
                  {category.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter transaction description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
          className="dark:border-gray-500"
        />
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          style={{ width: "100%", maxWidth: "100%" }}
          required
          className="dark:border-gray-500"
        />
      </div>

      {formData.type === "income" && savingsGoals.length > 0 && (
        <div className="space-y-3 p-4 border rounded-lg bg-green-50 dark:bg-green-700/20">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="allocateToGoal"
              checked={formData.allocateToGoal}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  allocateToGoal: e.target.checked,
                })
              }
              className="w-4 h-4 rounded"
            />
            <Label
              htmlFor="allocateToGoal"
              className="cursor-pointer font-medium"
            >
              💰 Allocate to Savings Goal
            </Label>
          </div>

          {formData.allocateToGoal && (
            <div>
              <p className="text-xs mb-2 font-bold">Select Savings Goal</p>
              <Select
                value={formData.savingsGoalId}
                onValueChange={(value) =>
                  setFormData({ ...formData, savingsGoalId: value })
                }
              >
                <SelectTrigger className="dark:border-gray-500">
                  <SelectValue placeholder="Choose a goal..." />
                </SelectTrigger>
                <SelectContent>
                  {savingsGoals.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      <div className="">
                        <span className="font-medium">{goal.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(false)}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Edit Transaction"}
        </Button>
      </div>
    </form>
  );
}
