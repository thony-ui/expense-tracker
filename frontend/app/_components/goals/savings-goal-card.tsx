"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, Edit2, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
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
    }
  ) => void;
}

export function SavingsGoalCard({
  goals,
  onAddGoal,
  onEditGoal,
}: SavingsGoalCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [view, setView] = useState<TView>("monthly");
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
  });
  const goalIds = goals.map((goal) => goal.id);
  const { data: allTransactions } = useGetTransactionsBySavingsGoalIds(goalIds);

  const transactionsMap = useMemo(() => {
    if (!allTransactions) return {};
    return allTransactions.reduce((acc, tx) => {
      if (tx.savingsGoalId) {
        if (!acc[tx.savingsGoalId]) acc[tx.savingsGoalId] = [];
        acc[tx.savingsGoalId].push(tx);
      }
      return acc;
    }, {} as Record<string, ITransaction[]>);
  }, [allTransactions]);

  // Filter goals based on deadline and selected date/view
  const filteredGoals = useMemo(() => {
    const selectedDate = new Date(date);

    return goals.filter((goal) => {
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
  }, [goals, date, view]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGoal) {
      // Update existing goal
      onEditGoal(editingGoal.id, {
        title: formData.title,
        targetAmount: parseFloat(formData.targetAmount),
        deadline: formData.deadline,
      });
    } else {
      // Create new goal
      onAddGoal({
        title: formData.title,
        targetAmount: parseFloat(formData.targetAmount),
        deadline: formData.deadline,
      });
    }
    setFormData({
      title: "",
      targetAmount: "",
      deadline: "",
    });
    setEditingGoal(null);
    setIsOpen(false);
  };

  const handleEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      targetAmount: goal.targetAmount.toString(),
      deadline: goal.deadline,
    });
    setIsOpen(true);
  };

  const handleOpenChange = () => {
    setEditingGoal(null);
    setIsOpen(!isOpen);
    setFormData({
      title: "",
      targetAmount: "",
      deadline: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            <CardTitle>Savings Goals</CardTitle>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <ChartFilter
              view={view}
              onViewChange={setView}
              date={date}
              onDateChange={setDate}
            />
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingGoal ? "Edit Savings Goal" : "Create Savings Goal"}
                  </DialogTitle>
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
                    {editingGoal ? "Update Goal" : "Create Goal"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent
        className={
          filteredGoals.length === 0
            ? "flex items-center justify-center min-h-[400px]"
            : "space-y-4"
        }
      >
        {filteredGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
            <Target className="h-12 w-12 mb-2 opacity-50" />
            <p>
              No savings goals{" "}
              {view !== "yearly" && `for this ${view.replace("ly", "")}`}
            </p>
            <p className="text-sm mt-1">
              {goals.length === 0
                ? "Create one to start tracking your progress!"
                : "Try changing the date or view filter"}
            </p>
          </div>
        ) : (
          filteredGoals.map((goal) => {
            const transactionsForSavings = transactionsMap[goal.id] || [];
            const currentAmount = transactionsForSavings
              .map((t) => t.amount)
              .reduce((acc, curr) => acc + curr, 0);
            const progress = (currentAmount / goal.targetAmount) * 100;
            const daysLeft = Math.ceil(
              (new Date(goal.deadline).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={goal.id}
                className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow dark:border-gray-500"
              >
                <DeleteGoalModal
                  open={deleteModalOpen}
                  setOpen={setDeleteModalOpen}
                  goalId={goal.id}
                  transactionsForSavingsIds={transactionsForSavings.map(
                    (t) => t.id
                  )}
                />
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{goal.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      ${currentAmount.toFixed(2)} of $
                      {goal.targetAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(goal)}
                    >
                      <Edit2 className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteModalOpen(true)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                <Progress value={progress} className="h-2" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {progress.toFixed(0)}% complete
                  </span>
                  <span
                    className={`font-medium ${
                      daysLeft < 30 ? "text-amber-600" : "text-green-600"
                    }`}
                  >
                    {daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
