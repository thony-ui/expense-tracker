export const getCurrentWeekStart = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Handle Sunday (0) and other days
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  return monday.toISOString().split("T")[0];
};

export const formatDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const getDateBasedOnCategoryType = (type: string, date: string) => {
  switch (type) {
    case "yearly": {
      const year = date
        ? new Date(date).getFullYear().toString()
        : new Date().getFullYear().toString();
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      return { startDate, endDate };
    }
    case "monthly": {
      const selectedDate = date ? new Date(date) : new Date();
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth(); // 0-based

      // Start of month: YYYY-MM-01
      const startDateStr = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      // End of month: last day of month
      const endDateObj = new Date(year, month + 1, 0); // last day of month
      const endDateStr = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(endDateObj.getDate()).padStart(2, "0")}`;
      return { startDate: startDateStr, endDate: endDateStr };
    }
    case "weekly": {
      const baseDate = date ? new Date(date) : new Date();
      // Calculate start of week (Monday)
      const dayOfWeek = baseDate.getDay(); // 0 (Sun) - 6 (Sat)
      const diffToMonday = (dayOfWeek + 6) % 7; // days since Monday
      const startDate = new Date(baseDate);
      startDate.setDate(baseDate.getDate() - diffToMonday);

      // End of week is 6 days after start
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      const startDateStr = formatDate(startDate); // "yyyy-mm-dd"
      const endDateStr = formatDate(endDate); // "yyyy-mm-dd"
      return { startDate: startDateStr, endDate: endDateStr };
    }
    case "daily": {
      const currentDate = date || new Date().toISOString().split("T")[0];
      return { startDate: currentDate, endDate: currentDate };
    }
    default:
      return { startDate: date, endDate: date }; // Default to full date
  }
};
