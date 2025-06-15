export function formatLLMContext(
  expenses: {
    id: string;
    amount: number;
    category: string;
    description: string;
    date: string;
    type: string;
  }[]
): string {
  const expensesXML = `
<expenses>
${
  expenses
    .map(
      (expense) => `
  <expense>
    <id>${expense.id}</id>
    <amount>${expense.amount}</amount>
    <category>${expense.category}</category>
    <description>${expense.description || ""}</description>
    <date>${expense.date}</date>
    <type>${expense.type}</type>
  </expense>
`
    )
    .join("") || "  <expense>No expenses found</expense>"
}
</expenses>`;
  return expensesXML;
}
