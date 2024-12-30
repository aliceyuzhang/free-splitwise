// import { Link, routes } from '@redwoodjs/router'
import React, { useCallback, useMemo, useState } from 'react'

import { Button, Modal } from 'flowbite-react'
import { Expense } from 'types/graphql'

import { useParams } from '@redwoodjs/router'
import { Metadata, useQuery } from '@redwoodjs/web'

import { formatMoney } from 'src/components/Utils/utils'

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

const ExpenseTable = ({ expenses }: { expenses: Expense[] }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [openModal, setOpenModal] = useState(false)
  const rowsPerPage = 10
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

  const balances = useMemo(() => {
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
  }, [expenses])

  return (
    <div className="relative overflow-x-auto">
      <button
        type="button"
        className="calculate-button"
        onClick={() => setOpenModal(true)}
      >
        Calculate
      </button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Balances</Modal.Header>
        <Modal.Body className="spacing">
          <div className="space-y-6">
            {balances.map((balanceOwed, index) => (
              <p
                className="text-base leading-relaxed text-gray-500 dark:text-gray-400"
                key={index}
              >
                {balanceOwed.person}: {formatMoney(balanceOwed.balance)}
              </p>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      <table className="table">
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
      <div className="flex justify-center items-center mt-4 space-x-1">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 text-sm rounded-lg ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 text-sm rounded-lg ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 text-sm rounded-lg ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default ExpenseGroupPage
