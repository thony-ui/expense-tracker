import { useDeleteSavingsGoal } from "@/app/mutations/use-delete-savings-goal";
import { useUpdateTransactions } from "@/app/mutations/use-put-transactions";
import { invalidateSavingsGoals } from "@/app/queries/use-get-savings-goals";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ITransaction } from "@/lib/types";
import React, { useState } from "react";
import { toast } from "react-toastify";

function DeleteGoalModal({
  open,
  setOpen,
  goalId,
  transactionsForSavingsIds,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  goalId: string;
  transactionsForSavingsIds: string[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: deleteGoal } = useDeleteSavingsGoal();
  const { mutateAsync: updateTransactions } = useUpdateTransactions(
    transactionsForSavingsIds
  );
  const handleDelete = async (goalId: string) => {
    setIsLoading(true);
    await updateTransactions();
    await deleteGoal(goalId);
    setOpen(false);
    setIsLoading(false);
    toast("Goal deleted successfully!", { type: "success" });
    invalidateSavingsGoals();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Goal</DialogTitle>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this goal? This action cannot be
            undone.
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
            onClick={() => handleDelete(goalId)}
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

export default DeleteGoalModal;
