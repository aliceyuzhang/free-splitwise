import { render } from '@redwoodjs/testing/web'

import ExpenseGroupPage from './ExpenseGroupPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ExpenseGroupPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ExpenseGroupPage />)
    }).not.toThrow()
  })
})
