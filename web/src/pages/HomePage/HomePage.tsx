// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import ExpenseGroupsCell from 'src/components/ExpenseGroupsCell'

const HomePage = () => {
  return (
    <>
      <Metadata title="Home" description="Home page" />

      <h1>HomePage</h1>
      <ExpenseGroupsCell />
      <p></p>
    </>
  )
}

export default HomePage
