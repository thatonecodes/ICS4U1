import type { Coefficients } from '../types';
import { buildEquation } from '../utils/cubic';

interface Props {
  coefficients: Coefficients;
}

export default function CubicEquation({ coefficients }: Props) {
  const { a, b, c, d } = coefficients;

  return (
    <div className="eq-preview">
      <span className="eq-text">
        {buildEquation(a, b, c, d)}
      </span>
    </div>
  );
}
