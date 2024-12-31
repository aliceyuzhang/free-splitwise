import { Navbar } from 'flowbite-react'

import { Link, routes } from '@redwoodjs/router'

const Nav = () => {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand href={routes.home()}>
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          My Free Splitwise
        </span>
      </Navbar.Brand>
      <Navbar.Collapse>
        <Link to={routes.home()}>Home</Link>
        <Link to={routes.about()}>About</Link>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Nav
