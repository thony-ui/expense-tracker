"use client";

import { StatsCards } from "./stats-cards";
import { RecentTransactions } from "./recent-transactions";
import { mockStats, mockTransactions } from "@/lib/mock-data";
import { IncomeExpenseChart } from "../charts/income-expense-chart";
import { CategoryChart } from "../charts/category-chart";
import { useUser } from "@/components/contexts/user-context";

export function DashboardOverview() {
  // TODO: Replace with real data fetching logic. For now we use useUser to check if the data obtained from the user is loading.
  const { isLoading } = useUser();
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[80vh]">
        <p className="text-gray-500">Loading dashboard data, please wait...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">
          Track your expenses and manage your budget
        </p>
      </div>

      <StatsCards stats={mockStats} />

      {/* Reliable Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IncomeExpenseChart />
        <CategoryChart />
      </div>

      <RecentTransactions />
    </div>
  );
}
