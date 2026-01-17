"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ICreateBudget, PeriodType } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePostBudget } from "@/app/mutations/use-post-budget";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface CreateBudgetModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateBudgetModal({ open, onClose }: CreateBudgetModalProps) {
  const queryClient = useQueryClient();
  const { mutate: createBudget, isPending } = usePostBudget();
  const [periodType, setPeriodType] = useState<PeriodType>("monthly");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ICreateBudget>({
    defaultValues: {
      periodType: "monthly",
    },
  });

  const onSubmit = (data: ICreateBudget) => {
    createBudget(data, {
      onSuccess: () => {
        toast.success("Budget created successfully!");
        queryClient.invalidateQueries({ queryKey: ["/v1/budgets"] });
        reset();
        onClose();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to create budget"
        );
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
          <DialogDescription>
            Set up a budget to track your spending limits
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Budget Name</Label>
            <Input
              id="name"
              placeholder="e.g., Monthly Groceries"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (SGD)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="500.00"
              {...register("amount", {
                required: "Amount is required",
                valueAsNumber: true,
                min: { value: 0.01, message: "Amount must be greater than 0" },
              })}
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="periodType">Period Type</Label>
            <Select
              value={periodType}
              onValueChange={(value: PeriodType) => {
                setPeriodType(value);
                setValue("periodType", value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate", {
                  required: "Start date is required",
                })}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                {...register("endDate", { required: "End date is required" })}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
