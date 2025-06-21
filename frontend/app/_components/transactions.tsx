import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ITransaction } from "@/lib/types";
import { TransactionDropdownMenu } from "./dashboard/transaction-dropdown-menu";

type TTransactionType = "expense" | "income" | "all";

interface IRecentTransactionsProps {
  title: string;
  transactions: ITransaction[];

  setDataType: React.Dispatch<React.SetStateAction<TTransactionType>>;
  setSearchTransaction: React.Dispatch<React.SetStateAction<string>>;

  dataType: TTransactionType;
}

export function Transactions({
  title,
  transactions,
  setDataType,
  setSearchTransaction,
  dataType,
}: IRecentTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center flex-wrap gap-2">
          <CardTitle className="text-nowrap">{title}</CardTitle>
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
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-4 flex-wrap"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-bold text-gray-900">
                      Name: {transaction.name}
                    </p>
                    <p className="text-gray-700">
                      Description: {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      Date: {formatDate(transaction.date)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Base Amount: {transaction.base_amount}{" "}
                      {transaction.base_currency}
                    </p>
                    <p className="text-sm text-gray-500">
                      Exchange Rate: {transaction.exchange_rate}
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
