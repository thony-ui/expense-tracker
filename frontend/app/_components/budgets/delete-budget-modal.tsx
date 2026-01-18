import { useDeleteBudget } from "@/app/mutations/use-delete-budget";
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
import { useQueryClient } from "@tanstack/react-query";

function DeleteBudgetModal({
  open,
  setOpen,
  budgetId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  budgetId: string;
}) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: deleteBudget } = useDeleteBudget(budgetId);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteBudget();
      setOpen(false);
      toast.success("Budget deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["/v1/budgets"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete budget");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Budget</DialogTitle>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this budget? This action cannot be
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
            onClick={handleDelete}
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

export default DeleteBudgetModal;
