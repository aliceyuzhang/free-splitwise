import { useState } from 'react'

import { Button, Datepicker, Label, Modal, TextInput } from 'flowbite-react'
import { Expense } from 'types/graphql'

type Props = {
  openModal: boolean
  onSubmitted: (expense: Expense) => void
  onClosed: () => void
}

const AddExpenseModal = ({ openModal, onSubmitted, onClosed }: Props) => {
  const [paidBy, setPaidBy] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date())
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')

  const resetForm = () => {
    setPaidBy('')
    setAmount('')
    setCategory('')
    setDate(new Date())
    setDescription('')
  }

  return (
    <Modal show={openModal} onClose={onClosed}>
      <Modal.Header>Add Expense</Modal.Header>
      <Modal.Body className="spacing">
        <div className="space-y-6">
          <form className="flex max-w-md flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="paidby" value="Paid By" />
              </div>
              <TextInput
                id="paidby"
                type="text"
                placeholder=""
                value={paidBy}
                onChange={(event) => {
                  setPaidBy(event.target.value)
                }}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="amount" value="Amount" />
              </div>
              <TextInput
                id="amount"
                type="number"
                addon="$"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value)
                }}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="date" value="Date" />
              </div>
              <Datepicker
                id="date"
                type="datepicker"
                value={date}
                onChange={(event) => {
                  setDate(event)
                }}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="category" value="Category" />
              </div>
              <TextInput
                id="category"
                type="text"
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value)
                }}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="description" value="Description" />
                <TextInput
                  id="description"
                  type="text"
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value)
                  }}
                  required
                />
              </div>
            </div>
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          color="gray"
          onClick={() => {
            onSubmitted({
              paidBy: paidBy,
              amount: Number(amount),
              date: date.toISOString().slice(0, 10),
              category: category,
              description: description,
            })
            resetForm()
          }}
        >
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddExpenseModal
