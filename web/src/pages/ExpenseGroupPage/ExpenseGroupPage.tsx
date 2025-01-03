// import { Link, routes } from '@redwoodjs/router'
import React, { useMemo, useState } from 'react'

import { Pagination } from 'flowbite-react'
import { Expense } from 'types/graphql'

import { useParams } from '@redwoodjs/router'
import { Metadata, useQuery } from '@redwoodjs/web'

import BalanceModal from 'src/components/BalanceModal/BalanceModal'
import { Balance } from 'src/components/Utils/utils'

export const QUERY = gql`
  query ExpenseGroupQuery($id: String!) {
    expenseGroup(id: $id, orderBy: { direction: "asc", field: "date" }) {
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

const rowsPerPage = 10

const ExpenseGroupPage = () => {
  const { id } = useParams()
  const [openModal, setOpenModal] = useState(false)

  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      id,
      orderBy: {
        filed: 'date',
        direction: 'asc',
      },
    },
  })

  const balances: Balance[] = useMemo(() => {
    const expenses: Expense[] = data?.expenseGroup?.expenses ?? []
    const people = Array.from(new Set(expenses.map(({ paidBy }) => paidBy)))
    const perPersonCost =
      expenses.reduce((sum, { amount }) => sum + amount, 0) / people.length
    return people.map((person) => ({
      person: person,
      balance:
        perPersonCost -
        expenses
          .filter(({ paidBy }) => paidBy == person)
          .reduce((sum, { amount }) => sum + amount, 0),
    }))
  }, [data])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const onModalClosed = () => {
    setOpenModal(false)
  }

  return (
    <>
      <Metadata title="ExpenseGroup" />
      <div className="flex items-center justify-between mb-4 spacing">
        <h1 className="text-xl font-bold">{id}</h1>
        <button
          type="button"
          className="show-balance-button"
          onClick={() => setOpenModal(true)}
        >
          Show Balances
        </button>
      </div>
      <BalanceModal
        balances={balances}
        openModal={openModal}
        onModalClosed={onModalClosed}
      />

      <ExpenseTable expenses={data.expenseGroup.expenses} />
    </>
  )
}

const THeader = ({ header }) => {
  return <th scope="col">{header}</th>
}

const ExpenseTable = ({ expenses }: { expenses: Expense[] }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(expenses.length / rowsPerPage)
  // Get current page data
  const currentData = useMemo(
    () =>
      expenses.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      ),
    [currentPage, expenses]
  )
  const onPageChange = (page: number) => setCurrentPage(page)

  return (
    <div className="relative overflow-x-auto spacing">
      {/* Transaction details */}
      <table className="table bottom-spacing">
        <thead className="thead">
          <tr>
            <THeader header="Date" />
            <THeader header="Amount" />
            <THeader header="Category" />
            <THeader header="Description" />
            <THeader header="Paid By" />
          </tr>
        </thead>
        <tbody>
          {currentData.map((expense, index) => (
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

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  )
}

export default ExpenseGroupPage
