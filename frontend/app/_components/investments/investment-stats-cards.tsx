"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BanknotesIcon,
  ChartBarIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency } from "@/lib/utils";
import { useGetInvestmentStats } from "@/app/queries/use-get-investment-stats";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TStatsType = "yearly" | "monthly" | "weekly" | "daily";

export function InvestmentStatsCards() {
  const [statsType, setStatsType] = useState<TStatsType>("yearly");
  const { data: stats } = useGetInvestmentStats();

  const cards = [
    {
      title: "Total (SGD)",
      value: stats?.totalInvestmentsSGD ?? 0,
      icon: BanknotesIcon,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      title: "Total Stocks",
      value: stats?.totalStocks ?? 0,
      icon: BuildingLibraryIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      isCount: true,
    },
    {
      title: "Average (SGD)",
      value: stats?.averageInvestmentSGD ?? 0,
      icon: ChartBarIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card) => (
          <Card key={card.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                <p className="break-words">
                  {card.isCount ? card.value : formatCurrency(card.value)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
