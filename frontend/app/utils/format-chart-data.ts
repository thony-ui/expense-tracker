import { ITransaction } from "@/lib/types";

export function getMonthlyChartData(monthlyTransactions: ITransaction[]) {
  if (!monthlyTransactions) return [];

  const monthlyData: Record<string, { income: number; expense: number }> = {};

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  months.forEach((month) => {
    monthlyData[month] = { income: 0, expense: 0 };
  });

  // Aggregate transaction data
  monthlyTransactions.forEach((tx) => {
    const date = new Date(tx.date);
    const month = months[date.getMonth()];

    if (tx.type === "income") {
      monthlyData[month].income += tx.amount;
    } else {
      monthlyData[month].expense += tx.amount;
    }
  });

  // Format for chart
  return months.map((month) => ({
    month,
    income: monthlyData[month].income,
    expense: monthlyData[month].expense,
  }));
}

export function getYearlyChartData(yearlyTransactions: ITransaction[]) {
  if (!yearlyTransactions) return [];

  // Create yearly aggregates
  const yearlyData: Record<string, { income: number; expense: number }> = {};

  // Get unique years from transactions
  const years = Array.from(
    new Set(
      yearlyTransactions.map((tx) => new Date(tx.date).getFullYear().toString())
    )
  ).sort();

  // Initialize years
  years.forEach((year) => {
    yearlyData[year] = { income: 0, expense: 0 };
  });

  // Aggregate transaction data
  yearlyTransactions.forEach((tx) => {
    const year = new Date(tx.date).getFullYear().toString();

    if (tx.type === "income") {
      yearlyData[year].income += tx.amount;
    } else {
      yearlyData[year].expense += tx.amount;
    }
  });

  // Format for chart (keeping "month" key for consistency with chart component)
  return years
    .map((year) => ({
      year: year, // Using "month" key for consistency
      income: yearlyData[year].income,
      expense: yearlyData[year].expense,
    }))
    .sort((a, b) => parseInt(a.year) - parseInt(b.year));
}
export function getWeeklyChartData(weeklyTransactions: ITransaction[]) {
  if (!weeklyTransactions) return [];

  // Group by ISO week
  const weeklyData: Record<string, { income: number; expense: number }> = {};

  // Helper to get week identifier
  const getWeekId = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekStart = new Date(date);
    weekStart.setDate(
      date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)
    ); // Start from Monday
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const formatDate = (d: Date) => {
      return `${d.getMonth() + 1}/${d.getDate()}`;
    };

    return `${formatDate(weekStart)}-${formatDate(weekEnd)}`;
  };

  // Get unique weeks
  const weeks = Array.from(
    new Set(weeklyTransactions.map((tx) => getWeekId(tx.date)))
  ).sort();

  // Initialize weeks
  weeks.forEach((week) => {
    weeklyData[week] = { income: 0, expense: 0 };
  });

  // Aggregate transaction data
  weeklyTransactions.forEach((tx) => {
    const week = getWeekId(tx.date);

    if (tx.type === "income") {
      weeklyData[week].income += tx.amount;
    } else {
      weeklyData[week].expense += tx.amount;
    }
  });

  // Format for chart (keeping "month" key for consistency with chart component)
  return weeks
    .map((week) => ({
      week: `${week}`, // Using "month" key for consistency
      income: weeklyData[week].income,
      expense: weeklyData[week].expense,
    }))
    .sort((a, b) => {
      const [startA, endA] = a.week.split("-");
      const [startB, endB] = b.week.split("-");

      const startComparison =
        new Date(startA).getTime() - new Date(startB).getTime();
      if (startComparison !== 0) return startComparison;

      return new Date(endA).getTime() - new Date(endB).getTime();
    });
}
export function getDailyChartData(dailyTransactions: ITransaction[]) {
  if (!dailyTransactions) return [];

  // Group by day
  const dailyData: Record<string, { income: number; expense: number }> = {};

  // Helper to format date
  const formatDay = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Get unique days
  const days = Array.from(
    new Set(dailyTransactions.map((tx) => formatDay(tx.date)))
  ).sort();

  // Initialize days
  days.forEach((day) => {
    dailyData[day] = { income: 0, expense: 0 };
  });

  // Aggregate transaction data
  dailyTransactions.forEach((tx) => {
    const day = formatDay(tx.date);

    if (tx.type === "income") {
      dailyData[day].income += tx.amount;
    } else {
      dailyData[day].expense += tx.amount;
    }
  });

  // Format for chart (keeping "month" key for consistency with chart component)
  return days
    .map((day) => ({
      day: day, // Using "month" key for consistency
      income: dailyData[day].income,
      expense: dailyData[day].expense,
    }))
    .sort((a, b) => {
      const [monthA, dateA] = a.day.split("/");
      const [monthB, dateB] = b.day.split("/");

      const monthComparison = parseInt(monthA) - parseInt(monthB);
      if (monthComparison !== 0) return monthComparison;

      return parseInt(dateA) - parseInt(dateB);
    });
}
