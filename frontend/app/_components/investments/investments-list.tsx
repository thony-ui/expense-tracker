"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { useGetInvestments } from "@/app/queries/use-get-investments";
import { EditInvestmentModal } from "./modals/edit-investment-modal";
import { useDeleteInvestment } from "@/app/mutations/use-delete-investment";
import { toast } from "react-toastify";
import { IInvestment } from "@/lib/types";

export function InvestmentsList() {
  const { data: investments = [] } = useGetInvestments();
  const [selectedInvestment, setSelectedInvestment] =
    useState<IInvestment | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { mutateAsync: deleteInvestment } = useDeleteInvestment();

  const handleEdit = (investment: IInvestment) => {
    setSelectedInvestment(investment);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this investment?")) {
      try {
        await deleteInvestment(id);
        toast("Investment deleted successfully!", { type: "success" });
      } catch (error) {
        toast("Failed to delete investment", { type: "error" });
      }
    }
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>All Investments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">
                    User
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">
                    Stock
                  </th>
                  <th className="text-right p-3 font-semibold text-gray-700 dark:text-gray-300">
                    Amount (SGD)
                  </th>
                  <th className="text-right p-3 font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {investments.length > 0 ? (
                  investments.map((investment) => (
                    <tr
                      key={investment.id}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <td className="p-3 text-gray-900 dark:text-white">
                        {new Date(investment.date).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-gray-900 dark:text-white">
                        {investment.userName}
                      </td>
                      <td className="p-3 font-medium text-gray-900 dark:text-white">
                        {investment.stock}
                      </td>
                      <td className="p-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                        {formatCurrency(investment.amountInSGD)}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(investment)}
                            className="h-8 w-8 p-0"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(investment.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-gray-500 dark:text-gray-400"
                    >
                      No investments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedInvestment && (
        <EditInvestmentModal
          open={editModalOpen}
          setOpen={setEditModalOpen}
          investment={selectedInvestment}
        />
      )}
    </>
  );
}
