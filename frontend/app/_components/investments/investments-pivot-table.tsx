"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAggregatedInvestments } from "@/app/queries/use-get-aggregated-investments";
import { useState } from "react";

export function InvestmentsPivotTable() {
  const { data: investments = [] } = useGetAggregatedInvestments();
  const [filterStock, setFilterStock] = useState<string>("all");

  // Get unique stocks for filter
  const uniqueStocks = investments.map((inv) => inv.stock);

  // Filter investments
  const filteredInvestments =
    filterStock === "all"
      ? investments
      : investments.filter((inv) => inv.stock === filterStock);

  // Helper function to calculate percentage
  const calculatePercentage = (amount: number, total: number) => {
    if (total === 0) return "0.00";
    return ((amount / total) * 100).toFixed(2);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <CardTitle className="text-nowrap">Investments by Stock</CardTitle>
          <Select value={filterStock} onValueChange={setFilterStock}>
            <SelectTrigger className="w-full sm:w-[180px] h-[37.5px] dark:border-gray-500">
              <SelectValue placeholder="All Stocks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stocks</SelectItem>
              {uniqueStocks.map((stock) => (
                <SelectItem key={stock} value={stock}>
                  {stock}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">
                  Stock
                </th>
                <th className="text-right p-3 font-semibold text-gray-700 dark:text-gray-300">
                  Anthony
                </th>
                <th className="text-right p-3 font-semibold text-gray-700 dark:text-gray-300">
                  %
                </th>
                <th className="text-right p-3 font-semibold text-gray-700 dark:text-gray-300">
                  Albert
                </th>
                <th className="text-right p-3 font-semibold text-gray-700 dark:text-gray-300">
                  %
                </th>
                <th className="text-right p-3 font-semibold text-gray-700 dark:text-gray-300">
                  Juliana
                </th>
                <th className="text-right p-3 font-semibold text-gray-700 dark:text-gray-300">
                  %
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredInvestments.length > 0 ? (
                filteredInvestments.map((investment) => {
                  const total =
                    investment.Anthony + investment.Albert + investment.Juliana;

                  return (
                    <tr
                      key={investment.stock}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <td className="p-3 font-medium text-gray-900 dark:text-white">
                        {investment.stock}
                      </td>
                      <td className="p-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                        {formatCurrency(investment.Anthony)}
                      </td>
                      <td className="p-3 text-right text-xs text-gray-600 dark:text-gray-400">
                        {calculatePercentage(investment.Anthony, total)}%
                      </td>
                      <td className="p-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                        {formatCurrency(investment.Albert)}
                      </td>
                      <td className="p-3 text-right text-xs text-gray-600 dark:text-gray-400">
                        {calculatePercentage(investment.Albert, total)}%
                      </td>
                      <td className="p-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                        {formatCurrency(investment.Juliana)}
                      </td>
                      <td className="p-3 text-right text-xs text-gray-600 dark:text-gray-400">
                        {calculatePercentage(investment.Juliana, total)}%
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
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
  );
}
