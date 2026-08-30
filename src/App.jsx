import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Calculator,
  Clock3,
  Delete,
  History,
  Keyboard,
  Moon,
  Sparkles,
  X,
} from 'lucide-react'
import './App.css'

const initialKeys = [
  { label: 'sin', value: 'sin(', kind: 'function' },
  { label: 'cos', value: 'cos(', kind: 'function' },
  { label: 'tan', value: 'tan(', kind: 'function' },
  { label: 'log', value: 'log(', kind: 'function' },
  { label: 'ln', value: 'ln(', kind: 'function' },
  { label: '√', value: 'sqrt(', kind: 'function' },
  { label: 'xʸ', value: '^', kind: 'function' },
  { label: 'x²', value: '^2', kind: 'function' },
  { label: '%', value: '%', kind: 'function' },
  { label: '(', value: '(', kind: 'function' },
  { label: ')', value: ')', kind: 'function' },
  { label: 'π', value: 'π', kind: 'constant' },
  { label: 'e', value: 'e', kind: 'constant' },
  { label: '7', value: '7', kind: 'number' },
  { label: '8', value: '8', kind: 'number' },
  { label: '9', value: '9', kind: 'number' },
  { label: '÷', value: '/', kind: 'operator' },
  { label: '4', value: '4', kind: 'number' },
  { label: '5', value: '5', kind: 'number' },
  { label: '6', value: '6', kind: 'number' },
  { label: '×', value: '*', kind: 'operator' },
  { label: '1', value: '1', kind: 'number' },
  { label: '2', value: '2', kind: 'number' },
  { label: '3', value: '3', kind: 'number' },
  { label: '−', value: '-', kind: 'operator' },
  { label: '0', value: '0', kind: 'number' },
  { label: '.', value: '.', kind: 'number' },
  { label: '+', value: '+', kind: 'operator' },
]

function formatResult(value) {
  if (!Number.isFinite(value)) throw new Error('Undefined')
  return Number(value.toPrecision(12)).toString()
}

function evaluate(expression, angleMode) {
  let formula = expression.replaceAll('π', 'PI').replaceAll('×', '*').replaceAll('÷', '/')
  formula = formula.replace(/(\d|\)|PI|E)(?=(PI|E|\d|\())/g, '$1*')
  formula = formula.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)')
  formula = formula.replace(/\^/g, '**')
  if (!/^[0-9+\-*/().,\sA-Za-z_*]+$/.test(formula)) throw new Error('Invalid input')
  const toAngle = angleMode === 'DEG' ? '(x * Math.PI / 180)' : 'x'
  const fn = new Function('PI', 'E', `const sin=x=>Math.sin(${toAngle}); const cos=x=>Math.cos(${toAngle}); const tan=x=>Math.tan(${toAngle}); const log=x=>Math.log10(x); const ln=x=>Math.log(x); const sqrt=x=>Math.sqrt(x); return (${formula})`)
  return formatResult(fn(Math.PI, Math.E))
}

function App() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('0')
  const [angleMode, setAngleMode] = useState('DEG')
  const [history, setHistory] = useState([])
  const [historyOpen, setHistoryOpen] = useState(false)
  const [error, setError] = useState('')

  const calculate = useCallback(() => {
    if (!expression) return
    try {
      const value = evaluate(expression, angleMode)
      setResult(value)
      setHistory((items) => [{ expression, result: value, mode: angleMode }, ...items].slice(0, 8))
      setError('')
    } catch {
      setResult('Error')
      setError('Check your expression')
    }
  }, [angleMode, expression])

  const addInput = (value) => {
    setExpression((current) => current + value)
    setResult('0')
    setError('')
  }
  const clear = () => { setExpression(''); setResult('0'); setError('') }
  const backspace = () => { setExpression((current) => current.slice(0, -1)); setResult('0') }

  useEffect(() => {
    const onKeyDown = (event) => {
      if (/^[0-9.]$/.test(event.key) || ['+', '-', '*', '/', '(', ')', '%', '^'].includes(event.key)) { event.preventDefault(); addInput(event.key) }
      if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); calculate() }
      if (event.key === 'Backspace') { event.preventDefault(); backspace() }
      if (event.key === 'Escape') clear()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const displayExpression = useMemo(() => expression || 'Ready for input', [expression])

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <section className="calculator-card" aria-label="Scientific calculator">
        <header className="app-header">
          <div className="brand-lockup"><span className="brand-mark"><Calculator /></span><div><p className="eyebrow">NOVA LABS</p><h1>Scientific Calculator</h1></div></div>
          <div className="header-actions"><button className="icon-button" aria-label="Keyboard shortcuts"><Keyboard /></button><button className="icon-button" aria-label="Toggle theme"><Moon /></button></div>
        </header>

        <div className="workspace">
          <div className="calculator-main">
            <div className="display-panel">
              <div className="display-meta"><span>CALCULATION</span><span className="live-indicator"><i /> LIVE</span></div>
              <div className="expression-line">{displayExpression}</div>
              <div className={`result-line ${error ? 'has-error' : ''}`}>{result}</div>
              {error && <p className="error-line">{error}</p>}
              <div className="display-footer"><span>Precision: 12 digits</span><span>{angleMode} mode</span></div>
            </div>

            <div className="toolbar"><div className="angle-switch" role="group" aria-label="Angle mode"><button className={angleMode === 'DEG' ? 'active' : ''} onClick={() => setAngleMode('DEG')}>DEG</button><button className={angleMode === 'RAD' ? 'active' : ''} onClick={() => setAngleMode('RAD')}>RAD</button></div><span className="shortcut-hint"><Keyboard /> Keyboard enabled</span></div>

            <div className="keypad">
              <div className="utility-row"><button className="key key-clear" onClick={clear}><span>AC</span><small>clear all</small></button><button className="key key-delete" onClick={backspace} aria-label="Backspace"><Delete /></button><button className="key key-delete" onClick={() => setExpression((current) => current.slice(0, -1))} aria-label="Delete"><Delete /></button><button className="key key-history" onClick={() => setHistoryOpen(true)}><History /> <span>History</span></button></div>
              <div className="keys-grid">{initialKeys.map((key) => <button key={key.label} className={`key key-${key.kind}`} onClick={() => addInput(key.value)}>{key.label}</button>)}<button className="key key-equals" onClick={calculate}>=</button></div>
            </div>
          </div>
          <aside className="tip-card"><div className="tip-icon"><Sparkles /></div><div><p className="eyebrow">QUICK TIP</p><p>Use parentheses to keep complex expressions clear and accurate.</p></div></aside>
        </div>
        <footer className="app-footer"><span><span className="status-dot" /> System ready</span><span>v2.6.0 · Built for precision</span></footer>
      </section>
      {historyOpen && <div className="drawer-backdrop" onClick={() => setHistoryOpen(false)}><aside className="history-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><div><p className="eyebrow">ARCHIVE</p><h2>Calculation history</h2></div><button className="icon-button" onClick={() => setHistoryOpen(false)} aria-label="Close history"><X /></button></div>{history.length ? history.map((item, index) => <button className="history-item" key={`${item.expression}-${index}`} onClick={() => { setExpression(item.expression); setResult(item.result); setHistoryOpen(false) }}><span><Clock3 />{item.expression}<small>{item.mode}</small></span><strong>{item.result}</strong></button>) : <div className="empty-history"><History /><p>No calculations yet</p><small>Your completed calculations will appear here.</small></div>} {history.length > 0 && <button className="clear-history" onClick={() => setHistory([])}>Clear history</button>}</aside></div>}
    </main>
  )
}

export default App
