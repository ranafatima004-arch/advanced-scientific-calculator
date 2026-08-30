import { useCallback, useEffect, useMemo, useState } from 'react'
import { Calculator, Delete, History, Keyboard, Moon, Sun, X } from 'lucide-react'
import { evaluate as mathEvaluate, format } from 'mathjs'
import './App.css'

const scientificKeys = [
  ['sin', 'sin(', 'function'], ['cos', 'cos(', 'function'], ['tan', 'tan(', 'function'],
  ['log', 'log(', 'function'], ['ln', 'ln(', 'function'], ['√', 'sqrt(', 'function'],
  ['xʸ', '^', 'function'], ['x²', '^2', 'function'], ['π', 'π', 'constant'], ['e', 'e', 'constant'],
  ['(', '(', 'function'], [')', ')', 'function'],
]
const standardKeys = [
  ['7', '7', 'number'], ['8', '8', 'number'], ['9', '9', 'number'], ['÷', '/', 'operator'],
  ['4', '4', 'number'], ['5', '5', 'number'], ['6', '6', 'number'], ['×', '*', 'operator'],
  ['1', '1', 'number'], ['2', '2', 'number'], ['3', '3', 'number'], ['−', '-', 'operator'],
  ['0', '0', 'number wide'], ['.', '.', 'number'], ['%', '%', 'operator'], ['+', '+', 'operator'],
]

function formatResult(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error('Undefined')
  return format(value, { precision: 12, lowerExp: -9, upperExp: 12 })
}

function calculateExpression(expression, mode) {
  const normalized = expression.replaceAll('π', 'pi').replaceAll('×', '*').replaceAll('÷', '/')
  const angle = mode === 'DEG' ? (value) => mathEvaluate(`(${value}) * pi / 180`) : (value) => value
  const scope = {
    pi: Math.PI,
    e: Math.E,
    sin: (value) => Math.sin(angle(value)), cos: (value) => Math.cos(angle(value)), tan: (value) => Math.tan(angle(value)),
    log: (value) => Math.log10(value), ln: (value) => Math.log(value), sqrt: (value) => Math.sqrt(value),
  }
  return formatResult(mathEvaluate(normalized, scope))
}

function App() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('0')
  const [angleMode, setAngleMode] = useState('DEG')
  const [history, setHistory] = useState([])
  const [historyOpen, setHistoryOpen] = useState(false)
  const [dark, setDark] = useState(true)
  const [error, setError] = useState('')

  const addInput = useCallback((value) => {
    setExpression((current) => current + value)
    setResult('0'); setError('')
  }, [])
  const clear = useCallback(() => { setExpression(''); setResult('0'); setError('') }, [])
  const backspace = useCallback(() => { setExpression((current) => current.slice(0, -1)); setResult('0'); setError('') }, [])
  const calculate = useCallback(() => {
    if (!expression.trim()) return
    try {
      const value = calculateExpression(expression, angleMode)
      setResult(value); setError('')
      setHistory((items) => [{ expression, result: value, mode: angleMode }, ...items].slice(0, 10))
    } catch { setResult('Error'); setError('Check brackets, operators, or values') }
  }, [angleMode, expression])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (/^[0-9.]$/.test(event.key) || ['+', '-', '*', '/', '(', ')', '%', '^'].includes(event.key)) { event.preventDefault(); addInput(event.key) }
      else if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); calculate() }
      else if (event.key === 'Backspace') { event.preventDefault(); backspace() }
      else if (event.key === 'Escape') { event.preventDefault(); clear() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [addInput, backspace, calculate, clear])

  const displayExpression = useMemo(() => expression || 'Ready for input', [expression])
  return (
    <main className={`app-shell ${dark ? 'theme-dark' : 'theme-light'}`}>
      <section className="calculator-card" aria-label="Scientific calculator">
        <header className="app-header">
          <div className="brand-lockup"><span className="brand-mark"><Calculator /></span><div><p className="eyebrow">NOVA LABS / 02</p><h1>Scientific Calculator</h1></div></div>
          <div className="header-actions"><button className="icon-button" aria-label="Keyboard shortcuts" title="Keyboard enabled"><Keyboard /></button><button className="icon-button" onClick={() => setDark((value) => !value)} aria-label="Toggle theme" title="Toggle theme">{dark ? <Sun /> : <Moon />}</button></div>
        </header>

        <div className="display-panel"><div className="display-meta"><span>CALCULATION</span><span className="live-indicator"><i /> LIVE</span></div><div className="expression-line">{displayExpression}</div><div className={`result-line ${error ? 'has-error' : ''}`}>{result}</div>{error && <p className="error-line">{error}</p>}<div className="display-footer"><span>Precision: 12 digits</span><span>{angleMode} mode</span></div></div>

        <div className="toolbar"><div className="angle-switch" role="group" aria-label="Angle mode"><button className={angleMode === 'DEG' ? 'active' : ''} onClick={() => setAngleMode('DEG')}>DEG</button><button className={angleMode === 'RAD' ? 'active' : ''} onClick={() => setAngleMode('RAD')}>RAD</button></div><span className="shortcut-hint"><Keyboard /> 0–9 · operators · Enter · Backspace</span></div>

        <div className="calculator-grid"><div className="scientific-panel"><div className="panel-label">SCIENTIFIC</div><div className="scientific-grid">{scientificKeys.map(([label, value, kind]) => <button key={label} className={`key key-${kind}`} onClick={() => addInput(value)}>{label}</button>)}</div></div><div className="standard-panel"><div className="panel-label">STANDARD</div><div className="utility-row"><button className="key key-clear" onClick={clear}>AC</button><button className="key key-delete" onClick={backspace} aria-label="Backspace"><Delete /></button><button className="key key-history" onClick={() => setHistoryOpen(true)} aria-label="Open history"><History /></button></div><div className="standard-grid">{standardKeys.map(([label, value, kind]) => <button key={label} className={`key key-${kind}`} onClick={() => addInput(value)}>{label}</button>)}<button className="key key-equals" onClick={calculate}>=</button></div></div></div>
        <footer className="app-footer"><span><span className="status-dot" /> System ready</span><span>v3.0 · Built for precision</span></footer>
      </section>
      {historyOpen && <div className="drawer-backdrop" onClick={() => setHistoryOpen(false)}><aside className="history-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><div><p className="eyebrow">ARCHIVE</p><h2>Calculation history</h2></div><button className="icon-button" onClick={() => setHistoryOpen(false)} aria-label="Close history"><X /></button></div>{history.length ? history.map((item, index) => <button className="history-item" key={`${item.expression}-${index}`} onClick={() => { setExpression(item.expression); setResult(item.result); setAngleMode(item.mode); setHistoryOpen(false) }}><span><History />{item.expression}<small>{item.mode}</small></span><strong>{item.result}</strong></button>) : <div className="empty-history"><History /><p>No calculations yet</p><small>Your completed calculations will appear here.</small></div>}{history.length > 0 && <button className="clear-history" onClick={() => setHistory([])}>Clear history</button>}</aside></div>}
    </main>
  )
}

export default App
