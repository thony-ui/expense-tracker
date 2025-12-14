"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleEllipsisIcon, DeleteIcon, EditIcon } from "lucide-react";
import { useState } from "react";
import { IInvestment } from "@/lib/types";
import { DeleteInvestmentModal } from "./modals/delete-investment-modal";
import { EditInvestmentModal } from "./modals/edit-investment-modal";

export function InvestmentDropdownMenu({
  investment,
}: {
  investment: IInvestment;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <DeleteInvestmentModal
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        investmentId={investment.id}
      />
      <EditInvestmentModal
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        investment={investment}
      />
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className="rounded-sm p-1">
          <CircleEllipsisIcon className="text-gray-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="pb-2 hover:cursor-pointer"
            onClick={() => setIsEditModalOpen(true)}
          >
            <EditIcon />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            className="pb-2 hover:cursor-pointer"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <DeleteIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
