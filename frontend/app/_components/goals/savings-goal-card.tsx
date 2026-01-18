"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, Edit2, Trash2, AlertCircle, Search } from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChartFilter, TView } from "../charts/chart-filter";
import DeleteGoalModal from "../dashboard/modals/delete-goal-modal";
import { useGetTransactions } from "@/app/queries/use-get-transactions";
import { ITransaction } from "@/lib/types";
import { useGetTransactionsBySavingsGoalIds } from "@/app/queries/use-get-transaction";

interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  deadline: string;
  category?: string;
}

interface SavingsGoalCardProps {
  goals: SavingsGoal[];
  onAddGoal: (goal: {
    title: string;
    targetAmount: number;
    deadline: string;
    category?: string;
  }) => void;
  onEditGoal: (
    id: string,
    goal: {
      title?: string;
      targetAmount?: number;
      deadline?: string;
      category?: string;
    },
  ) => void;
  showViewAll?: boolean;
  maxDisplay?: number;
}

export function SavingsGoalCard({
  goals,
  onAddGoal,
  onEditGoal,
  showViewAll = false,
  maxDisplay,
}: SavingsGoalCardProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [view, setView] = useState<TView>("monthly");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
  });
  const goalIds = goals.map((goal) => goal.id);
  const { data: allTransactions } = useGetTransactionsBySavingsGoalIds(goalIds);

  const transactionsMap = useMemo(() => {
    if (!allTransactions) return {};
    return allTransactions.reduce(
      (acc, tx) => {
        if (tx.savingsGoalId) {
          if (!acc[tx.savingsGoalId]) acc[tx.savingsGoalId] = [];
          acc[tx.savingsGoalId].push(tx);
        }
        return acc;
      },
      {} as Record<string, ITransaction[]>,
    );
  }, [allTransactions]);

  // Filter goals based on deadline and selected date/view
  const filteredGoals = useMemo(() => {
    const selectedDate = new Date(date);

    // First filter by date/view
    const dateFiltered = goals.filter((goal) => {
      const deadline = new Date(goal.deadline);

      switch (view) {
        case "daily":
          // Show goals with deadline on the selected day
          return deadline.toDateString() === selectedDate.toDateString();

        case "weekly":
          // Show goals with deadline in the selected week
          const weekStart = new Date(selectedDate);
          weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          return deadline >= weekStart && deadline <= weekEnd;

        case "monthly":
          // Show goals with deadline in the selected month
          return (
            deadline.getMonth() === selectedDate.getMonth() &&
            deadline.getFullYear() === selectedDate.getFullYear()
          );

        case "yearly":
          // Show goals with deadline in the selected year
          return deadline.getFullYear() === selectedDate.getFullYear();

        default:
          return true;
      }
    });

    // Then filter by search query
    if (!searchQuery.trim()) return dateFiltered;

    const query = searchQuery.toLowerCase();
    return dateFiltered.filter((goal) => {
      return (
        goal.title?.toLowerCase().includes(query) ||
        goal.category?.toLowerCase().includes(query)
      );
    });
  }, [goals, date, view, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update existing goal
    onEditGoal(editingGoal!.id, {
      title: formData.title,
      targetAmount: parseFloat(formData.targetAmount),
      deadline: formData.deadline,
    });
    setFormData({
      title: "",
      targetAmount: "",
      deadline: "",
    });
    setEditingGoal(null);
    setIsEditOpen(false);
  };

  const handleEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      targetAmount: goal.targetAmount.toString(),
      deadline: goal.deadline,
    });
    setIsEditOpen(true);
  };

  const handleEditOpenChange = () => {
    setEditingGoal(null);
    setIsEditOpen(!isEditOpen);
    setFormData({
      title: "",
      targetAmount: "",
      deadline: "",
    });
  };

  return (
    <>
      <Dialog open={isEditOpen} onOpenChange={handleEditOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Savings Goal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                placeholder="e.g., Emergency Fund"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="targetAmount">Target Amount ($)</Label>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                placeholder="1000.00"
                value={formData.targetAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetAmount: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Update Goal
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {!showViewAll && goals.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search goals by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <ChartFilter
            view={view}
            onViewChange={setView}
            date={date}
            onDateChange={setDate}
          />
        </div>

        {showViewAll && (
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-xl font-semibold">
                  Savings Goals
                </CardTitle>
                <Link href="/savings-goals">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        )}

        {filteredGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[400px] border-2 border-dashed rounded-lg py-12">
            <Target className="h-12 w-12 mb-2 opacity-50" />
            <p>No savings goals</p>
            <p className="text-sm mt-1">
              {goals.length === 0
                ? "Create one to start tracking your progress!"
                : "Try changing the date or view filter"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(maxDisplay
              ? filteredGoals.slice(0, maxDisplay)
              : filteredGoals
            ).map((goal) => {
              const transactionsForSavings = transactionsMap[goal.id] || [];
              const currentAmount = transactionsForSavings
                .map((t) => t.amount)
                .reduce((acc, curr) => acc + curr, 0);
              const progress = (currentAmount / goal.targetAmount) * 100;
              const daysLeft = Math.ceil(
                (new Date(goal.deadline).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24),
              );

              const isNearDeadline = daysLeft < 30 && daysLeft > 0;
              const isOverdue = daysLeft < 0;
              const isComplete = progress >= 100;

              const formatCurrency = (amount: number) => {
                return new Intl.NumberFormat("en-SG", {
                  style: "currency",
                  currency: "SGD",
                }).format(amount);
              };

              const formatDate = (dateString: string) => {
                return new Date(dateString).toLocaleDateString("en-SG", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
              };

              return (
                <Card
                  key={goal.id}
                  className={
                    isOverdue
                      ? "border-red-500"
                      : isNearDeadline
                        ? "border-yellow-500"
                        : isComplete
                          ? "border-green-500"
                          : ""
                  }
                >
                  <DeleteGoalModal
                    open={deleteModalOpen}
                    setOpen={setDeleteModalOpen}
                    goalId={goal.id}
                    transactionsForSavingsIds={transactionsForSavings.map(
                      (t) => t.id,
                    )}
                  />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">
                      {goal.title}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(goal)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteModalOpen(true)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Target</span>
                        <span className="font-medium">
                          {formatCurrency(goal.targetAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Current</span>
                        <span
                          className={
                            isComplete ? "text-green-600 font-medium" : ""
                          }
                        >
                          {formatCurrency(currentAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Remaining</span>
                        <span
                          className={
                            goal.targetAmount - currentAmount <= 0
                              ? "text-green-600 font-medium"
                              : "font-medium"
                          }
                        >
                          {formatCurrency(goal.targetAmount - currentAmount)}
                        </span>
                      </div>

                      <Progress
                        value={Math.min(progress, 100)}
                        className={`h-2 ${
                          isComplete
                            ? "bg-green-100"
                            : isNearDeadline
                              ? "bg-yellow-100"
                              : ""
                        }`}
                      />

                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{progress.toFixed(1)}% complete</span>
                        <span
                          className={
                            isOverdue
                              ? "text-red-600 font-medium"
                              : isNearDeadline
                                ? "text-amber-600 font-medium"
                                : "text-green-600 font-medium"
                          }
                        >
                          {daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}
                        </span>
                      </div>

                      <div className="text-xs text-muted-foreground pt-2">
                        Deadline: {formatDate(goal.deadline)}
                      </div>

                      {(isNearDeadline || isOverdue || isComplete) && (
                        <div
                          className={`flex items-center gap-2 text-sm mt-2 ${
                            isOverdue
                              ? "text-red-600"
                              : isComplete
                                ? "text-green-600"
                                : "text-amber-600"
                          }`}
                        >
                          <AlertCircle className="h-4 w-4" />
                          <span>
                            {isOverdue
                              ? "Goal deadline passed!"
                              : isComplete
                                ? "Goal achieved!"
                                : "Deadline approaching"}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
