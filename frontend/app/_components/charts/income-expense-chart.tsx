"use client";

import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const monthlyData = [
  { month: "Jan", income: 3500, expenses: 2100 },
  { month: "Feb", income: 3200, expenses: 1800 },
  { month: "Mar", income: 4100, expenses: 2400 },
  { month: "Apr", income: 3800, expenses: 2200 },
  { month: "May", income: 3600, expenses: 1900 },
  { month: "Jun", income: 4200, expenses: 2600 },
];

export function IncomeExpenseChart() {
  const maxValue = Math.max(
    ...monthlyData.flatMap((d) => [d.income, d.expenses])
  );
  const months = monthlyData.map((d) => d.month);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses Trend</CardTitle>
        <p className="text-sm text-muted-foreground">
          Monthly comparison over the past 6 months
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Legend */}
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span>Expenses</span>
            </div>
          </div>

          {/* Chart */}
          <div className="relative h-64 border rounded-lg p-4 bg-gray-50">
            <svg
              className="w-full h-full"
              viewBox="0 0 600 200"
              preserveAspectRatio="none"
            >
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 40}
                  x2="600"
                  y2={i * 40}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}

              {/* Income line */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                points={monthlyData
                  .map(
                    (d, i) =>
                      `${i * 100 + 50},${200 - (d.income / maxValue) * 180}`
                  )
                  .join(" ")}
              />

              {/* Expenses line */}
              <polyline
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
                points={monthlyData
                  .map(
                    (d, i) =>
                      `${i * 100 + 50},${200 - (d.expenses / maxValue) * 180}`
                  )
                  .join(" ")}
              />

              {/* Data points */}
              {monthlyData.map((d, i) => (
                <g key={i}>
                  <circle
                    cx={i * 100 + 50}
                    cy={200 - (d.income / maxValue) * 180}
                    r="4"
                    fill="#10b981"
                  />
                  <circle
                    cx={i * 100 + 50}
                    cy={200 - (d.expenses / maxValue) * 180}
                    r="4"
                    fill="#ef4444"
                  />
                </g>
              ))}

              {/* Month labels */}
              {monthlyData.map((d, i) => (
                <text
                  key={i}
                  x={i * 100 + 50}
                  y="195"
                  textAnchor="middle"
                  fontSize="12"
                  fill="#6b7280"
                >
                  {d.month}
                </text>
              ))}

              {/* Y-axis labels */}
              {[0, 1, 2, 3, 4].map((i) => (
                <text
                  key={i}
                  x="10"
                  y={i * 40 + 5}
                  textAnchor="start"
                  fontSize="10"
                  fill="#6b7280"
                >
                  ${Math.round((maxValue / 4) * (4 - i))}
                </text>
              ))}
            </svg>
          </div>

          {/* Data table */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-medium">Month</div>
            <div className="font-medium text-green-600">Income</div>
            <div className="font-medium text-red-600">Expenses</div>
            {monthlyData.map((d) => (
              <React.Fragment key={d.month}>
                <div>{d.month}</div>
                <div className="text-green-600">
                  ${d.income.toLocaleString()}
                </div>
                <div className="text-red-600">
                  ${d.expenses.toLocaleString()}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
