import './LedgerSummary.css'

function LedgerSummary({ transactions }) {
  const calculateTotals = () => {
    let income = 0
    let expenses = 0
    
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        income += parseFloat(transaction.amount)
      } else {
        expenses += parseFloat(transaction.amount)
      }
    })
    
    return {
      income,
      expenses,
      balance: income - expenses
    }
  }

  const totals = calculateTotals()

  return (
    <div className="ledger-summary">
      <div className="summary-card income">
        <h3>Total Income</h3>
        <p className="amount">${totals.income.toFixed(2)}</p>
      </div>
      <div className="summary-card expenses">
        <h3>Total Expenses</h3>
        <p className="amount">${totals.expenses.toFixed(2)}</p>
      </div>
      <div className="summary-card balance">
        <h3>Net Balance</h3>
        <p className="amount">${totals.balance.toFixed(2)}</p>
      </div>
    </div>
  )
}

export default LedgerSummary
