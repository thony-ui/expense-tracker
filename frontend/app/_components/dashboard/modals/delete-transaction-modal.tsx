import { useDeleteTransaction } from "@/app/mutations/use-delete-transaction";
import { invalidateTransactions } from "@/app/queries/use-get-transactions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
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
  const { mutateAsync: deleteTransaction } = useDeleteTransaction();
  const handleDelete = async (transactionId: string) => {
    setOpen(false);
    await deleteTransaction(transactionId);
    toast("Transaction deleted successfully!", { type: "success" });
    invalidateTransactions();
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
        <DialogFooter>
          <Button
            variant="secondary"
            className="border-none"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDelete(transactionId)}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteTransactionModal;
