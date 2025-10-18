import { usePostGenerateExpenseReport } from "@/app/mutations/use-post-generate-expense";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

function ConfirmGenerateReportModal({
  open,
  setOpen,
  setIsGenerating,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const { mutateAsync: postGenerateReport } = usePostGenerateExpenseReport(
    setIsGenerating,
    startDate,
    endDate
  );
  const handleConfirm = async () => {
    setOpen(false);
    await postGenerateReport();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 w-[280px]">
          <div className="flex flex-row gap-5 items-center">
            <Label htmlFor="start-date">Start Date: </Label>
            <Input
              type="date"
              id="start-date"
              className="w-[180px] ml-auto"
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-row gap-5 items-center">
            <Label htmlFor="end-date">End Date: </Label>
            <Input
              type="date"
              id="end-date"
              className="w-[180px] ml-auto"
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="flex gap-2 flex-wrap flex-row sm:gap-0">
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
            disabled={!startDate || !endDate || startDate > endDate}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmGenerateReportModal;
