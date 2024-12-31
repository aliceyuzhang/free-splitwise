import Nav from 'src/components/Nav/Nav'

const PageLayout = ({ children }) => {
  return (
    <>
      <div id="page-container">
        <Nav />
        <div id="page-content">
          <main>{children}</main>
        </div>
      </div>
    </>
  )
}

export default PageLayout
