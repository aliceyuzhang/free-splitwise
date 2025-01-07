// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import GoogleAccess from 'src/components/GoogleAccess/GoogleSheetAccess'

const HomePage = () => {
  return (
    <>
      <Metadata title="Home" description="Home page" />
      <div id="home">
        <div className="spacing">
          <GoogleAccess />
        </div>
        {/* <div className="spacing">
            <h3>Local CSV Files</h3>
            <ExpenseGroupsCell />
          </div> */}
      </div>
    </>
  )
}

export default HomePage
