import type { HistoryEntry } from '../types';
import { buildEquation } from '../utils/cubic';

interface HistoryProps {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  selectedId: number | null;
}

const thClass =
  'text-left py-[7px] px-[10px] text-[10px] tracking-[0.15em] uppercase text-[#6b7280] border-b border-[#1a2235] font-mono font-normal';

const tdClass =
  'py-[10px] px-[10px] border-b border-[#111826] text-[#9ca3af] align-middle font-mono text-[13px]';

export default function CubicHistory({ history, onSelect, selectedId }: HistoryProps) {
  return (
    /* card */
    <div className="bg-[#0d1220] border border-[#1a2235] rounded-xl p-6">
      <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#6b7280] mb-4">
        History
      </p>

      {history.length === 0 ? (
        <p className="text-[#6b7280] font-mono text-[13px] italic">
          No saved cubics yet — press Save to add one.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-mono text-[13px]" style={{ minWidth: '520px' }}>
            <thead>
              <tr>
                <th className={thClass}>#</th>
                <th className={thClass}>a</th>
                <th className={thClass}>b</th>
                <th className={thClass}>c</th>
                <th className={thClass}>d</th>
                <th className={thClass}>Equation</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, idx) => {
                const isActive = entry.id === selectedId;
                const isLast = idx === history.length - 1;
                const rowTd = isLast
                  ? tdClass.replace('border-b border-[#111826]', '')
                  : tdClass;

                return (
                  <tr
                    key={entry.id}
                    onClick={() => onSelect(entry)}
                    className={[
                      'cursor-pointer border-l-2 transition-all duration-150',
                      isActive
                        ? '!bg-[rgba(0,170,255,0.06)] border-l-[#00aaff]'
                        : 'border-l-transparent hover:bg-[rgba(0,170,255,0.03)]',
                    ].join(' ')}
                  >
                    {/* root-index */}
                    <td className={`${rowTd} text-[#00aaff] font-bold`}>{entry.id}</td>
                    <td className={rowTd}>{entry.coefficients.a}</td>
                    <td className={rowTd}>{entry.coefficients.b}</td>
                    <td className={rowTd}>{entry.coefficients.c}</td>
                    <td className={rowTd}>{entry.coefficients.d}</td>
                    {/* text-accent2 */}
                    <td className={`${rowTd} text-[#60cfff] text-[12px]`}>
                      {buildEquation(
                        entry.coefficients.a,
                        entry.coefficients.b,
                        entry.coefficients.c,
                        entry.coefficients.d,
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}