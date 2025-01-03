import { Button, Modal } from 'flowbite-react'

import { formatMoney } from '../Utils/utils'

const verb = (balanceOwed: number) => (balanceOwed > 0 ? 'owes' : 'gets back')

const BalanceModal = ({ balances, openModal, onModalClosed }) => {
  return (
    <Modal show={openModal} onClose={onModalClosed}>
      <Modal.Header>Balances</Modal.Header>
      <Modal.Body className="spacing">
        <div className="space-y-6">
          {balances.map((balanceOwed, index) => (
            <p
              className="text-base leading-relaxed text-gray-500 dark:text-gray-400"
              key={index}
            >
              {balanceOwed.person} {verb(balanceOwed.balance)}{' '}
              {formatMoney(Math.abs(balanceOwed.balance))}
            </p>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={onModalClosed}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default BalanceModal
