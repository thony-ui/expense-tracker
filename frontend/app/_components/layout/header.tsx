"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { AddTransactionDialog } from "../forms/add-transaction-dialog";
import { UserMenu } from "./user-menu";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import { GeneratingExpenseReportDialog } from "../generating-expense-report-modal";
import ConfirmGenerateReportModal from "../dashboard/modals/confirm-generate-report-modal";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isOpenConfirmGenerationModal, setIsOpenConfirmGenerationModal] =
    useState<boolean>(false);

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b border-gray-200 bg-white shadow-sm pr-6 pl-4">
      <GeneratingExpenseReportDialog isGenerating={isGenerating} />
      <ConfirmGenerateReportModal
        open={isOpenConfirmGenerationModal}
        setOpen={setIsOpenConfirmGenerationModal}
        setIsGenerating={setIsGenerating}
      />

      <div className="flex items-center justify-between w-full ml-2 lg:ml-0">
        <button
          type="button"
          className="text-gray-700 lg:hidden"
          onClick={onMenuClick}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <div className="flex gap-2 ">
          <AddTransactionDialog />
          <Button
            className="flex items-center gap-2 bg-white text-black hover:bg-gray-100 hover:text-black border border-zinc-100"
            onClick={() => setIsOpenConfirmGenerationModal(true)}
          >
            <DownloadIcon className="h-4 w-4" />
            <p className="hidden sm:block">Generate Report</p>
          </Button>
        </div>

        <UserMenu />
      </div>
    </div>
  );
}
