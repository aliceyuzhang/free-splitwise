import type { QueryResolvers } from 'types/graphql'

import { loadCsvFile, loadExpenseGroupIds } from './loadExpenses'

export const expenseGroupIds: QueryResolvers['expenseGroupIds'] = async () => {
  return { ids: await loadExpenseGroupIds(DIR_PATH) }
}

export const expenseGroup: QueryResolvers['expenseGroup'] = async ({ id }) => {
  const csvData = () => loadCsvFile(`${DIR_PATH}/${id}.csv`)
  return { id: id, expenses: csvData }
}

const DIR_PATH = 'api/expense_data'
