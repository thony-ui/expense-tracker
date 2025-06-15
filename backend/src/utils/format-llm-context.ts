export function formatLLMContext(
  transactions: {
    id: string;
    amount: number;
    category: string;
    description: string;
    date: string;
    type: string;
  }[]
): string {
  const expensesXML = `
<transactions>
${
  transactions
    .map(
      (transaction) => `
  <transaction>
    <id>${transaction.id}</id>
    <amount>${transaction.amount}</amount>
    <category>${transaction.category}</category>
    <description>${transaction.description}</description>
    <date>${transaction.date}</date>
    <type>${transaction.type}</type>
  </transaction>
`
    )
    .join("") || "  <transaction>No transactions found</transaction>"
}
</transactions>`;
  return expensesXML;
}
