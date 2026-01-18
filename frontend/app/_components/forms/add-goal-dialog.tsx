"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target } from "lucide-react";
import { usePostSavingsGoal } from "@/app/mutations/use-post-savings-goal";
import { toast } from "react-toastify";

export function AddGoalDialog() {
  const [open, setOpen] = useState(false);
  const { mutateAsync: postSavingsGoal } = usePostSavingsGoal();
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postSavingsGoal({
        title: formData.title,
        targetAmount: parseFloat(formData.targetAmount),
        deadline: formData.deadline,
      });
      toast.success("Savings goal created!");
      setFormData({
        title: "",
        targetAmount: "",
        deadline: "",
      });
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create savings goal");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" variant="outline">
          <Target className="h-4 w-4 sm:mr-2" />
          <p className="hidden sm:block">Add Goal</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Savings Goal</DialogTitle>
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
            Create Goal
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
