import type { CubicResult, CriticalPoint } from '../types';
import { rnd } from '../utils/cubic';

interface Props {
  result: CubicResult | null;
  criticalPoints: CriticalPoint[];
}

const SUBS = ['₁', '₂', '₃'] as const;

const CASE_LABELS: Record<string, string> = {
  'three-real': 'Three distinct real roots',
  'one-real-two-complex': 'One real + two complex conjugates',
  'repeated': 'Repeated root(s)',
};

type BadgeVariant = 'real' | 'complex' | 'double' | 'max' | 'min';

function Badge({ variant, children }: { variant: BadgeVariant; children: React.ReactNode }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

export default function CubicTable({ result, criticalPoints }: Props) {
  if (!result) {
    return (
      <div className="card">
        <p className="panel-title">Roots</p>
        <p className="placeholder-text">Enter valid coefficients (a ≠ 0)</p>
      </div>
    );
  }

  return (
    <div className="card">
      <p className="panel-title">Roots</p>

      <table className="data-table">
        <thead>
          <tr>
            <th>Root</th>
            <th>Value</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {result.roots.map((root, i) => (
            <tr key={i}>
              <td>
                <span className="root-index">x{SUBS[i]}</span>
              </td>
              <td>
                {root.isComplex ? (
                  <span className="text-accent3">
                    {root.real} {root.imag >= 0 ? '+' : '−'} {Math.abs(root.imag)}i
                  </span>
                ) : (
                  <span className="text-primary">{root.real}</span>
                )}
              </td>
              <td>
                <Badge variant={root.isComplex ? 'complex' : root.isDouble ? 'double' : 'real'}>
                  {root.isComplex ? 'Complex' : root.isDouble ? 'Repeated' : 'Real'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="disc-info">
        <div><span className="disc-label">p</span> = {rnd(result.p, 4)}</div>
        <div><span className="disc-label">q</span> = {rnd(result.q, 4)}</div>
        <div><span className="disc-label">Δ</span> = {rnd(result.disc, 6)}</div>
        <div><span className="disc-label">Case:</span> {CASE_LABELS[result.caseType] ?? result.caseType}</div>
      </div>

      {/* BONUS: Critical Points */}
      {criticalPoints.length > 0 && (
        <>
          <p className="panel-title" style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            Critical Points — Bonus
          </p>
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>x</th>
                <th>f(x)</th>
              </tr>
            </thead>
            <tbody>
              {criticalPoints.map((pt, i) => (
                <tr key={i}>
                  <td>
                    <Badge variant={pt.type}>
                      {pt.type === 'max' ? '▲ Local Max' : '▼ Local Min'}
                    </Badge>
                  </td>
                  <td className="text-primary">{pt.x}</td>
                  <td className="text-primary">{pt.y}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
