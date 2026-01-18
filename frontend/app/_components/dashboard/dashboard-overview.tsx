"use client";

import { StatsCards } from "./stats-cards";
import { useUser } from "@/components/contexts/user-context";
import { useGetTransactions } from "@/app/queries/use-get-transactions";
import { SavingsGoalCard } from "../goals/savings-goal-card";
import { toast } from "react-toastify";
import {
  invalidateSavingsGoals,
  useGetSavingsGoals,
} from "@/app/queries/use-get-savings-goals";
import { usePostSavingsGoal } from "@/app/mutations/use-post-savings-goal";
import { useUpdateSavingsGoal } from "@/app/mutations/use-update-savings-goal";
import {
  invalidateBudgets,
  useGetBudgets,
} from "@/app/queries/use-get-budgets";
import { BudgetCard } from "../budgets/budget-card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Wallet, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useDeleteTransaction } from "@/app/mutations/use-delete-transaction";
import { invalidateTransactions } from "@/app/queries/use-get-transactions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditTransactionForm } from "../forms/edit-transaction-form";
import DeleteTransactionModal from "./modals/delete-transaction-modal";
import { AddTransactionDialog } from "../forms/add-transaction-dialog";
import { SavingsGoalItem } from "../goals/savings-goal-item";

export function DashboardOverview() {
  const { isLoading } = useUser();
  const { data: transactions = [] } = useGetTransactions({ limit: 5 });
  const { data: savingsGoals = [] } = useGetSavingsGoals();
  const { data: budgets = [] } = useGetBudgets();
  const { mutateAsync: postSavingsGoal } = usePostSavingsGoal();
  const { mutateAsync: updateSavingsGoal } = useUpdateSavingsGoal();
  const { mutateAsync: deleteTransaction } = useDeleteTransaction();

  const [editingTransactionId, setEditingTransactionId] = useState<
    string | null
  >(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState<
    string | null
  >(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Get budgets that are approaching limit (>80%) or over budget
  const alertBudgets = budgets.filter((b) => b.percentage >= 80);

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
    },
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

  const handleDeleteTransaction = (transactionId: string) => {
    setDeletingTransactionId(transactionId);
    setIsDeleteModalOpen(true);
  };

  const handleEditTransaction = (transactionId: string) => {
    setEditingTransactionId(transactionId);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setEditingTransactionId(null);
    invalidateTransactions();
    invalidateBudgets();
    invalidateSavingsGoals();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[80vh]">
        <p className="text-gray-500">Loading dashboard data, please wait...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Financial Overview
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Track your budgets, savings, and spending at a glance
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Budget Alerts */}
      {alertBudgets.length > 0 && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <CardHeader>
            <CardTitle className="text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Budget Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
              {alertBudgets.length} budget{alertBudgets.length > 1 ? "s" : ""}{" "}
              need your attention
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {alertBudgets.slice(0, 2).map((budget) => (
                <div
                  key={budget.id}
                  className="text-sm bg-white dark:bg-gray-800 p-3 rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{budget.name}</span>
                    <span
                      className={
                        budget.percentage >= 100
                          ? "text-red-600 dark:text-red-400 font-bold"
                          : "text-yellow-600 dark:text-yellow-400 font-bold"
                      }
                    >
                      {budget.percentage.toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    ${budget.spent.toFixed(2)} of ${budget.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <Link href="/budgets">
              <Button
                variant="link"
                className="mt-2 p-0 h-auto text-yellow-700 dark:text-yellow-300"
              >
                View all budgets →
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Budgets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-semibold">
              Active Budgets
            </CardTitle>
            <Link href="/budgets">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {budgets.length === 0 ? (
              <div className="text-center py-8">
                <Wallet className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 mb-3">No budgets yet</p>
                <Link href="/budgets">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Budget
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {budgets.slice(0, 3).map((budget) => (
                  <BudgetCard key={budget.id} budget={budget} />
                ))}
                {budgets.length > 3 && (
                  <Link href="/budgets">
                    <Button variant="outline" className="w-full" size="sm">
                      View {budgets.length - 3} more budget
                      {budgets.length - 3 > 1 ? "s" : ""}
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Savings Goals */}
        <SavingsGoalItem
          goals={savingsGoals}
          onAddGoal={handleAddGoal}
          onEditGoal={handleEditGoal}
          showViewAll={true}
          maxDisplay={3}
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">
            Recent Transactions
          </CardTitle>
          <Link href="/transactions">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No transactions yet
            </p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex justify-between items-center py-2 border-b last:border-0 group"
                >
                  <div className="flex-1">
                    <p className="font-medium">{transaction.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()} •{" "}
                      {transaction.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold ${
                        transaction.type === "income"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {transaction.amount.toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditTransaction(transaction.id)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Transaction Modal */}
      {editingTransactionId && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
            </DialogHeader>
            <EditTransactionForm
              transactionId={editingTransactionId}
              onSuccess={handleEditSuccess}
              setOpen={setIsEditModalOpen}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteTransactionModal
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        transactionId={deletingTransactionId!}
      />
    </div>
  );
}
