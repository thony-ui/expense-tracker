import { useDeleteTransaction } from "@/app/mutations/use-delete-transaction";
import { invalidateBudgets } from "@/app/queries/use-get-budgets";
import { invalidateSavingsGoals } from "@/app/queries/use-get-savings-goals";
import { invalidateTransactions } from "@/app/queries/use-get-transactions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { toast } from "react-toastify";

function DeleteTransactionModal({
  open,
  setOpen,
  transactionId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  transactionId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: deleteTransaction } = useDeleteTransaction();
  const handleDelete = async (transactionId: string) => {
    setIsLoading(true);
    await deleteTransaction(transactionId);
    setOpen(false);
    setIsLoading(false);
    toast("Transaction deleted successfully!", { type: "success" });
    invalidateTransactions();
    invalidateBudgets();
    invalidateSavingsGoals();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Transaction</DialogTitle>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this transaction? This action cannot
            be undone.
          </p>
        </DialogHeader>
        <DialogFooter className="flex gap-2 flex-wrap flex-row justify-end sm:gap-0">
          <Button
            variant="secondary"
            className="border-none w-[100px]"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDelete(transactionId)}
            className="w-[100px]"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteTransactionModal;
