import type { QueryResolvers } from 'types/graphql'

import { loadCsvFile, loadExpenseGroupIds } from './loadExpenses'

const DIR_PATH = 'api/expense_data'

export const expenseGroupIds: QueryResolvers['expenseGroupIds'] = async () => {
  return { ids: await loadExpenseGroupIds(DIR_PATH) }
}

export const expenseGroup: QueryResolvers['expenseGroup'] = async (args) => {
  const { id, orderBy } = args
  let expenses = await loadCsvFile(`${DIR_PATH}/${id}.csv`)
  if (!orderBy) {
    return expenses
  }
  const { field, direction } = orderBy
  expenses = expenses.sort((a, b) => {
    const fieldA = a[field]
    const fieldB = b[field]

    if (direction === 'asc') {
      return fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0
    } else {
      return fieldA > fieldB ? -1 : fieldA < fieldB ? 1 : 0
    }
  })
  return { id: id, expenses: expenses }
}
