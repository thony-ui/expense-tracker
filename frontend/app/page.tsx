import { DashboardLayout } from "@/app/_components/layout/dashboard-layout";
import { DashboardOverview } from "@/app/_components/dashboard/dashboard-overview";

export default async function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  );
}
