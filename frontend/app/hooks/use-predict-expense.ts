"use client";

import { useEffect, useState } from "react";
import { createGradioClient } from "@/lib/gradio";
import { IUser } from "../queries/use-get-user";

export interface IPredictedExpenses {
  forecastMonth: string;
  currentMonthSpend: number;
  forecastEndOfMonth: number;
}

export function usePredictForecastExpense(
  user: IUser | undefined,
  currentSpending: number,
) {
  const [isPredictedLoading, setIsPredictedLoading] = useState(false);
  const [predictedExpenses, setPredictedExpenses] =
    useState<IPredictedExpenses | null>(null);

  useEffect(() => {
    if (!user?.name) {
      return;
    }

    let isActive = true;

    const fetchPredictions = async () => {
      setIsPredictedLoading(true);

      try {
        const client = await createGradioClient();
        const result = await client!.predict("/run_prediction", {
          current_month_spend: currentSpending,
        });

        const rawPayload = Array.isArray(result.data)
          ? result.data[0]
          : result.data;
        const payload = rawPayload as {
          current_month_spend: number;
          forecast_end_of_month: number;
          forecast_month: string;
        };

        if (!isActive) {
          return;
        }

        setPredictedExpenses({
          forecastMonth: payload.forecast_month,
          currentMonthSpend: payload.current_month_spend,
          forecastEndOfMonth: payload.forecast_end_of_month,
        });
      } catch (error) {
      } finally {
        if (isActive) {
          setIsPredictedLoading(false);
        }
      }
    };

    fetchPredictions();

    return () => {
      isActive = false;
    };
  }, [user?.name, currentSpending]);

  return {
    isPredictedLoading,
    predictedExpenses,
  };
}
