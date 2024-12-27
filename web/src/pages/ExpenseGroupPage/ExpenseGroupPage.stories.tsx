import type { Meta, StoryObj } from '@storybook/react'

import ExpenseGroupPage from './ExpenseGroupPage'

const meta: Meta<typeof ExpenseGroupPage> = {
  component: ExpenseGroupPage,
}

export default meta

type Story = StoryObj<typeof ExpenseGroupPage>

export const Primary: Story = {}
