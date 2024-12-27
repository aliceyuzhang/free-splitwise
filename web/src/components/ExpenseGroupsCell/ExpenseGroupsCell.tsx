import { ExpenseGroupIdsQuery } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { CellSuccessProps } from '@redwoodjs/web'

export const QUERY = gql`
  query ExpenseGroupIdsQuery {
    expenseGroupIds {
      ids
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Success = ({
  expenseGroupIds,
}: CellSuccessProps<ExpenseGroupIdsQuery>) => {
  return (
    <ul>
      {expenseGroupIds.ids.map((id) => (
        <li key={id}>
          <Link to={routes.expenseGroup({ id })}>{id}</Link>
        </li>
      ))}
    </ul>
  )
}
