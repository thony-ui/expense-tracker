"use client";

import { useParams } from "next/navigation";
import { DashBoardAndTransactionLayout } from "../../_components/layout/dashboard-and-transaction-layout";
import { TransactionDetailView } from "../../_components/transactions/transaction-detail-view";
import { useGetSavingsGoalById } from "../../queries/use-get-savings-goals";
import { useGetTransactionsBySavingsGoalId } from "../../queries/use-get-transactions";
import { formatCurrency } from "@/lib/utils";

export default function SavingsGoalTransactionsPage() {
  const params = useParams<{ goalId: string }>();
  const goalId = params?.goalId;

  const { data: goal, isLoading: isLoadingGoal } =
    useGetSavingsGoalById(goalId);
  const { data: transactions = [], isLoading: isLoadingTransactions } =
    useGetTransactionsBySavingsGoalId(goalId ?? "");

  const currentAmount = transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );
  const progress = goal ? (currentAmount / goal.targetAmount) * 100 : 0;

  if (isLoadingGoal || isLoadingTransactions) {
    return (
      <DashBoardAndTransactionLayout>
        <div className="flex h-[70vh] items-center justify-center text-muted-foreground">
          Loading savings goal transactions...
        </div>
      </DashBoardAndTransactionLayout>
    );
  }

  if (!goal) {
    return (
      <DashBoardAndTransactionLayout>
        <div className="flex h-[70vh] items-center justify-center text-muted-foreground">
          Savings goal not found.
        </div>
      </DashBoardAndTransactionLayout>
    );
  }

  return (
    <DashBoardAndTransactionLayout>
      <TransactionDetailView
        title={goal.title}
        subtitle="Track the transactions contributing to this savings goal."
        backHref="/savings-goals"
        backLabel="Back to savings goals"
        summary={[
          {
            label: "Target",
            value: formatCurrency(goal.targetAmount),
            description: `${progress.toFixed(1)}% complete`,
            icon: "piggy-bank",
          },
          {
            label: "Current",
            value: formatCurrency(currentAmount),
            description: "Total allocated so far",
            icon: "wallet",
          },
          {
            label: "Remaining",
            value: formatCurrency(goal.targetAmount - currentAmount),
            description:
              goal.targetAmount - currentAmount <= 0
                ? "Goal achieved"
                : "Still to fund",
            icon: "calendar",
          },
          {
            label: "Deadline",
            value: new Date(goal.deadline).toLocaleDateString(),
            description: goal.category || "No category set",
            icon: "calendar",
          },
        ]}
        transactions={transactions}
        emptyTitle="No savings goal transactions yet"
        emptyDescription="Income transactions allocated to this savings goal will appear here."
        accentClassName={
          progress >= 100
            ? "border-green-500"
            : progress >= 90
              ? "border-yellow-500"
              : undefined
        }
      />
    </DashBoardAndTransactionLayout>
  );
}
