"use client";

import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import { AddTransactionDialog } from "../forms/add-transaction-dialog";
import { UserMenu } from "./user-menu";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={onMenuClick}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      <div className="flex items-center justify-between gap-x-4 w-full">
        <AddTransactionDialog />
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
