import { render } from '@redwoodjs/testing/web'

import GoogleAccess from './GoogleSheetAccess'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('GoogleSheetAccess', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<GoogleAccess />)
    }).not.toThrow()
  })
})
