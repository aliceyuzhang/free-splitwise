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

const THeader = ({ header }) => {
  return <th scope="col">{header}</th>
}

const ExpenseTable = ({ expenses }) => {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <THeader header="Date" />
            <THeader header="Amount" />
            <THeader header="Category" />
            <THeader header="Description" />
            <THeader header="Paid By" />
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              key={index}
            >
              <td>{expense.date}</td>
              <td>{expense.amount}</td>
              <td>{expense.category}</td>
              <td>{expense.description}</td>
              <td>{expense.paidBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ExpenseGroupPage
