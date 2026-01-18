"use client";

import { Transactions } from "@/app/_components/transactions";
import { useGetTransactions } from "@/app/queries/use-get-transactions";
import Pagination from "@/app/shared/_components/pagination";
import { useState, useMemo } from "react";

type TTransactionType = "expense" | "income" | "all";

export function TransactionsOverview() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: expenseTransactions = [], isLoading: isLoadingExpenses } =
    useGetTransactions({
      transactionType: "expense",
      limit: 5,
      offSet: (currentPage - 1) * 5,
    });
  const { data: incomeTransactions = [], isLoading: isLoadingIncome } =
    useGetTransactions({
      transactionType: "income",
      limit: 5,
      offSet: (currentPage - 1) * 5,
    });
  const [dataType, setDataType] = useState<TTransactionType>("all");
  const [searchTransaction, setSearchTransaction] = useState<string>("");
  const transactions = useMemo(() => {
    if (dataType === "expense") {
      return expenseTransactions.filter((transaction) =>
        transaction.description
          .toLowerCase()
          .includes(searchTransaction.toLowerCase()),
      );
    } else if (dataType === "income") {
      return incomeTransactions.filter((transaction) =>
        transaction.description
          .toLowerCase()
          .includes(searchTransaction.toLowerCase()),
      );
    }
    return [...expenseTransactions, ...incomeTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter((transaction) =>
        transaction.description
          .toLowerCase()
          .includes(searchTransaction.toLowerCase()),
      );
  }, [expenseTransactions, incomeTransactions, dataType, searchTransaction]);
  if (isLoadingExpenses || isLoadingIncome) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[80vh]">
        <p className="text-gray-500">Loading Transactions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Your Transactions
        </h1>
        <p className="text-gray-600">Track your expenses and income</p>
      </div>
      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        transactionsLength={transactions.length}
      />
      <Transactions
        title={"Transactions Overview"}
        transactions={transactions}
        setDataType={setDataType}
        setSearchTransaction={setSearchTransaction}
        dataType={dataType}
      />
    </div>
  );
}
