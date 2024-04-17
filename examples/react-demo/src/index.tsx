import { createRoot } from 'react-dom/client'
import { StrictMode, useState, useEffect, createElement } from 'react'
import { Example1 } from './example1'
import { Example2 } from './example2'
import { Example3 } from './example3'
import { Example4 } from './example4'
import { Example5 } from './example5'
import './init.css'

const STORAGE_KEY = 'react-demo-select-index'

function App() {

  const [ exampleList ] = useState(() => [
    Example1,
    Example2,
    Example3,
    Example4,
    Example5
  ])

  const [ select, setSelect ] = useState(() => {
    const select = Number(localStorage.getItem(STORAGE_KEY))
    if (select < exampleList.length) return select
    return 0
  })

  useEffect(() => localStorage.setItem(STORAGE_KEY, String(select)), [ select ])

  return (
    <>
      <h2>React</h2>
      <div className='change-button'>
        {
          exampleList.map((example, index) => (
            <button
              key={example.tip}
              className={`app-button ${index == select ? 'app-button-selected' : ''}`}
              onClick={() => setSelect(index)}
            >
              例子{index + 1}： {example.tip}
            </button>
          ))
        }
      </div>
      <div style={{ padding: 10 }}>
        {createElement(exampleList[select])}
      </div>
    </>
  )
}

createRoot(document.querySelector('#root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)