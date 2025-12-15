import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import Header from './components/Header'
import LedgerSummary from './components/LedgerSummary'
import TransactionList from './components/TransactionList'
import AddTransactionForm from './components/AddTransactionForm'
import './App.css'

function App() {
  const [transactions, setTransactions] = useLocalStorage('guju-khata-transactions', [])
  const [showForm, setShowForm] = useState(false)

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      date: new Date().toISOString()
    }
    setTransactions([newTransaction, ...transactions])
    setShowForm(false)
  }

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      setTransactions([])
    }
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <LedgerSummary transactions={transactions} />
        
        <div className="actions">
          <button 
            className="btn btn-primary" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Add Transaction'}
          </button>
          {transactions.length > 0 && (
            <button 
              className="btn btn-danger" 
              onClick={clearAllData}
            >
              Clear All Data
            </button>
          )}
        </div>

        {showForm && (
          <AddTransactionForm 
            onSubmit={addTransaction}
            onCancel={() => setShowForm(false)}
          />
        )}

        <TransactionList 
          transactions={transactions}
          onDelete={deleteTransaction}
        />
      </main>
    </div>
  )
}

export default App
