export const formatMoney = (number: number) => {
  return `$${number.toFixed(2)}`
}

export interface Balance {
  person: string
  balance: number
}
