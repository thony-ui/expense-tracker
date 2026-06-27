"use client";

import { useParams } from "next/navigation";
import { DashBoardAndTransactionLayout } from "../../_components/layout/dashboard-and-transaction-layout";
import { TransactionDetailView } from "../../_components/transactions/transaction-detail-view";
import { useGetBudget } from "../../queries/use-get-budget";
import { useGetTransactionsByBudgetId } from "../../queries/use-get-transactions";
import { formatCurrency } from "@/lib/utils";

export default function BudgetTransactionsPage() {
  const params = useParams<{ budgetId: string }>();
  const budgetId = params?.budgetId;

  const { data: budget, isLoading: isLoadingBudget } = useGetBudget(budgetId);
  const { data: transactions = [], isLoading: isLoadingTransactions } =
    useGetTransactionsByBudgetId(budgetId ?? "");

  if (isLoadingBudget || isLoadingTransactions) {
    return (
      <DashBoardAndTransactionLayout>
        <div className="flex h-[70vh] items-center justify-center text-muted-foreground">
          Loading budget transactions...
        </div>
      </DashBoardAndTransactionLayout>
    );
  }

  if (!budget) {
    return (
      <DashBoardAndTransactionLayout>
        <div className="flex h-[70vh] items-center justify-center text-muted-foreground">
          Budget not found.
        </div>
      </DashBoardAndTransactionLayout>
    );
  }

  return (
    <DashBoardAndTransactionLayout>
      <TransactionDetailView
        title={budget.name}
        subtitle="View every transaction assigned to this budget."
        backHref="/budgets"
        backLabel="Back to budgets"
        summary={[
          {
            label: "Budget",
            value: formatCurrency(budget.amount),
            description: `${budget.periodType} budget`,
            icon: "wallet",
          },
          {
            label: "Spent",
            value: formatCurrency(budget.spent),
            description: `${budget.percentage.toFixed(1)}% used`,
            icon: "calendar",
          },
          {
            label: "Remaining",
            value: formatCurrency(budget.remaining),
            description:
              budget.remaining < 0 ? "Over budget" : "Still available",
            icon: "piggy-bank",
          },
          {
            label: "Period",
            value: budget.periodType,
            description: `${new Date(budget.startDate).toLocaleDateString()} - ${new Date(budget.endDate).toLocaleDateString()}`,
            icon: "calendar",
          },
        ]}
        transactions={transactions}
        emptyTitle="No budget transactions yet"
        emptyDescription="Transactions assigned to this budget will appear here once they are created."
        accentClassName={
          budget.percentage >= 100
            ? "border-red-500"
            : budget.percentage >= 90
              ? "border-yellow-500"
              : undefined
        }
      />
    </DashBoardAndTransactionLayout>
  );
}
