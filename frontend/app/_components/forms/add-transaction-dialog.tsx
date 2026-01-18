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
import { PlusIcon } from "@heroicons/react/24/outline";
import { AddTransactionForm } from "./add-transaction-form";
import { toast } from "react-toastify";
import { invalidateTransactions } from "@/app/queries/use-get-transactions";
import { invalidateBudgets } from "@/app/queries/use-get-budgets";
import { invalidateSavingsGoals } from "@/app/queries/use-get-savings-goals";
import { invalidateGetTransactionsBySavingsGoalId } from "@/app/queries/use-get-transaction";

export function AddTransactionDialog() {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    toast("Transaction added successfully!", { type: "success" });
    invalidateTransactions();
    invalidateBudgets();
    invalidateSavingsGoals();
    invalidateGetTransactionsBySavingsGoalId();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          <p className="hidden sm:block">Add Transaction</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>
        <AddTransactionForm
          onSuccess={() => {
            handleSuccess();
          }}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
