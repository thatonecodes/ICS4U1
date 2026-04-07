import type { CubicResult, CriticalPoint } from '../types';
import { rnd } from '../utils/cubic';

interface TableProps {
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

const BADGE_BASE =
  'inline-block px-2 py-[2px] rounded text-[10px] tracking-[0.1em] uppercase font-mono border';

const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  real:    'bg-[rgba(0,170,255,0.1)]  text-[#00aaff] border-[rgba(0,170,255,0.25)]',
  complex: 'bg-[rgba(255,107,53,0.1)] text-[#ff6b35] border-[rgba(255,107,53,0.2)]',
  double:  'bg-[rgba(96,207,255,0.1)] text-[#60cfff] border-[rgba(96,207,255,0.25)]',
  max:     'bg-[rgba(255,107,53,0.1)] text-[#ff6b35] border-[rgba(255,107,53,0.2)]',
  min:     'bg-[rgba(96,207,255,0.1)] text-[#60cfff] border-[rgba(96,207,255,0.25)]',
};

function Badge({ variant, children }: { variant: BadgeVariant; children: React.ReactNode }) {
  return (
    <span className={`${BADGE_BASE} ${BADGE_VARIANTS[variant]}`}>
      {children}
    </span>
  );
}

const thClass =
  'text-left py-[7px] px-[10px] text-[10px] tracking-[0.15em] uppercase text-[#6b7280] border-b border-[#1a2235] font-mono font-normal';

const tdClass =
  'py-[10px] px-[10px] border-b border-[#111826] text-[#9ca3af] align-middle';

export default function CubicTable({ result, criticalPoints }: TableProps) {
  if (!result) {
    return (
      /* card */
      <div className="bg-[#0d1220] border border-[#1a2235] rounded-xl p-6">
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#6b7280] mb-4">
          Roots
        </p>
        <p className="text-[#6b7280] font-mono text-[13px] italic">
          Enter valid coefficients (a ≠ 0)
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0d1220] border border-[#1a2235] rounded-xl p-6">
      <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#6b7280] mb-4">
        Roots
      </p>

      <table className="w-full border-collapse font-mono text-[13px]">
        <thead>
          <tr>
            <th className={thClass}>Root</th>
            <th className={thClass}>Value</th>
            <th className={thClass}>Type</th>
          </tr>
        </thead>
        <tbody>
          {result.roots.map((root, i) => {
            const isLast = i === result.roots.length - 1;
            const cellClass = isLast ? tdClass.replace('border-b border-[#111826]', '') : tdClass;
            return (
              <tr key={i} className="hover:bg-white/[0.02]">
                <td className={cellClass}>
                  <span className="text-[#00aaff] font-bold">x{SUBS[i]}</span>
                </td>
                <td className={cellClass}>
                  {root.isComplex ? (
                    <span className="text-[#ff6b35]">
                      {root.real} {root.imag >= 0 ? '+' : '−'} {Math.abs(root.imag)}i
                    </span>
                  ) : (
                    <span className="text-[#e8eaf0]">{root.real}</span>
                  )}
                </td>
                <td className={cellClass}>
                  <Badge variant={root.isComplex ? 'complex' : root.isDouble ? 'double' : 'real'}>
                    {root.isComplex ? 'Complex' : root.isDouble ? 'Repeated' : 'Real'}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-[14px] px-[14px] py-[10px] bg-[#0a0e18] rounded-lg border-l-2 border-l-[#223050] font-mono text-[11px] text-[#6b7280] leading-[1.9]">
        <div><span className="text-[#9ca3af]">p</span> = {rnd(result.p, 4)}</div>
        <div><span className="text-[#9ca3af]">q</span> = {rnd(result.q, 4)}</div>
        <div><span className="text-[#9ca3af]">Δ</span> = {rnd(result.disc, 6)}</div>
        <div><span className="text-[#9ca3af]">Case:</span> {CASE_LABELS[result.caseType] ?? result.caseType}</div>
      </div>

      {criticalPoints.length > 0 && (
        <>
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#6b7280] mb-4 mt-5 pt-4 border-t border-[#1a2235]">
            Critical Points
          </p>
          <table className="w-full border-collapse font-mono text-[13px]">
            <thead>
              <tr>
                <th className={thClass}>Type</th>
                <th className={thClass}>x</th>
                <th className={thClass}>f(x)</th>
              </tr>
            </thead>
            <tbody>
              {criticalPoints.map((pt, i) => {
                const isLast = i === criticalPoints.length - 1;
                const cellClass = isLast ? tdClass.replace('border-b border-[#111826]', '') : tdClass;
                return (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className={cellClass}>
                      <Badge variant={pt.type}>
                        {pt.type === 'max' ? '▲ Local Max' : '▼ Local Min'}
                      </Badge>
                    </td>
                    <td className={`${cellClass} text-[#e8eaf0]`}>{pt.x}</td>
                    <td className={`${cellClass} text-[#e8eaf0]`}>{pt.y}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}