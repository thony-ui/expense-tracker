import { DashboardOverview } from "@/app/_components/dashboard/dashboard-overview";
import { DashBoardAndTransactionLayout } from "./_components/layout/dashboard-and-transaction-layout";

export default async function DashboardPage() {
  return (
    <DashBoardAndTransactionLayout>
      <DashboardOverview />
    </DashBoardAndTransactionLayout>
  );
}
