import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleEllipsisIcon, DeleteIcon, EditIcon } from "lucide-react";
import { useState } from "react";
import DeleteTransactionModal from "./modals/delete-transaction-modal";
import EditTransactionModal from "./modals/edit-transaction-modal";

export function TransactionDropdownMenu({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  return (
    <>
      <DeleteTransactionModal
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        transactionId={id}
      />
      <EditTransactionModal
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        transactionId={id}
      />
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className="rounded-sm p-1">
          <CircleEllipsisIcon
            style={{
              color: "#6b7280",
            }}
          />
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
