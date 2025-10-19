import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { invalidateTransactions } from "@/app/queries/use-get-transactions";
import { toast } from "react-toastify";
import { EditTransactionForm } from "../../forms/edit-transaction-form";
import {
  invalidateGetTransaction,
  invalidateGetTransactionsBySavingsGoalId,
} from "@/app/queries/use-get-transaction";

function EditTransactionModal({
  open,
  setOpen,
  transactionId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  transactionId: string;
}) {
  const handleSuccess = () => {
    setOpen(false);
    toast("Transaction edited successfully!", { type: "success" });
    invalidateTransactions();
    invalidateGetTransaction(transactionId);
    invalidateGetTransactionsBySavingsGoalId();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <EditTransactionForm
          onSuccess={() => {
            handleSuccess();
          }}
          setOpen={setOpen}
          transactionId={transactionId}
        />
      </DialogContent>
    </Dialog>
  );
}

export default EditTransactionModal;
