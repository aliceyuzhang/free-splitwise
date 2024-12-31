// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import ExpenseGroupsCell from 'src/components/ExpenseGroupsCell'

const HomePage = () => {
  return (
    <>
      <Metadata title="Home" description="Home page" />
      <div id="home">
        <ExpenseGroupsCell />
      </div>
    </>
  )
}

export default HomePage
