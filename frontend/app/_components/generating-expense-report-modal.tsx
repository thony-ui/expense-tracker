"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";

interface GeneratingExpenseReportDialog {
  isGenerating: boolean;
}

export function GeneratingExpenseReportDialog({
  isGenerating,
}: GeneratingExpenseReportDialog) {
  return (
    <Dialog open={isGenerating} onOpenChange={() => {}}>
      <DialogTitle></DialogTitle>
      <DialogContent
        className="sm:max-w-md flex flex-col items-center p-6 [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center gap-2 py-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <h3 className="text-md text-muted-foreground">
            Generating Report...
          </h3>
        </div>
      </DialogContent>
    </Dialog>
  );
}
