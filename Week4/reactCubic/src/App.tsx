import { useState, useMemo } from 'react';
import type { Coefficients, HistoryEntry } from './types';
import { solveCubic, findCriticalPoints } from './utils/cubic';
import CubicInput from './components/CubicInput';
import CubicEquation from './components/CubicEquation';
import CubicTable from './components/CubicTable';
import CubicGraph from './components/CubicGraph';
import CubicHistory from './components/CubicHistory';

const DEFAULT_COEFFICIENTS: Coefficients = { a: 1, b: -6, c: 11, d: -6 };

function ReactLogo() {
  return (
    <div className="react-logo-container">
      <svg
        className="react-logo"
        viewBox="-11.5 -10.23174 23 20.46348"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="0" cy="0" r="2.05" fill="#00aaff" />
        <g stroke="#00aaff" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    </div>
  );
}

export default function App() {
  const [coefficients, setCoefficients] = useState<Coefficients>(DEFAULT_COEFFICIENTS);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [nextId, setNextId] = useState<number>(1);

  // Derive result reactively — no button click needed for table/graph updates
  const result = useMemo(() => {
    const { a } = coefficients;
    if (!a || isNaN(a)) return null;
    return solveCubic(coefficients.a, coefficients.b, coefficients.c, coefficients.d);
  }, [coefficients]);

  // Bonus: derive critical points from the derivative
  const criticalPoints = useMemo(() => {
    if (!result) return [];
    const { a, b, c, d } = coefficients;
    return findCriticalPoints(a, b, c, d);
  }, [coefficients, result]);

  const handleSave = () => {
    const id = nextId;
    setHistory((prev) => [...prev, { id, coefficients: { ...coefficients } }]);
    setSelectedId(id);
    setNextId((prev) => prev + 1);
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setCoefficients({ ...entry.coefficients });
    setSelectedId(entry.id);
  };

  return (
    <div className="app-bg">
      <div className="app-container">

        {/* ── Header ── */}
        <header className="app-header">
          <ReactLogo />
          <div className="header-eyebrow">ICS4U1 — Assignment 3</div>
          <h1 className="header-title">
            Cubic<br />Calculator
          </h1>
          <p className="header-sub">ax³ + bx² + cx + d = 0</p>
        </header>

        {/* ── Main ── */}
        <main className="main-layout">

          {/* Input card */}
          <div className="card">
            <p className="panel-title">Coefficients</p>
            <CubicInput
              coefficients={coefficients}
              onChange={setCoefficients}
              onSave={handleSave}
            />
            <div style={{ marginTop: '14px' }}>
              <CubicEquation coefficients={coefficients} />
            </div>
            <button className="save-btn" onClick={handleSave}>
              <span>Save</span>
              <span className="save-btn-arrow">→</span>
            </button>
          </div>

          {/* Results grid: table + graph */}
          <div className="results-grid">
            <CubicTable result={result} criticalPoints={criticalPoints} />
            <CubicGraph
              coefficients={coefficients}
              result={result}
              criticalPoints={criticalPoints}
            />
          </div>

          {/* History */}
          <CubicHistory
            history={history}
            onSelect={handleHistorySelect}
            selectedId={selectedId}
          />
        </main>

      </div>
    </div>
  );
}
