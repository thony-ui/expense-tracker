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
import { CreateBudgetModal } from "../budgets/create-budget-modal";
import { Wallet } from "lucide-react";

export function AddBudgetDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" variant="outline">
          <Wallet className="h-4 w-4 sm:mr-2" />
          <p className="hidden sm:block">Add Budget</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Budget</DialogTitle>
        </DialogHeader>
        <CreateBudgetModal setOpen={setOpen} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
