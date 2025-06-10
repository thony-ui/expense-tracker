import type { ICategory } from "./types";

export const EXPENSE_CATEGORIES: ICategory[] = [
  { id: "1", name: "Food & Dining", color: "#FF6B6B", icon: "🍽️" },
  { id: "2", name: "Transportation", color: "#4ECDC4", icon: "🚗" },
  { id: "3", name: "Shopping", color: "#45B7D1", icon: "🛍️" },
  { id: "4", name: "Entertainment", color: "#96CEB4", icon: "🎬" },
  { id: "5", name: "Bills & Utilities", color: "#FFEAA7", icon: "💡" },
  { id: "6", name: "Healthcare", color: "#DDA0DD", icon: "🏥" },
  { id: "7", name: "Education", color: "#98D8C8", icon: "📚" },
  { id: "8", name: "Other", color: "#F7DC6F", icon: "📦" },
];

export const INCOME_CATEGORIES: ICategory[] = [
  { id: "9", name: "Salary", color: "#52C41A", icon: "💼" },
  { id: "10", name: "Freelance", color: "#1890FF", icon: "💻" },
  { id: "11", name: "Investment", color: "#722ED1", icon: "📈" },
  { id: "12", name: "Other Income", color: "#13C2C2", icon: "💰" },
];
