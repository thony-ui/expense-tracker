"use client";

import { InvestmentStatsCards } from "@/app/_components/investments/investment-stats-cards";
import { InvestmentsPivotTable } from "@/app/_components/investments/investments-pivot-table";
import { AddInvestmentDialog } from "@/app/_components/investments/add-investment-dialog";
import { InvestmentUserCards } from "@/app/_components/investments/investment-user-cards";
import { InvestmentsList } from "@/app/_components/investments/investments-list";

export function InvestmentsOverview() {
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Investments
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
            Track and manage your investment portfolio
          </p>
        </div>
        <AddInvestmentDialog />
      </div>

      <InvestmentStatsCards />

      <InvestmentUserCards />

      <InvestmentsPivotTable />

      <InvestmentsList />
    </div>
  );
}
