"use client";

import { StatsCards } from "./stats-cards";
import { IncomeExpenseChart } from "../charts/income-expense-chart";
import { useUser } from "@/components/contexts/user-context";
import { useGetTransactions } from "@/app/queries/use-get-transactions";
import { useState, useMemo } from "react";
import { Transactions } from "../transactions";

type TTransactionType = "expense" | "income" | "all";

export function DashboardOverview() {
  // TODO: Replace with real data fetching logic. For now we use useUser to check if the data obtained from the user is loading.
  const { isLoading } = useUser();
  const { data: expenseTransactions = [] } = useGetTransactions({
    transactionType: "expense",
    limit: 5,
  });
  const { data: incomeTransactions = [] } = useGetTransactions({
    transactionType: "income",
    limit: 5,
  });
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
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[80vh]">
        <p className="text-gray-500">Loading dashboard data, please wait...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">
          Track your expenses and manage your budget
        </p>
      </div>

      <StatsCards />

      <IncomeExpenseChart />

      <Transactions
        title="Recent Transactions"
        transactions={transactions.slice(0, 5)}
        setDataType={setDataType}
        setSearchTransaction={setSearchTransaction}
        dataType={dataType}
      />
    </div>
  );
}
