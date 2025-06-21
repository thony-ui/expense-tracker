"use client";

import type React from "react";

import { useState } from "react";
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
import { usePostTransaction } from "@/app/mutations/use-post-transaction";

import { ArrowBigRight } from "lucide-react";

import PopoverExchangeRateData from "../popover-exchange-rate-data";

interface AddTransactionFormProps {
  onSuccess: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AddTransactionForm({
  onSuccess,
  setOpen,
}: AddTransactionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    type: "expense" as "income" | "expense",
  });
  const [exchangeRate, setExchangeRate] = useState<{
    rate: number;
    targetCurrency: string;
  }>({
    rate: 1,
    targetCurrency: "Singapore Dollar",
  });

  const { mutateAsync: postTransaction } = usePostTransaction();

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
      type: formData.type,
      base_currency: "Singapore Dollar",
      converted_currency: exchangeRate.targetCurrency,
      base_amount: Number.parseFloat(formData.amount),
      converted_amount: Number.parseFloat(
        (Number.parseFloat(formData.amount) / exchangeRate.rate).toFixed(2)
      ),
      exchange_rate: exchangeRate.rate,
    };

    await postTransaction(transaction);
    setIsLoading(false);
    onSuccess();
  };

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
            onValueChange={(value: "income" | "expense") =>
              setFormData({ ...formData, type: value })
            }
          >
            <SelectTrigger>
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
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData({ ...formData, category: value })
          }
        >
          <SelectTrigger>
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
        />
      </div>

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
          {isLoading ? "Adding..." : "Add Transaction"}
        </Button>
      </div>
    </form>
  );
}
