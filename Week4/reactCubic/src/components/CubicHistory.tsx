import type { HistoryEntry } from '../types';
import { buildEquation } from '../utils/cubic';

interface Props {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  selectedId: number | null;
}

export default function CubicHistory({ history, onSelect, selectedId }: Props) {
  return (
    <div className="card">
      <p className="panel-title">History</p>

      {history.length === 0 ? (
        <p className="placeholder-text">
          No saved cubics yet — press Save to add one.
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: '520px' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>a</th>
                <th>b</th>
                <th>c</th>
                <th>d</th>
                <th>Equation</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr
                  key={entry.id}
                  onClick={() => onSelect(entry)}
                  className={`history-row ${entry.id === selectedId ? 'history-row-active' : ''}`}
                >
                  <td className="root-index">{entry.id}</td>
                  <td>{entry.coefficients.a}</td>
                  <td>{entry.coefficients.b}</td>
                  <td>{entry.coefficients.c}</td>
                  <td>{entry.coefficients.d}</td>
                  <td className="text-accent2" style={{ fontSize: '12px' }}>
                    {buildEquation(
                      entry.coefficients.a,
                      entry.coefficients.b,
                      entry.coefficients.c,
                      entry.coefficients.d,
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
