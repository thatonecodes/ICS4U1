import { useState, useEffect } from 'react';
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

export default function CubicInput({ coefficients, onChange }: Props) {
  const [raw, setRaw] = useState<Record<keyof Coefficients, string>>({
    a: String(coefficients.a),
    b: String(coefficients.b),
    c: String(coefficients.c),
    d: String(coefficients.d),
  });

  useEffect(() => {
    setRaw({
      a: String(coefficients.a),
      b: String(coefficients.b),
      c: String(coefficients.c),
      d: String(coefficients.d),
    });
  }, [coefficients.a, coefficients.b, coefficients.c, coefficients.d]);

  const handleChange = (key: keyof Coefficients, value: string) => {
    setRaw((prev) => ({ ...prev, [key]: value }));
    const num = parseFloat(value);
    onChange({ ...coefficients, [key]: isNaN(num) ? 0 : num });
  };

  return (
    <div className="flex gap-3">
      {FIELDS.map(({ key, label, power }) => (
        <div
          key={key}
          className="bg-[#0a0e18] border border-[#1a2235] rounded-xl px-4 pt-4 pb-[14px] flex flex-col gap-[10px] transition-colors duration-200 focus-within:border-[#223050] flex-1"
        >
          <label
            htmlFor={`input-${key}`}
            className="flex items-baseline gap-1 cursor-pointer"
          >
            <span className="font-mono text-[26px] font-bold text-[#00aaff] leading-none">
              {label}
            </span>
            <span className="font-mono text-[11px] text-[#6b7280] tracking-[0.05em]">
              {power}
            </span>
          </label>
          <input
            id={`input-${key}`}
            type="number"
            step="any"
            value={raw[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            placeholder="0"
            className="
              bg-transparent border-0 border-b border-[#223050]
              text-[#e8eaf0] font-mono text-lg py-1 w-full outline-none
              transition-colors duration-200
              focus:border-b-[#00aaff]
              placeholder:text-[#6b7280]
              [appearance:textfield]
              [&::-webkit-inner-spin-button]:appearance-none
              [&::-webkit-outer-spin-button]:appearance-none
            "
          />
        </div>
      ))}
    </div>
  );
}