import { render } from '@redwoodjs/testing/web'

import AddExpenseModal from './AddExpenseModal'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('AddExpenseModal', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AddExpenseModal />)
    }).not.toThrow()
  })
})
