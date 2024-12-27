// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  expenseGroups: [
    {
      __typename: 'ExpenseGroups' as const,
      id: 42,
    },
    {
      __typename: 'ExpenseGroups' as const,
      id: 43,
    },
    {
      __typename: 'ExpenseGroups' as const,
      id: 44,
    },
  ],
})
