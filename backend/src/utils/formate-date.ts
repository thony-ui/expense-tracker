export const getCurrentWeekStart = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Handle Sunday (0) and other days
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  return monday.toISOString().split("T")[0];
};
