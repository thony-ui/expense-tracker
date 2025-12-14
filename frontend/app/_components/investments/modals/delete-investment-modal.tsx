"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteInvestment } from "@/app/mutations/use-delete-investment";
import { toast } from "react-toastify";
import { invalidateInvestments } from "@/app/queries/use-get-investments";

interface DeleteInvestmentModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  investmentId: string;
}

export function DeleteInvestmentModal({
  open,
  setOpen,
  investmentId,
}: DeleteInvestmentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: deleteInvestment } = useDeleteInvestment();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteInvestment(investmentId);
      toast("Investment deleted successfully!", { type: "success" });
      invalidateInvestments();
      setOpen(false);
    } catch (error) {
      toast("Failed to delete investment", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Investment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this investment? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
