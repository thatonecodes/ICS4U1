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
    <div className="absolute top-0 right-0 flex items-center justify-center">
      <svg
        viewBox="-11.5 -10.23174 23 20.46348"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="w-20 h-20 opacity-[0.85] drop-shadow-[0_0_12px_rgba(0,170,255,0.5)] animate-spin"
        style={{ animationDuration: '10s' }}
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

  const result = useMemo(() => {
    const { a } = coefficients;
    if (!a || isNaN(a)) return null;
    return solveCubic(coefficients.a, coefficients.b, coefficients.c, coefficients.d);
  }, [coefficients]);

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
    <div className="bg-[#080c14] min-h-screen">
      <div className="max-w-[1060px] mx-auto px-5 pt-9 pb-[72px]">

        <header className="relative border-b border-[#1a2235] pb-8 mb-10">
          <ReactLogo />
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#00aaff] opacity-90">
            ICS4U1 — Assignment 3
          </div>
          <h1 className="font-mono text-[clamp(48px,7vw,80px)] font-bold leading-[0.9] tracking-[-0.03em] uppercase text-[#e8eaf0] mt-2">
            Cubic<br />Calculator
          </h1>
          <p className="font-mono text-[13px] text-[#6b7280] mt-3 tracking-[0.05em]">
            ax³ + bx² + cx + d = 0
          </p>
        </header>

        <main className="flex flex-col gap-[18px]">

          <div className="bg-[#0d1220] border border-[#1a2235] rounded-xl p-6">
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#6b7280] mb-4">
              Coefficients
            </p>
            <CubicInput
              coefficients={coefficients}
              onChange={setCoefficients}
              onSave={handleSave}
            />
            <div className="mt-[14px]">
              <CubicEquation coefficients={coefficients} />
            </div>
            {/* save-btn — using group so the arrow can react to button hover */}
            <button
              className="group mt-[14px] w-full bg-[#00aaff] text-[#080c14] border-none rounded-xl py-[15px] px-8 font-mono text-sm font-bold tracking-[0.08em] uppercase cursor-pointer flex items-center justify-center gap-[10px] transition-all duration-150 overflow-hidden hover:-translate-y-px hover:shadow-[0_0_28px_rgba(0,170,255,0.35)] active:translate-y-0"
              onClick={handleSave}
            >
              <span>Save</span>
              <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>
          </div>

          <div className="grid grid-cols-[1fr_1.4fr] gap-4 max-[700px]:grid-cols-1">
            <CubicTable result={result} criticalPoints={criticalPoints} />
            <CubicGraph
              coefficients={coefficients}
              result={result}
              criticalPoints={criticalPoints}
            />
          </div>

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