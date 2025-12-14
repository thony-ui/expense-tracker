import supabase from "../../../lib/supabase-client";
import logger from "../../../logger";
import {
  formatDate,
  getCurrentWeekStart,
  getDateBasedOnCategoryType,
} from "../../../utils/formate-date";
import {
  IInvestment,
  IInvestmentOverTime,
  IInvestmentService,
  IInvestmentStats,
  IInvestmentAggregated,
} from "./investment.interface";

export class InvestmentRepository implements IInvestmentService {
  // Helper to map database row to IInvestment interface
  private mapToInvestment = (row: any): IInvestment => {
    return {
      id: row.id,
      userId: row.userid,
      userName: row.username,
      stock: row.stock,
      amountInSGD: row.amountinsgd,
      date: row.date,
    };
  };

  addInvestmentToDatabase = async (
    investment: IInvestment,
    userId: string
  ): Promise<void> => {
    const { data, error } = await supabase.from("investments").insert([
      {
        userid: userId,
        username: investment.userName,
        stock: investment.stock,
        amountinsgd: investment.amountInSGD,
        date: investment.date,
      },
    ]);

    if (error) {
      logger.error(
        `InvestmentRepository: addInvestmentToDatabase error: ${error.message}`
      );
      throw new Error("Error adding investment to database");
    }

    logger.info(
      `InvestmentRepository: addInvestmentToDatabase success for userName: ${investment.userName}`
    );
  };

  getInvestmentsFromDatabase = async (
    userId: string,
    userName?: string,
    limit?: number,
    offSet?: number,
    categoryType?: string,
    dateToFilter?: string
  ): Promise<IInvestment[]> => {
    let query = supabase
      .from("investments")
      .select("*")
      .eq("userid", userId)
      .order("date", { ascending: false });

    if (userName) {
      query = query.eq("username", userName);
    }

    if (limit) {
      query = query.limit(limit);
    }

    if (offSet) {
      query = query.range(offSet, offSet + (limit || 10) - 1);
    }

    if (categoryType && dateToFilter) {
      const { startDate, endDate } = getDateBasedOnCategoryType(
        categoryType,
        dateToFilter
      );
      query = query.gte("date", startDate).lte("date", endDate);
    }

    const { data, error } = await query;

    if (error) {
      logger.error(
        `InvestmentRepository: getInvestmentsFromDatabase error: ${error.message}`
      );
      throw new Error("Error fetching investments from database");
    }

    logger.info(`InvestmentRepository: getInvestmentsFromDatabase success`);

    return data.map(this.mapToInvestment);
  };

  getInvestmentStatsFromDatabase = async (
    userId: string,
    userName?: string,
    categoryType?: string,
    dateToFilter?: string
  ): Promise<IInvestmentStats> => {
    let query = supabase
      .from("investments")
      .select("amountinsgd, stock")
      .eq("userid", userId);

    if (userName) {
      query = query.eq("username", userName);
    }

    if (categoryType && dateToFilter) {
      const { startDate, endDate } = getDateBasedOnCategoryType(
        categoryType,
        dateToFilter
      );
      query = query.gte("date", startDate).lte("date", endDate);
    }

    const { data, error } = await query;

    if (error) {
      logger.error(
        `InvestmentRepository: getInvestmentStatsFromDatabase error: ${error.message}`
      );
      throw new Error("Error fetching investment stats from database");
    }

    const totalInvestmentsSGD = data.reduce(
      (sum, investment) => sum + investment.amountinsgd,
      0
    );
    const totalStocks = new Set(data.map((inv) => inv.stock)).size;
    const averageInvestmentSGD =
      data.length > 0 ? totalInvestmentsSGD / data.length : 0;

    logger.info(`InvestmentRepository: getInvestmentStatsFromDatabase success`);
    return {
      totalInvestmentsSGD,
      totalStocks,
      averageInvestmentSGD,
    };
  };

  getInvestmentsOverTimeFromDatabase = async (
    userId: string,
    type: "yearly" | "monthly" | "weekly" | "daily",
    date: string,
    userName?: string
  ): Promise<IInvestmentOverTime[]> => {
    const dateObj = new Date(date);
    let query = supabase
      .from("investments")
      .select("*")
      .eq("userid", userId)
      .order("date", { ascending: true });

    if (userName) {
      query = query.eq("username", userName);
    }

    // Filter by time period
    const { startDate, endDate } = getDateBasedOnCategoryType(type, date);
    query = query.gte("date", startDate).lte("date", endDate);

    const { data, error } = await query;

    if (error) {
      logger.error(
        `InvestmentRepository: getInvestmentsOverTimeFromDatabase error: ${error.message}`
      );
      throw new Error("Error fetching investments over time from database");
    }

    // Sort by date and calculate cumulative totals
    const sortedData = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const grouped: Map<string, { amountSGD: number; sortKey: number }> =
      new Map();
    let cumulativeSGD = 0;

    sortedData.forEach((investment: any) => {
      const txDate = new Date(investment.date);
      let period: string;
      let sortKey: number;

      if (type === "yearly") {
        period = txDate.getFullYear().toString();
        sortKey = txDate.getFullYear();
      } else if (type === "monthly") {
        period = txDate.toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        });
        sortKey = txDate.getFullYear() * 100 + txDate.getMonth();
      } else if (type === "weekly") {
        const startOfYear = new Date(txDate.getFullYear(), 0, 1);
        const daysSinceStart = Math.floor(
          (txDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
        );
        const weekNumber = Math.ceil(
          (daysSinceStart + startOfYear.getDay() + 1) / 7
        );
        period = `Week ${weekNumber} ${txDate.getFullYear()}`;
        sortKey = txDate.getFullYear() * 100 + weekNumber;
      } else {
        period = txDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        sortKey = txDate.getTime();
      }

      // Add to cumulative totals
      cumulativeSGD += investment.amountinsgd;

      // Store cumulative values for this period
      grouped.set(period, {
        amountSGD: cumulativeSGD,
        sortKey: sortKey,
      });
    });

    // Convert to array and sort by sortKey
    const result: IInvestmentOverTime[] = Array.from(grouped.entries())
      .sort((a, b) => a[1].sortKey - b[1].sortKey)
      .map(([period, data]) => ({
        period,
        totalSGD: data.amountSGD,
      }));

    logger.info(
      `InvestmentRepository: getInvestmentsOverTimeFromDatabase success`
    );
    return result;
  };

  getAggregatedInvestmentsFromDatabase = async (
    userId: string
  ): Promise<IInvestmentAggregated[]> => {
    const { data, error } = await supabase
      .from("investments")
      .select("username, stock, amountinsgd")
      .eq("userid", userId);

    if (error) {
      logger.error(
        `InvestmentRepository: getAggregatedInvestmentsFromDatabase error: ${error.message}`
      );
      throw new Error("Error fetching aggregated investments from database");
    }

    // Group by stock and aggregate by user
    const grouped: Record<
      string,
      {
        Anthony: number;
        Albert: number;
        Juliana: number;
      }
    > = {};

    data.forEach((investment: any) => {
      const stock = investment.stock;
      const userName = investment.username as "Anthony" | "Albert" | "Juliana";

      if (!grouped[stock]) {
        grouped[stock] = {
          Anthony: 0,
          Albert: 0,
          Juliana: 0,
        };
      }

      if (
        userName === "Anthony" ||
        userName === "Albert" ||
        userName === "Juliana"
      ) {
        grouped[stock][userName] += investment.amountinsgd;
      }
    });

    const result: IInvestmentAggregated[] = Object.entries(grouped).map(
      ([stock, users]) => ({
        stock,
        Anthony: users.Anthony,
        Albert: users.Albert,
        Juliana: users.Juliana,
      })
    );

    logger.info(
      `InvestmentRepository: getAggregatedInvestmentsFromDatabase success`
    );
    return result;
  };

  getUniqueStocksFromDatabase = async (userId: string): Promise<string[]> => {
    const { data, error } = await supabase
      .from("investments")
      .select("stock")
      .eq("userid", userId);

    if (error) {
      logger.error(
        `InvestmentRepository: getUniqueStocksFromDatabase error: ${error.message}`
      );
      throw new Error("Error fetching unique stocks from database");
    }

    const uniqueStocks = [...new Set(data.map((inv: any) => inv.stock))];

    logger.info(`InvestmentRepository: getUniqueStocksFromDatabase success`);
    return uniqueStocks;
  };

  updateInvestmentInDatabase = async (
    userId: string,
    investmentId: string,
    updatedInvestment: Partial<IInvestment>
  ): Promise<void> => {
    const updateData: any = {};
    if (updatedInvestment.userName !== undefined)
      updateData.username = updatedInvestment.userName;
    if (updatedInvestment.stock !== undefined)
      updateData.stock = updatedInvestment.stock;
    if (updatedInvestment.amountInSGD !== undefined)
      updateData.amountinsgd = updatedInvestment.amountInSGD;
    if (updatedInvestment.date !== undefined)
      updateData.date = updatedInvestment.date;

    const { error } = await supabase
      .from("investments")
      .update(updateData)
      .eq("id", investmentId)
      .eq("userid", userId);

    if (error) {
      logger.error(
        `InvestmentRepository: updateInvestmentInDatabase error: ${error.message}`
      );
      throw new Error("Error updating investment in database");
    }

    logger.info(
      `InvestmentRepository: updateInvestmentInDatabase success for investmentId: ${investmentId}`
    );
  };

  deleteInvestmentFromDatabase = async (
    userId: string,
    investmentId: string
  ): Promise<void> => {
    const { error } = await supabase
      .from("investments")
      .delete()
      .eq("id", investmentId)
      .eq("userid", userId);

    if (error) {
      logger.error(
        `InvestmentRepository: deleteInvestmentFromDatabase error: ${error.message}`
      );
      throw new Error("Error deleting investment from database");
    }

    logger.info(
      `InvestmentRepository: deleteInvestmentFromDatabase success for investmentId: ${investmentId}`
    );
  };

  getInvestmentByIdFromDatabase = async (
    userId: string,
    investmentId: string
  ): Promise<IInvestment> => {
    const { data, error } = await supabase
      .from("investments")
      .select("*")
      .eq("id", investmentId)
      .eq("userid", userId)
      .single();

    if (error) {
      logger.error(
        `InvestmentRepository: getInvestmentByIdFromDatabase error: ${error.message}`
      );
      throw new Error("Error fetching investment from database");
    }

    logger.info(
      `InvestmentRepository: getInvestmentByIdFromDatabase success for investmentId: ${investmentId}`
    );

    return this.mapToInvestment(data);
  };
}
