"use client";

import type React from "react";
import { IBudget } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AlertCircle, Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface BudgetCardProps {
  budget: IBudget;
  onEdit?: (budget: IBudget) => void;
  onDelete?: (budgetId: string) => void;
  detailHref?: string;
}

export function BudgetCard({
  budget,
  onEdit,
  onDelete,
  detailHref,
}: BudgetCardProps) {
  const router = useRouter();
  const isNearLimit = budget.percentage >= 90;
  const isOverBudget = budget.percentage >= 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SG", {
      style: "currency",
      currency: "SGD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-SG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCardClick = () => {
    if (detailHref) {
      router.push(detailHref);
    }
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!detailHref) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      router.push(detailHref);
    }
  };

  return (
    <Card
      onClick={detailHref ? handleCardClick : undefined}
      onKeyDown={detailHref ? handleCardKeyDown : undefined}
      role={detailHref ? "link" : undefined}
      tabIndex={detailHref ? 0 : undefined}
      className={`${detailHref ? "cursor-pointer transition-shadow hover:shadow-md" : ""} ${
        isOverBudget ? "border-red-500" : isNearLimit ? "border-yellow-500" : ""
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{budget.name}</CardTitle>
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(budget);
              }}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(budget.id);
              }}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Budget</span>
            <span className="font-medium">{formatCurrency(budget.amount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Spent</span>
            <span
              className={
                budget.spent > budget.amount ? "text-red-500 font-medium" : ""
              }
            >
              {formatCurrency(budget.spent)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Remaining</span>
            <span
              className={
                budget.remaining < 0
                  ? "text-red-500 font-medium"
                  : "font-medium"
              }
            >
              {formatCurrency(budget.remaining)}
            </span>
          </div>

          <Progress
            value={Math.min(budget.percentage, 100)}
            className={`h-2 ${
              isOverBudget ? "bg-red-100" : isNearLimit ? "bg-yellow-100" : ""
            }`}
          />

          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{budget.percentage.toFixed(1)}% used</span>
            <span className="capitalize">{budget.periodType}</span>
          </div>

          <div className="text-xs text-muted-foreground pt-2">
            {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
          </div>

          {isNearLimit && (
            <div
              className={`flex items-center gap-2 text-sm mt-2 ${
                isOverBudget ? "text-red-600" : "text-yellow-600"
              }`}
            >
              <AlertCircle className="h-4 w-4" />
              <span>
                {isOverBudget ? "Budget exceeded!" : "Approaching budget limit"}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
