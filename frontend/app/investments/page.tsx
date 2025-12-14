import React from "react";
import { InvestmentsOverview } from "./_components/investments-overview";
import { DashBoardAndTransactionLayout } from "../_components/layout/dashboard-and-transaction-layout";

function InvestmentsPage() {
  return (
    <DashBoardAndTransactionLayout>
      <InvestmentsOverview />
    </DashBoardAndTransactionLayout>
  );
}

export default InvestmentsPage;
