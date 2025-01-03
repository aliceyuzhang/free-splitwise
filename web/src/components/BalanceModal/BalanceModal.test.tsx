import { render } from '@redwoodjs/testing/web'

import BalanceModal from './BalanceModal'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('BalanceModal', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<BalanceModal />)
    }).not.toThrow()
  })
})
