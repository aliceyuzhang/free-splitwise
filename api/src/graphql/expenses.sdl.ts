export const schema = gql`
  input OrderByInput {
    field: String!
    direction: String! # 'asc' or 'desc'
  }

  type ExpenseGroup {
    id: String!
    expenses(orderBy: OrderByInput): [Expense!]!
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
    expenseGroup(id: String!, orderBy: OrderByInput): ExpenseGroup! @skipAuth
  }
`
