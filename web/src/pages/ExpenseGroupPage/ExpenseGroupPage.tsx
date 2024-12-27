// import { Link, routes } from '@redwoodjs/router'
import { useParams } from '@redwoodjs/router'
import { Metadata, useQuery } from '@redwoodjs/web'

export const QUERY = gql`
  query ExpenseGroupQuery($id: String!) {
    expenseGroup(id: $id) {
      expenses {
        date
        amount
        category
        description
        paidBy
      }
    }
  }
`

const ExpenseGroupPage = () => {
  const { id } = useParams()

  const { data, loading, error } = useQuery(QUERY, {
    variables: { id },
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <>
      <Metadata title="ExpenseGroup" />
      <h1>{id}</h1>
      <ExpenseTable expenses={data.expenseGroup.expenses} />
    </>
  )
}

const ExpenseTable = ({ expenses }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Amount</th>
          <th>Category</th>
          <th>Description</th>
          <th>Paid By</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense, index) => (
          <tr key={index}>
            <td>{expense.date}</td>
            <td>{expense.amount}</td>
            <td>{expense.category}</td>
            <td>{expense.description}</td>
            <td>{expense.paidBy}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ExpenseGroupPage
