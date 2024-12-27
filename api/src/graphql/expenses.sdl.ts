export const schema = gql`
  type ExpenseGroup {
    id: String!
    expenses: [Expense!]!
  }

  type Expense {
    # date,amount,category,description,paid by
    date: String
    amount: Float
    category: String
    description: String
    paidBy: String
  }

  type ExpenseGroupIds {
    ids: [String!]!
  }
  type Query {
    expenseGroupIds: ExpenseGroupIds @skipAuth
    expenseGroup(id: String!): ExpenseGroup! @skipAuth
  }
`
