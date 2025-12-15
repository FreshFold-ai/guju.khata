import { useState } from 'react'
import './AddTransactionForm.css'

function AddTransactionForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: ''
  })

  const categories = {
    income: [
      'Salary',
      'Business',
      'Investment',
      'Real Estate',
      'Freelance',
      'Gift',
      'Other Income'
    ],
    expense: [
      'Bills',
      'Debt Payment',
      'Investment',
      'Real Estate',
      'Commodities',
      'Food',
      'Transportation',
      'Entertainment',
      'Shopping',
      'Healthcare',
      'Other Expense'
    ]
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset category when type changes
      ...(name === 'type' ? { category: '' } : {})
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.category || !formData.amount) {
      alert('Please fill in all required fields')
      return
    }

    if (parseFloat(formData.amount) <= 0) {
      alert('Amount must be greater than zero')
      return
    }

    onSubmit(formData)
    
    // Reset form
    setFormData({
      type: 'expense',
      category: '',
      amount: '',
      description: ''
    })
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="transaction-form">
        <h3>Add New Transaction</h3>
        
        <div className="form-group">
          <label htmlFor="type">Type *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories[formData.type].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount ($) *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            placeholder="0.00"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional notes about this transaction"
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Add Transaction
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddTransactionForm
