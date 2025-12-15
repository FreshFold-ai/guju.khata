import './TransactionList.css'

function TransactionList({ transactions, onDelete }) {
  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>📝 No transactions yet. Add your first transaction to get started!</p>
      </div>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="transaction-list">
      <h2>Transaction History</h2>
      <div className="transactions">
        {transactions.map(transaction => (
          <div 
            key={transaction.id} 
            className={`transaction-item ${transaction.type}`}
          >
            <div className="transaction-info">
              <div className="transaction-header">
                <span className="category">{transaction.category}</span>
                <span className="date">{formatDate(transaction.date)}</span>
              </div>
              {transaction.description && (
                <p className="description">{transaction.description}</p>
              )}
            </div>
            <div className="transaction-amount">
              <span className={`amount ${transaction.type}`}>
                {transaction.type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
              </span>
              <button 
                className="delete-btn"
                onClick={() => onDelete(transaction.id)}
                title="Delete transaction"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TransactionList
