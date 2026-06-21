import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput("");
    setResult("");
  };

  const handleCalculate = () => {
    try {
      let calculation = input;
      calculation = calculation.replace(/sin\(/g, 'Math.sin(');
      calculation = calculation.replace(/cos\(/g, 'Math.cos(');
      calculation = calculation.replace(/tan\(/g, 'Math.tan(');
      calculation = calculation.replace(/log\(/g, 'Math.log10(');
      calculation = calculation.replace(/√\(/g, 'Math.sqrt(');
      calculation = calculation.replace(/\^/g, '**');

      setResult(eval(calculation).toString());
    } catch (error) {
      setResult("Error");
    }
  };

  const handleSciFunction = (func) => {
    if (func === 'pi') {
      handleClick(Math.PI.toString());
    } else if (func === 'e') {
      handleClick(Math.E.toString());
    } else {
      handleClick(func + "(");
    }
  };

  return (
    <div className="app-container">
      <div className="animated-background"></div>
      
      <div className="calculator-box">
        <h1 className="calc-heading">SCIENTIFIC CALCULATOR</h1>
        
        <div className="screen-container">
          <div className="input-line">{input || "0"}</div>
          <div className="result-line">{result || "0"}</div>
        </div>

        <div className="grid-layout">
          {/* Row 1 */}
          <button onClick={() => handleSciFunction('sin')} className="btn-key sci-key">sin</button>
          <button onClick={() => handleSciFunction('cos')} className="btn-key sci-key">cos</button>
          <button onClick={() => handleSciFunction('tan')} className="btn-key sci-key">tan</button>
          <button onClick={handleClear} className="btn-key clear-key">C</button>
          <button onClick={() => handleClick("/")} className="btn-key op-key">÷</button>

          {/* Row 2 */}
          <button onClick={() => handleSciFunction('log')} className="btn-key sci-key">log</button>
          <button onClick={() => handleClick("7")} className="btn-key num-key">7</button>
          <button onClick={() => handleClick("8")} className="btn-key num-key">8</button>
          <button onClick={() => handleClick("9")} className="btn-key num-key">9</button>
          <button onClick={() => handleClick("*")} className="btn-key op-key">×</button>

          {/* Row 3 */}
          <button onClick={() => handleSciFunction('√')} className="btn-key sci-key">√</button>
          <button onClick={() => handleClick("4")} className="btn-key num-key">4</button>
          <button onClick={() => handleClick("5")} className="btn-key num-key">5</button>
          <button onClick={() => handleClick("6")} className="btn-key num-key">6</button>
          <button onClick={() => handleClick("-")} className="btn-key op-key">−</button>

          {/* Row 4 */}
          <button onClick={() => handleClick('^')} className="btn-key sci-key">x<sup>y</sup></button>
          <button onClick={() => handleClick("1")} className="btn-key num-key">1</button>
          <button onClick={() => handleClick("2")} className="btn-key num-key">2</button>
          <button onClick={() => handleClick("3")} className="btn-key num-key">3</button>
          <button onClick={() => handleClick("+")} className="btn-key op-key">+</button>

          {/* Row 5 */}
          <button onClick={() => handleSciFunction('pi')} className="btn-key sci-key">π</button>
          <button onClick={() => handleSciFunction('e')} className="btn-key sci-key">e</button>
          <button onClick={() => handleClick("0")} className="btn-key num-key">0</button>
          <button onClick={() => handleClick(".")} className="btn-key num-key">.</button>
          <button onClick={handleCalculate} className="btn-key equal-key">=</button>
        </div>
      </div>
    </div>
  );
}

const sheet = document.createElement('style');
sheet.innerHTML = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body, html { width: 100%; height: 100%; overflow: hidden; font-family: 'Poppins', system-ui, sans-serif; }

  .app-container {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    display: flex; justify-content: center; align-items: center; overflow: hidden;
  }

  .animated-background {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(135deg, #0f172a, #1e1b4b, #311042, #0f172a);
    background-size: 400% 400%; z-index: -2;
    animation: moveBg 12s ease infinite;
  }

  @keyframes moveBg {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .calculator-box {
    width: 100%; max-width: 400px;
    background: rgba(25, 35, 55, 0.6); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
    border-radius: 24px; padding: 28px;
    box-sizing: border-box;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.12); z-index: 1;
  }

  .calc-heading {
    font-size: 1.6rem; font-weight: 800; color: #ffffff; margin-bottom: 22px;
    text-align: center; letter-spacing: 1.5px;
    background: linear-gradient(to right, #00ffcc, #00bcff);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  .screen-container {
    background: rgba(10, 15, 26, 0.85); border-radius: 16px;
    height: 110px; display: flex; flex-direction: column;
    justify-content: center; align-items: flex-end; padding: 15px 22px;
    margin-bottom: 22px; border: 1px solid rgba(255, 255, 255, 0.06);
    box-sizing: border-box;
  }

  .input-line { color: rgba(255, 255, 255, 0.45); font-size: 1.1rem; overflow-x: auto; max-width: 100%; white-space: nowrap; }
  .result-line { color: #00ffcc; font-size: 2.6rem; font-weight: bold; overflow-x: auto; max-width: 100%; white-space: nowrap; text-shadow: 0 0 12px rgba(0,255,204,0.25); }

  .grid-layout { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }

  /* بٹنز کی پرفیکٹ سینٹرنگ */
  .btn-key {
    height: 56px; font-size: 1.2rem; font-weight: 600; border: none;
    border-radius: 12px; cursor: pointer; transition: all 0.2s ease;
    display: flex; justify-content: center; align-items: center; text-align: center;
    line-height: 1; padding: 0;
  }

  .num-key { background: #ffffff; color: #0f172a; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
  .sci-key { background: rgba(255, 255, 255, 0.08); color: #00ffcc; border: 1px solid rgba(0,255,204,0.05); font-size: 1.05rem; }
  .op-key { background: #f59e0b; color: white; font-size: 1.5rem; }
  .clear-key { background: #ef4444; color: white; }
  .equal-key { background: #10b981; color: white; font-size: 1.5rem; }

  .btn-key:hover { filter: brightness(120%); transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.2); }
  .btn-key:active { transform: translateY(0); }
`;
document.body.appendChild(sheet);

export default App;