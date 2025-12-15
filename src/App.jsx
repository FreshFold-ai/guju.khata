import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState('')
  const [colorIndex, setColorIndex] = useState(0)
  const [scrollAccumulator, setScrollAccumulator] = useState(0)
  const [mainTitleKey, setMainTitleKey] = useState(0)
  const [subTitleKey, setSubTitleKey] = useState(0)
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

  const currentMainTitle = titles[colorIndex].split(' - ')[0]
  const currentSubTitle = titles[colorIndex].split(' - ')[1]

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
    const handleWheel = (e) => {
      e.preventDefault()
      
      // Accumulate scroll delta
      const newAccumulator = scrollAccumulator + e.deltaY
      setScrollAccumulator(newAccumulator)
      
      // Threshold for color change (adjust for sensitivity)
      const threshold = 100
      
      if (Math.abs(newAccumulator) >= threshold) {
        const direction = newAccumulator > 0 ? 1 : -1
        let newIndex = colorIndex + direction
        
        // Loop around
        if (newIndex >= colors.length) {
          newIndex = 0
        } else if (newIndex < 0) {
          newIndex = colors.length - 1
        }
        
        setColorIndex(newIndex)
        setScrollAccumulator(0)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [scrollAccumulator, colorIndex, colors.length])

  return (
    <div className="app" style={{ backgroundColor: colors[colorIndex] }}>
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
