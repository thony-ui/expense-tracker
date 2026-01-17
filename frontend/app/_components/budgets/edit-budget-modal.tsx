"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IBudget, IUpdateBudget, PeriodType } from "@/lib/types";
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
import { useUpdateBudget } from "@/app/mutations/use-update-budget";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface EditBudgetModalProps {
  budget: IBudget;
  open: boolean;
  onClose: () => void;
}

export function EditBudgetModal({
  budget,
  open,
  onClose,
}: EditBudgetModalProps) {
  const queryClient = useQueryClient();
  const { mutate: updateBudget, isPending } = useUpdateBudget(budget.id);
  const [periodType, setPeriodType] = useState<PeriodType>(budget.periodType);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IUpdateBudget>();

  useEffect(() => {
    if (budget) {
      setValue("name", budget.name);
      setValue("amount", budget.amount);
      setValue("periodType", budget.periodType);
      setValue("startDate", budget.startDate);
      setValue("endDate", budget.endDate);
      setPeriodType(budget.periodType);
    }
  }, [budget, setValue]);

  const onSubmit = (data: IUpdateBudget) => {
    updateBudget(data, {
      onSuccess: () => {
        toast.success("Budget updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["/v1/budgets"] });
        reset();
        onClose();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to update budget"
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
          <DialogTitle>Edit Budget</DialogTitle>
          <DialogDescription>Update your budget details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Budget Name</Label>
            <Input
              id="name"
              placeholder="e.g., Monthly Groceries"
              {...register("name")}
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
              <Input id="startDate" type="date" {...register("startDate")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" {...register("endDate")} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
