"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, useState } from "react";
import { ChartFilter, TView } from "./chart-filter";
import { useGetTransactions } from "@/app/queries/use-get-transactions";

interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export function CashFlowSankey() {
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [view, setView] = useState<TView>("monthly");
  const { data: transactions = [] } = useGetTransactions({
    date,
    type: view,
  });

  const sankeyData = useMemo(() => {
    const income = transactions.filter((t) => t.type === "income");
    const expenses = transactions.filter((t) => t.type === "expense");

    // Calculate income by category
    const incomeByCategory: Record<string, number> = {};
    income.forEach((t) => {
      incomeByCategory[t.category] =
        (incomeByCategory[t.category] || 0) + t.converted_amount;
    });

    // Calculate expenses by category
    const expensesByCategory: Record<string, number> = {};
    expenses.forEach((t) => {
      expensesByCategory[t.category] =
        (expensesByCategory[t.category] || 0) + t.converted_amount;
    });

    const totalIncome = Object.values(incomeByCategory).reduce(
      (a, b) => a + b,
      0
    );
    const totalExpenses = Object.values(expensesByCategory).reduce(
      (a, b) => a + b,
      0
    );

    // Create links (income -> categories -> expenses)
    const links: SankeyLink[] = [];

    Object.entries(incomeByCategory).forEach(([category, amount]) => {
      links.push({
        source: "Total Income",
        target: category,
        value: amount,
      });
    });

    Object.entries(expensesByCategory).forEach(([category, amount]) => {
      links.push({
        source: category,
        target: "Total Expenses",
        value: amount,
      });
    });

    return {
      totalIncome,
      totalExpenses,
      incomeCategories: Object.entries(incomeByCategory),
      expenseCategories: Object.entries(expensesByCategory),
      links,
    };
  }, [transactions]);

  const maxValue = Math.max(sankeyData.totalIncome, sankeyData.totalExpenses);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center gap-2 md:gap-0 flex-col md:flex-row">
          <div className="space-y-1 text-center md:text-left">
            <CardTitle>Cash Flow Visualization</CardTitle>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              How money flows through your accounts
            </p>
          </div>
          <ChartFilter
            view={view}
            onViewChange={setView}
            date={date}
            onDateChange={setDate}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Income Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-green-600">
              Income (${sankeyData.totalIncome.toFixed(2)})
            </h3>
            <div className="space-y-2">
              {sankeyData.incomeCategories.map(([category, amount]) => {
                const percentage = (amount / maxValue) * 100;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{category}</span>
                      <span className="font-medium">${amount.toFixed(2)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Net Flow */}
          <div className="text-center py-4 border-y dark:border-white">
            <div className="text-sm text-muted-foreground mb-1">
              Net Cash Flow
            </div>
            <div
              className={`text-2xl font-bold ${
                sankeyData.totalIncome - sankeyData.totalExpenses >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              ${(sankeyData.totalIncome - sankeyData.totalExpenses).toFixed(2)}
            </div>
          </div>

          {/* Expenses Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-red-600">
              Expenses (${sankeyData.totalExpenses.toFixed(2)})
            </h3>
            <div className="space-y-2">
              {sankeyData.expenseCategories.map(([category, amount]) => {
                const percentage = (amount / maxValue) * 100;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{category}</span>
                      <span className="font-medium">${amount.toFixed(2)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
