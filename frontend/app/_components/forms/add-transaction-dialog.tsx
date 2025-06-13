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

export function AddTransactionDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>
        <AddTransactionForm
          onSuccess={() => {
            setOpen(false);
            toast("Transaction added successfully!", { type: "success" });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
