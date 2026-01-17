import { BudgetList } from "@/app/_components/budgets/budget-list";
import { DashBoardAndTransactionLayout } from "../_components/layout/dashboard-and-transaction-layout";

export default function BudgetsPage() {
  return (
    <DashBoardAndTransactionLayout>
      <BudgetList />
    </DashBoardAndTransactionLayout>
  );
}
