"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useGetAggregatedInvestments } from "@/app/queries/use-get-aggregated-investments";

export function InvestmentUserCards() {
  const { data: investments = [] } = useGetAggregatedInvestments();

  // Calculate totals for each user
  const anthonyTotal = investments.reduce((sum, inv) => sum + inv.Anthony, 0);
  const albertTotal = investments.reduce((sum, inv) => sum + inv.Albert, 0);
  const julianaTotal = investments.reduce((sum, inv) => sum + inv.Juliana, 0);

  const cards = [
    {
      name: "Anthony",
      total: anthonyTotal,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      name: "Albert",
      total: albertTotal,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      name: "Juliana",
      total: julianaTotal,
      color: "text-pink-600 dark:text-pink-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card key={card.name} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {card.name}'s Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>
              {formatCurrency(card.total)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
