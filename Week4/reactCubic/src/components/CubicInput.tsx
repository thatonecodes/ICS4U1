import type { Coefficients } from '../types';

interface Props {
  coefficients: Coefficients;
  onChange: (coefficients: Coefficients) => void;
  onSave: () => void;
}

const FIELDS: { key: keyof Coefficients; label: string; power: string }[] = [
  { key: 'a', label: 'a', power: 'x³' },
  { key: 'b', label: 'b', power: 'x²' },
  { key: 'c', label: 'c', power: 'x' },
  { key: 'd', label: 'd', power: 'const' },
];

export default function CubicInput({ coefficients, onChange, onSave }: Props) {
  const handleChange = (key: keyof Coefficients, value: string) => {
    const num = parseFloat(value);
    onChange({ ...coefficients, [key]: isNaN(num) ? 0 : num });
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {FIELDS.map(({ key, label, power }) => (
        <div
          key={key}
          className="coeff-card"
        >
          <label htmlFor={`input-${key}`} className="flex items-baseline gap-1 cursor-pointer">
            <span className="coeff-letter">{label}</span>
            <span className="coeff-power">{power}</span>
          </label>
          <input
            id={`input-${key}`}
            type="number"
            step="any"
            value={coefficients[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            className="coeff-input"
            placeholder="0"
          />
        </div>
      ))}
    </div>
  );
}
