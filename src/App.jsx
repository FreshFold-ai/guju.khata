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
  const prevMainTitle = useRef('')
  const prevSubTitle = useRef('')

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
          placeholder=""
          autoFocus
        />
      </div>
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
