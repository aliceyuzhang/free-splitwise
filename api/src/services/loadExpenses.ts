import * as fs from 'fs'
import path from 'path'

import Papa from 'papaparse'

interface Expense {
  date: string
  amount: number
  category: string
  description: string
  paidBy: string
}

export async function loadCsvFile(filePath: string): Promise<Expense[]> {
  const file = fs.createReadStream(filePath)
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      // download: false, // set to true if you're loading from a URL
      complete: (results) => {
        const expenses = results.data.map((expense) => {
          const result: Expense = {
            date: expense['date'],
            amount: expense['amount'],
            category: expense['category'],
            description: expense['description'],
            paidBy: expense['paid by'],
          }
          return result
        })
        resolve(expenses)
      },
      error: (error) => {
        reject(error)
      },
    })
  })
}

export async function loadExpenseGroupIds(dirPath: string): Promise<string[]> {
  return fs.readdirSync(dirPath).map((file) => path.basename(file, '.csv'))
}
