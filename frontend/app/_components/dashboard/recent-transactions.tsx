import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useGetTransactions } from "@/app/queries/use-get-transactions";
import { TransactionDropdownMenu } from "./transaction-dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type TTransactionType = "expense" | "income" | "all";

export function RecentTransactions() {
  const { data: expenseTransactions = [] } = useGetTransactions({
    transactionType: "expense",
  });
  const { data: incomeTransactions = [] } = useGetTransactions({
    transactionType: "income",
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
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center flex-wrap gap-2">
          <CardTitle className="text-nowrap">Recent Transactions</CardTitle>
          <div className="flex gap-2 flex-wrap items-center">
            <div className="flex items-center border px-[2px] gap-2 rounded-md">
              <Input
                className="w-[200px] placeholder:text-[14px] outline-none ring-0 border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent shadow-none"
                placeholder="Search Transaction..."
                onChange={(e) => setSearchTransaction(e.target.value)}
              />
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-500 mr-1" />
            </div>
            <Select
              value={dataType}
              onValueChange={(value) => {
                setDataType(value as TTransactionType);
              }}
            >
              <SelectTrigger className="w-[180px] h-[37.5px]">
                <SelectValue placeholder="all" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.slice(0, 5).map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-4 flex-wrap"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge
                  variant={
                    transaction.type === "income" ? "default" : "secondary"
                  }
                  className={
                    transaction.type === "income"
                      ? "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-700"
                      : "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-700"
                  }
                >
                  {transaction.category}
                </Badge>
                <span
                  className={`font-semibold ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </span>
                <TransactionDropdownMenu id={transaction.id} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
