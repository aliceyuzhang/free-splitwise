// import { Link, routes } from '@redwoodjs/router'
import React, { useEffect, useMemo, useState } from 'react'

import { Pagination } from 'flowbite-react'
import Papa from 'papaparse'
import { Expense } from 'types/graphql'

import { useParams } from '@redwoodjs/router'
import { Metadata, useQuery } from '@redwoodjs/web'

import AddExpenseModal from 'src/components/AddExpenseModal/AddExpenseModal'
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
  const [googleSheetData, setGoogleSheetData] = useState([])
  const [googleSheetError, setGoogleSheetError] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [addExpenseModal, setAddExpenseModal] = useState(false)
  const { data, loading, error } = useQuery(QUERY, {
    variables: { id },
    skip: id.startsWith('google-'), // Skip query for Google Sheets
  })

  useEffect(() => {
    if (id.startsWith('google-')) {
      const fileId = id.substring('google-'.length)
      const fetchGoogleSheet = async () => {
        try {
          const exportResponse = await fetch(
            `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/csv`,
            {
              headers: {
                Authorization: `Bearer ${
                  JSON.parse(localStorage.getItem('google-access-token'))[
                    'token'
                  ]
                }`,
              },
            }
          )
          if (!exportResponse.ok) {
            throw new Error(
              `Failed to fetch Google Sheet: ${exportResponse.statusText}`
            )
          }
          const expenses = parseCSV(await exportResponse.text())
          setGoogleSheetData(expenses)
        } catch (err) {
          setGoogleSheetError(err.message)
        }
      }
      fetchGoogleSheet()
    }
  }, [id])

  const expenses = useMemo(() => {
    if (id.startsWith('google-')) {
      return googleSheetData || []
    }
    return data?.expenseGroup?.expenses || []
  }, [googleSheetData, data, id])

  const balances: Balance[] = useMemo(() => {
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

  if (loading || (id.startsWith('google-') && !googleSheetData))
    return <div>Loading...</div>
  if (error || googleSheetError)
    return <div>Error: {error?.message || googleSheetError}</div>

  const onModalClosed = () => {
    setOpenModal(false)
  }

  const onAddExpenseModalClosed = () => {
    setAddExpenseModal(false)
  }

  const onExpenseSubmitted = (expense: Expense) => {
    setAddExpenseModal(false)
    expenses.push(expense)
  }

  return (
    <>
      <Metadata title="ExpenseGroup" />
      <div className="flex items-center justify-between mb-4 spacing">
        <h1 className="text-xl font-bold">{id}</h1>
        <div>
          <button
            type="button"
            className="add-expense-button"
            onClick={() => setAddExpenseModal(true)}
          >
            Add Expense
          </button>
          <button
            type="button"
            className="show-balance-button"
            onClick={() => setOpenModal(true)}
          >
            Show Balances
          </button>
        </div>
      </div>

      <BalanceModal
        balances={balances}
        openModal={openModal}
        onModalClosed={onModalClosed}
      />
      <AddExpenseModal
        openModal={addExpenseModal}
        onSubmitted={onExpenseSubmitted}
        onClosed={onAddExpenseModalClosed}
      />

      <ExpenseTable expenses={expenses} />
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

const parseCSV = (csvData) => {
  const expenses = Papa.parse(csvData, { header: true }).data.map((expense) => {
    return {
      date: expense['date'],
      amount: Number(expense['amount']),
      category: expense['category'],
      description: expense['description'],
      paidBy: expense['paid by'],
    }
  })
  return expenses
}

export default ExpenseGroupPage
