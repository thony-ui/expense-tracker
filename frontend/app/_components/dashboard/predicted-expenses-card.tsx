import { IPredictedExpenses } from "@/app/hooks/use-predict-expense";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";

function PredictedExpensesCard({
  isPredictedLoading,
  predictedExpenses,
  currentSpending,
}: {
  isPredictedLoading: boolean;
  predictedExpenses: IPredictedExpenses | null;
  currentSpending: number;
}) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">
            Current Month Predicted Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPredictedLoading ? (
            <p className="text-sm text-gray-500">Loading prediction...</p>
          ) : predictedExpenses ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-sm text-gray-500">Forecast month</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {predictedExpenses.forecastMonth}
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                  <p className="text-sm text-gray-500">Current total</p>
                  <p className="text-2xl font-bold text-green-500 dark:text-green-400">
                    ${currentSpending.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                  <p className="text-sm text-gray-500">Forecast end of month</p>
                  <p className="text-2xl font-bold text-red-500 dark:text-red-400">
                    ${predictedExpenses.forecastEndOfMonth.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
              <p className="text-sm text-gray-500">Current total</p>
              <p className="text-2xl font-bold text-green-500 dark:text-green-400">
                ${currentSpending.toFixed(2)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default PredictedExpensesCard;
