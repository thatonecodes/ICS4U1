import { useRef, useEffect } from 'react';
import type { Coefficients, CubicResult, CriticalPoint } from '../types';
import { drawGraph } from '../utils/cubic';

interface Props {
  coefficients: Coefficients;
  result: CubicResult | null;
  criticalPoints: CriticalPoint[];
}

export default function CubicGraph({ coefficients, result, criticalPoints }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;

    if (!result) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0d0f14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#6b7280';
      ctx.font = '13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Enter valid coefficients (a ≠ 0)', canvas.width / 2, canvas.height / 2);
      return;
    }

    const { a, b, c, d } = coefficients;
    drawGraph(canvas, a, b, c, d, result.roots, criticalPoints);
  }, [coefficients, result, criticalPoints]);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <p className="panel-title">Graph</p>
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={560}
          height={370}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>
    </div>
  );
}
