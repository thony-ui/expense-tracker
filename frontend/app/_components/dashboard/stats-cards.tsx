import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  WalletIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency } from "@/lib/utils";
import { ITransaction } from "@/lib/types";
import { useGetTransactions } from "@/app/queries/use-get-transactions";
import { useMemo } from "react";

function sumTransactions(transactions: ITransaction[]) {
  return transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );
}

export function StatsCards() {
  const { data: expenseTransactions = [] } = useGetTransactions({
    transactionType: "expense",
  });
  const { data: incomeTransactions = [] } = useGetTransactions({
    transactionType: "income",
  });

  const stats = useMemo(
    () => ({
      totalIncome: sumTransactions(incomeTransactions),
      totalExpenses: sumTransactions(expenseTransactions),
      transactionCount: expenseTransactions.length + incomeTransactions.length,
      totalBalance:
        sumTransactions(incomeTransactions) -
        sumTransactions(expenseTransactions),
    }),
    [incomeTransactions, expenseTransactions]
  );

  const cards = [
    {
      title: "Total Balance",
      value: stats.totalBalance,
      icon: WalletIcon,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Income",
      value: stats.totalIncome,
      icon: ArrowUpIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Expenses",
      value: stats.totalExpenses,
      icon: ArrowDownIcon,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Transactions",
      value: stats.transactionCount,
      icon: CreditCardIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      isCount: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <p className="break-words ">
                {card.isCount ? card.value : formatCurrency(card.value)}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
