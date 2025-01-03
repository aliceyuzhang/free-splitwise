// import { Link, routes } from '@redwoodjs/router'

import { GoogleOAuthProvider } from '@react-oauth/google'

import { Metadata } from '@redwoodjs/web'

import ExpenseGroupsCell from 'src/components/ExpenseGroupsCell'
import GoogleAccess from 'src/components/GoogleAccess/GoogleSheetAccess'
import GoogleFileReader from 'src/components/GoogleFileReader/GoogleFileReader'

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
