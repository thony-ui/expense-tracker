import { usePostGenerateExpenseReport } from "@/app/mutations/use-post-generate-expense";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

function ConfirmGenerateReportModal({
  open,
  setOpen,
  setIsGenerating,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { mutateAsync: postGenerateReport } =
    usePostGenerateExpenseReport(setIsGenerating);
  const handleConfirm = async () => {
    setOpen(false);
    await postGenerateReport();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
          <p className="text-sm text-gray-500">
            Are you sure you want to generate a report? This will create a new
            report based on your current transactions.
          </p>
        </DialogHeader>
        <DialogFooter className="flex gap-2 flex-wrap flex-row justify-end sm:gap-0">
          <Button
            variant="secondary"
            className="border-none w-[100px]"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleConfirm}
            className="w-[100px]"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmGenerateReportModal;
