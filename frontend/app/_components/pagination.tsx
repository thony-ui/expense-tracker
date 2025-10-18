import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import React from "react";

interface IPaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;

  transactionsLength?: number;
}

function Pagination({
  currentPage,
  onPageChange,
  transactionsLength,
}: IPaginationProps) {
  return (
    <div className="flex items-center gap-2 mt-4 w-full justify-between">
      <div className="flex items-center">
        <ArrowLeftIcon className="w-5 h-5 disabled:opacity-50" />
        <button
          className="px-3 py-1 disabled:opacity-50"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
      </div>
      <span className="px-3 py-1">{currentPage}</span>
      <div className="flex items-center">
        <button
          className="px-3 py-1 disabled:opacity-50"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={
            !transactionsLength || currentPage * 5 >= transactionsLength
          }
        >
          Next
        </button>
        <ArrowLeftIcon className="w-5 h-5 rotate-180 disabled:opacity-50" />
      </div>
    </div>
  );
}

export default Pagination;
