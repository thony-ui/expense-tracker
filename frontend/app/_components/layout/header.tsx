"use client";

import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import { AddTransactionDialog } from "../forms/add-transaction-dialog";
import { UserMenu } from "./user-menu";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { usePostGenerateExpenseReport } from "@/app/mutations/use-post-generate-expense";
import { useState } from "react";
import { GeneratingExpenseReportDialog } from "../generating-expense-report-modal";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { mutateAsync: postGenerateReport } =
    usePostGenerateExpenseReport(setIsGenerating);
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b border-gray-200 bg-white shadow-sm px-6">
      <GeneratingExpenseReportDialog isGenerating={isGenerating} />
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={onMenuClick}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      <div className="flex items-center justify-between w-full ml-2 lg:ml-0">
        <div className="flex gap-2 justify-start">
          <AddTransactionDialog />
          <Button
            className="flex items-center gap-2 bg-white text-black hover:bg-gray-100 hover:text-black border border-zinc-100"
            onClick={async () => await postGenerateReport()}
          >
            <DownloadIcon className="h-4 w-4" />
            <p className="hidden sm:block">Generate Report</p>
          </Button>
        </div>
        <div className="flex gap-x-4">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <BellIcon className="h-6 w-6" />
          </button>
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
