"use client";

import { StatsCards } from "./stats-cards";
import { IncomeExpenseChart } from "../charts/income-expense-chart";
import { useUser } from "@/components/contexts/user-context";
import {
  invalidateTransactions,
  useGetTransactions,
} from "@/app/queries/use-get-transactions";
import { useState, useMemo } from "react";
import { Transactions } from "../transactions";
import { CashFlowSankey } from "../charts/cashflow-sankey";
import { SavingsGoalCard } from "../goals/savings-goal-card";
import { NaturalLanguageInput } from "../forms/natural-language-input";
import { usePostTransaction } from "@/app/mutations/use-post-transaction";
import { toast } from "react-toastify";
import { useGetSavingsGoals } from "@/app/queries/use-get-savings-goals";
import { usePostSavingsGoal } from "@/app/mutations/use-post-savings-goal";
import { useUpdateSavingsGoal } from "@/app/mutations/use-update-savings-goal";
import { useDeleteSavingsGoal } from "@/app/mutations/use-delete-savings-goal";

type TTransactionType = "expense" | "income" | "all";

export function DashboardOverview() {
  const { isLoading } = useUser();
  const { data: expenseTransactions = [] } = useGetTransactions({
    transactionType: "expense",
    limit: 5,
  });
  const { data: incomeTransactions = [] } = useGetTransactions({
    transactionType: "income",
    limit: 5,
  });
  const { mutateAsync: postTransaction } = usePostTransaction();

  // Savings Goals API hooks
  const { data: savingsGoals = [] } = useGetSavingsGoals();
  const { mutateAsync: postSavingsGoal } = usePostSavingsGoal();
  const { mutateAsync: updateSavingsGoal } = useUpdateSavingsGoal();
  const { mutateAsync: deleteSavingsGoal } = useDeleteSavingsGoal();

  const [dataType, setDataType] = useState<TTransactionType>("all");
  const [searchTransaction, setSearchTransaction] = useState<string>("");

  const transactions = useMemo(() => {
    if (dataType === "expense") {
      return expenseTransactions.filter((transaction) =>
        transaction.description
          .toLowerCase()
          .includes(searchTransaction.toLowerCase())
      );
    } else if (dataType === "income") {
      return incomeTransactions.filter((transaction) =>
        transaction.description
          .toLowerCase()
          .includes(searchTransaction.toLowerCase())
      );
    }
    return [...expenseTransactions, ...incomeTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter((transaction) =>
        transaction.description
          .toLowerCase()
          .includes(searchTransaction.toLowerCase())
      );
  }, [expenseTransactions, incomeTransactions, dataType, searchTransaction]);

  const handleNaturalLanguageTransaction = async (data: {
    amount: number;
    description: string;
    category: string;
    date: string;
    type?: "expense" | "income";
  }) => {
    try {
      await postTransaction({
        name: data.description,
        amount: data.amount,
        description: data.description,
        category: data.category,
        date: data.date,
        type: data.type || "expense",
        base_currency: "Singapore Dollar",
        converted_currency: "Singapore Dollar",
        base_amount: data.amount,
        converted_amount: data.amount,
        exchange_rate: 1,
      });
      toast.success("Transaction added successfully!");
      invalidateTransactions();
    } catch (error) {
      toast.error("Failed to add transaction");
    }
  };

  const handleAddGoal = async (goal: {
    title: string;
    targetAmount: number;
    deadline: string;
    category?: string;
  }) => {
    try {
      await postSavingsGoal({
        ...goal,
      });
      toast.success("Savings goal created!");
    } catch (error) {
      toast.error("Failed to create savings goal");
    }
  };

  const handleEditGoal = async (
    id: string,
    goal: {
      title?: string;
      targetAmount?: number;
      deadline?: string;
      category?: string;
    }
  ) => {
    try {
      await updateSavingsGoal({
        goalId: id,
        updatedGoal: goal,
      });
      toast.success("Goal updated!");
    } catch (error) {
      toast.error("Failed to update goal");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[80vh]">
        <p className="text-gray-500">Loading dashboard data, please wait...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your expenses and manage your budget
        </p>
      </div>

      {/* Natural Language Input */}
      <NaturalLanguageInput
        onTransactionParsed={handleNaturalLanguageTransaction}
      />

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeExpenseChart />
        <Transactions
          title="Recent Transactions"
          transactions={transactions.slice(0, 3)}
          setDataType={setDataType}
          setSearchTransaction={setSearchTransaction}
          dataType={dataType}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CashFlowSankey />
        <SavingsGoalCard
          goals={savingsGoals}
          onAddGoal={handleAddGoal}
          onEditGoal={handleEditGoal}
        />
      </div>
    </div>
  );
}
