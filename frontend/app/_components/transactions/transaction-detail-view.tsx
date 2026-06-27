"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, PiggyBank, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ITransaction } from "@/lib/types";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

type SummaryItem = {
  label: string;
  value: string;
  description?: string;
  icon?: "wallet" | "piggy-bank" | "calendar";
};

type TransactionTypeFilter = "all" | "income" | "expense";

interface TransactionDetailViewProps {
  title: string;
  subtitle: string;
  backHref: string;
  backLabel: string;
  summary: SummaryItem[];
  transactions: ITransaction[];
  emptyTitle: string;
  emptyDescription: string;
  accentClassName?: string;
}

const iconMap = {
  wallet: Wallet,
  "piggy-bank": PiggyBank,
  calendar: CalendarDays,
} as const;

export function TransactionDetailView({
  title,
  subtitle,
  backHref,
  backLabel,
  summary,
  transactions,
  emptyTitle,
  emptyDescription,
  accentClassName,
}: TransactionDetailViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [transactionType, setTransactionType] =
    useState<TransactionTypeFilter>("all");

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return [...transactions]
      .sort((left, right) => {
        return new Date(right.date).getTime() - new Date(left.date).getTime();
      })
      .filter((transaction) => {
        const matchesType =
          transactionType === "all" || transaction.type === transactionType;

        if (!matchesType) return false;

        if (!normalizedSearch) return true;

        return (
          transaction.name.toLowerCase().includes(normalizedSearch) ||
          transaction.description.toLowerCase().includes(normalizedSearch) ||
          transaction.category.toLowerCase().includes(normalizedSearch)
        );
      });
  }, [searchQuery, transactions, transactionType]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Button asChild variant="ghost" size="sm" className="w-fit px-0">
            <Link href={backHref}>
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => {
          const Icon = item.icon ? iconMap[item.icon] : null;

          return (
            <Card key={item.label} className={accentClassName}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </CardTitle>
                {Icon ? (
                  <Icon className="h-4 w-4 text-muted-foreground" />
                ) : null}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                {item.description ? (
                  <CardDescription className="mt-1">
                    {item.description}
                  </CardDescription>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            All transactions linked to this record, newest first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-md">
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by name, description, or category..."
                  className="pl-3"
                />
              </div>
              <Select
                value={transactionType}
                onValueChange={(value) =>
                  setTransactionType(value as TransactionTypeFilter)
                }
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All transactions</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : null}

          {filteredTransactions.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed p-10 text-center text-muted-foreground">
              <p className="font-medium text-foreground">{emptyTitle}</p>
              <p className="mt-1 text-sm">{emptyDescription}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction, index) => (
                <div key={transaction.id}>
                  {index > 0 ? <Separator className="mb-4" /> : null}
                  <div className="flex flex-col gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/40 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-foreground">
                          {transaction.name}
                        </p>
                        <Badge variant="outline" className="capitalize">
                          {transaction.type}
                        </Badge>
                        <Badge
                          variant={
                            transaction.type === "income"
                              ? "default"
                              : "secondary"
                          }
                          className={cn(
                            transaction.type === "income"
                              ? "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-700"
                              : "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-700",
                          )}
                        >
                          {transaction.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {transaction.description || "No description provided"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-1 text-left lg:items-end lg:text-right">
                      <span
                        className={cn(
                          "text-lg font-semibold",
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600",
                        )}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {transaction.base_amount.toFixed(2)}{" "}
                        {transaction.base_currency} at rate{" "}
                        {transaction.exchange_rate}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
