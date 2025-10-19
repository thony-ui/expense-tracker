"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetDailyTransactions,
  useGetMonthlyTransactions,
  useGetTransactions,
  useGetWeeklyTransactions,
  useGetYearlyTransactions,
} from "@/app/queries/use-get-transactions";
import { useMemo, useState } from "react";
import {
  getDailyChartData,
  getMonthlyChartData,
  getWeeklyChartData,
  getYearlyChartData,
} from "@/app/utils/format-chart-data";
import { ITransaction } from "@/lib/types";
import { ChartFilter, TView } from "./chart-filter";

const chartConfig = {
  expense: {
    label: "Expense",
    color: "#FF6B6B",
  },
  income: {
    label: "Income",
    color: "#96CEB4",
  },
} satisfies ChartConfig;

type TDataKey = "day" | "month" | "year" | "week";

type ChartViewConfig = {
  getChartData: (data: ITransaction[]) => unknown[];
  transactions: ITransaction[];
  dataKey: TDataKey;
};

export function IncomeExpenseChart() {
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const { data: monthlyTransactions = [] } = useGetMonthlyTransactions({
    date,
  });
  const { data: yearlyTransactions = [] } = useGetYearlyTransactions({
    date,
  });
  const { data: weeklyTransactions = [] } = useGetWeeklyTransactions({
    date,
  });
  const { data: dailyTransactions = [] } = useGetDailyTransactions({
    date,
  });
  const transactionManager = useMemo(() => {
    const chartViewConfigMap: Record<TView, ChartViewConfig> = {
      monthly: {
        getChartData: getMonthlyChartData,
        transactions: monthlyTransactions,
        dataKey: "month",
      },
      yearly: {
        getChartData: getYearlyChartData,
        transactions: yearlyTransactions,
        dataKey: "year",
      },
      weekly: {
        getChartData: getWeeklyChartData,
        transactions: weeklyTransactions,
        dataKey: "week",
      },
      daily: {
        getChartData: getDailyChartData,
        transactions: dailyTransactions,
        dataKey: "day",
      },
    };
    return chartViewConfigMap;
  }, [
    monthlyTransactions,
    yearlyTransactions,
    weeklyTransactions,
    dailyTransactions,
  ]);

  const [view, setView] = useState<TView>("monthly");

  const chartData = transactionManager[view].getChartData(
    transactionManager[view].transactions
  );
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center gap-2 md:gap-0 flex-col md:flex-row">
          <div className="space-y-1">
            <CardTitle>Income and Expense Chart</CardTitle>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Your expenses and income
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
        <ChartContainer
          config={chartConfig}
          className="h-[350px] md:h-[500px] w-full"
        >
          <BarChart accessibilityLayer data={chartData} barSize={100}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={transactionManager[view].dataKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                if (view === "monthly") {
                  const isMediumScreen =
                    window.matchMedia("(min-width: 768px)").matches;
                  return isMediumScreen ? value.slice(0, 3) : value.slice(0, 1);
                }
                return value;
              }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="expense" radius={4} fill="#FF6B6B" />
            <Bar dataKey="income" radius={4} fill="#22c55e" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
