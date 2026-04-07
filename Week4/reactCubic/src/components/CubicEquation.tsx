import type { Coefficients } from '../types';
import { buildEquation } from '../utils/cubic';

interface EquationProps {
  coefficients: Coefficients;
}

export default function CubicEquation({ coefficients }: EquationProps) {
  const { a, b, c, d } = coefficients;

  return (
    <div className="bg-[#0a0e18] border border-[#1a2235] rounded-xl px-5 py-[14px] text-center">
      <span className="font-mono text-[15px] text-[#60cfff] tracking-[0.04em]">
        {buildEquation(a, b, c, d)}
      </span>
    </div>
  );
}