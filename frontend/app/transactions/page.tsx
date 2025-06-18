import React from "react";
import { TransactionsOverview } from "./_components/transactions-overview";
import { DashBoardAndTransactionLayout } from "../_components/layout/dashboard-and-transaction-layout";

function TransactionsPage() {
  return (
    <DashBoardAndTransactionLayout>
      <TransactionsOverview />
    </DashBoardAndTransactionLayout>
  );
}

export default TransactionsPage;
