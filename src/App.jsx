import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState('')
  const [colorIndex, setColorIndex] = useState(0)
  const [scrollAccumulator, setScrollAccumulator] = useState(0)
  const [mainTitleKey, setMainTitleKey] = useState(0)
  const [subTitleKey, setSubTitleKey] = useState(0)
  const [currencyIndex, setCurrencyIndex] = useState(0)
  const [currencySelectorActive, setCurrencySelectorActive] = useState(false)
  const [exchangeRates, setExchangeRates] = useState(null)
  const [userName, setUserName] = useState('')
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const prevMainTitle = useRef('')
  const prevSubTitle = useRef('')

  const API_KEY = import.meta.env.VITE_CURRENCY_API_KEY
  const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

  const colors = [
    '#6B4E4E', // Soft Dusty Rose
    '#7A5C47', // Warm Taupe
    '#6F6B4A', // Muted Olive
    '#4E6159', // Sage Green
    '#4D5A6B', // Soft Slate Blue
    '#55496B', // Dusty Purple
    '#6B4E63', // Muted Plum
    '#2d2d2d'  // Charcoal
  ]

  const titles = [
    'Commercial - Retail       ',
    'Commercial - Office       ',
    'Commercial - Industrial   ',
    'Commercial - Hospitality  ',
    'Commercial - empty Plot   ',
    'Residential - empty Plot  ',
    'Residential - Single      ',
    'Residential - Multi       ',
  ]

  const currencies = [
    { symbol: '$', code: 'USD' },
    { symbol: '€', code: 'EUR' },
    { symbol: '£', code: 'GBP' },
    { symbol: '¥', code: 'JPY' },
    { symbol: '₹', code: 'INR' },
    { symbol: '₽', code: 'RUB' },
    { symbol: '₩', code: 'KRW' },
    { symbol: '₪', code: 'ILS' }
  ]

  const currentMainTitle = titles[colorIndex].split(' - ')[0].trim()
  const currentSubTitle = titles[colorIndex].split(' - ')[1].trim()

  // Convert amount between currencies
  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    if (!exchangeRates) return amount
    
    const currencyCodeMap = {
      'USD': 'USD',
      'EUR': 'EUR',
      'GBP': 'GBP',
      'JPY': 'JPY',
      'INR': 'INR',
      'RUB': 'RUB',
      'KRW': 'KRW',
      'ILS': 'ILS'
    }
    
    const fromCode = currencyCodeMap[fromCurrency]
    const toCode = currencyCodeMap[toCurrency]
    
    if (!fromCode || !toCode || !exchangeRates[fromCode] || !exchangeRates[toCode]) {
      return amount
    }
    
    // Convert to USD first (base currency), then to target currency
    const amountInUSD = amount / exchangeRates[fromCode]
    const convertedAmount = amountInUSD * exchangeRates[toCode]
    
    return convertedAmount
  }

  const handleNameInput = (e) => {
    if (e.key === 'Enter' && isEditingName && text.trim()) {
      localStorage.setItem('user-name', text.trim())
      setUserName(text.trim())
      setIsEditingName(false)
      setIsFirstVisit(false)
      setText('')
    }
  }

  // Fetch exchange rates with caching
  const fetchExchangeRates = async () => {
    try {
      const response = await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}`)
      const data = await response.json()
      
      const ratesData = {
        rates: data.data,
        timestamp: Date.now()
      }
      
      // Store in localStorage
      localStorage.setItem('currency-rates', JSON.stringify(ratesData))
      setExchangeRates(data.data)
      
      return data.data
    } catch (error) {
      console.error('Error fetching exchange rates:', error)
      return null
    }
  }

  // Load exchange rates on mount
  useEffect(() => {
    // Check for first visit
    const storedName = localStorage.getItem('user-name')
    if (storedName) {
      setUserName(storedName)
    } else {
      setIsFirstVisit(true)
      setIsEditingName(true)
    }

    const loadExchangeRates = async () => {
      // Check localStorage first
      const cached = localStorage.getItem('currency-rates')
      
      if (cached) {
        const { rates, timestamp } = JSON.parse(cached)
        const now = Date.now()
        
        // Check if cache is still valid (less than 1 hour old)
        if (now - timestamp < CACHE_DURATION) {
          setExchangeRates(rates)
          return
        }
      }
      
      // Cache is invalid or doesn't exist, fetch new data
      await fetchExchangeRates()
    }
    
    loadExchangeRates()
  }, [])

  useEffect(() => {
    // Update animation keys only when text actually changes
    if (currentMainTitle !== prevMainTitle.current) {
      setMainTitleKey(prev => prev + 1)
      prevMainTitle.current = currentMainTitle
    }
    if (currentSubTitle !== prevSubTitle.current) {
      setSubTitleKey(prev => prev + 1)
      prevSubTitle.current = currentSubTitle
    }
  }, [currentMainTitle, currentSubTitle])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currencySelectorActive && (e.key === 'Enter' || e.key === 'Escape')) {
        setCurrencySelectorActive(false)
      }
    }

    const handleClick = (e) => {
      if (currencySelectorActive && !e.target.closest('.currency-selector')) {
        setCurrencySelectorActive(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('click', handleClick)
    }
  }, [currencySelectorActive])

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault()
      
      // Accumulate scroll delta
      const newAccumulator = scrollAccumulator + e.deltaY
      setScrollAccumulator(newAccumulator)
      
      // Threshold for change
      const threshold = 100
      
      if (Math.abs(newAccumulator) >= threshold) {
        const direction = newAccumulator > 0 ? 1 : -1
        
        if (currencySelectorActive) {
          // Scroll through currencies
          let newIndex = currencyIndex + direction
          if (newIndex >= currencies.length) {
            newIndex = 0
          } else if (newIndex < 0) {
            newIndex = currencies.length - 1
          }
          setCurrencyIndex(newIndex)
        } else {
          // Scroll through colors/pages
          let newIndex = colorIndex + direction
          if (newIndex >= colors.length) {
            newIndex = 0
          } else if (newIndex < 0) {
            newIndex = colors.length - 1
          }
          setColorIndex(newIndex)
        }
        
        setScrollAccumulator(0)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [scrollAccumulator, colorIndex, colors.length, currencySelectorActive, currencyIndex, currencies.length])

  return (
    <div className="app" style={{ backgroundColor: colors[colorIndex] }}>
      {userName && (
        <div 
          className={`name-display ${isEditingName ? 'active' : ''}`}
          onClick={() => {
            setIsEditingName(true)
            setText(userName)
          }}
        >
          {userName}
        </div>
      )}
      <div 
        className={`currency-selector ${currencySelectorActive ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          setCurrencySelectorActive(!currencySelectorActive)
        }}
      >
        <span className="currency-symbol">{currencies[currencyIndex].symbol}</span>
        {currencySelectorActive && <span className="currency-code">{currencies[currencyIndex].code}</span>}
      </div>
      <div className="top-section">
        <div className="page-title">
          <span className="title-main">
            <span key={mainTitleKey}>{currentMainTitle}</span>
          </span>
          <span className="title-separator"> - </span>
          <span className="title-sub">
            <span key={subTitleKey}>{currentSubTitle}</span>
          </span>
        </div>
        <input
          type="text"
          className="invisible-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleNameInput}
          placeholder=""
          autoFocus
        />
      </div>
      {isFirstVisit && (
        <div className="name-prompt-text">
          What's your name?
        </div>
      )}
      <div className="bottom-section">
        <div className="reflection">
          <input
            type="text"
            className="invisible-input reflected"
            value={text}
            readOnly
            tabIndex={-1}
          />
        </div>
      </div>
    </div>
  )
}

export default App
