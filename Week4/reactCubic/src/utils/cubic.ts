import type { Root, CubicResult, CriticalPoint } from '../types';

const EPSILON = 1e-10;

export function rnd(n: number, decimals = 6): number {
  return Math.round(n * 10 ** decimals) / 10 ** decimals;
}

export function solveCubic(a: number, b: number, c: number, d: number): CubicResult {
  const shift = b / (3 * a);
  const p = c / a - (b * b) / (3 * a * a);
  const q = (2 * b * b * b) / (27 * a * a * a) - (b * c) / (3 * a * a) + d / a;
  const disc = (q * q) / 4 + (p * p * p) / 27;

  if (disc > EPSILON) {
    const sqrtD = Math.sqrt(disc);
    const u = Math.cbrt(-q / 2 + sqrtD);
    const v = Math.cbrt(-q / 2 - sqrtD);
    const realRoot = rnd(u + v - shift);
    const realPart = rnd(-(u + v) / 2 - shift);
    const imagPart = rnd(((u - v) * Math.sqrt(3)) / 2);
    return {
      disc, p, q, caseType: 'one-real-two-complex',
      roots: [
        { real: realRoot, imag: 0, isComplex: false, isDouble: false },
        { real: realPart, imag: imagPart, isComplex: true, isDouble: false },
        { real: realPart, imag: -imagPart, isComplex: true, isDouble: false },
      ],
    };
  } else if (Math.abs(disc) <= EPSILON) {
    if (Math.abs(p) <= EPSILON && Math.abs(q) <= EPSILON) {
      const t = rnd(-shift);
      return {
        disc: 0, p, q, caseType: 'repeated',
        roots: [
          { real: t, imag: 0, isComplex: false, isDouble: true },
          { real: t, imag: 0, isComplex: false, isDouble: true },
          { real: t, imag: 0, isComplex: false, isDouble: true },
        ],
      };
    }
    const u = Math.cbrt(-q / 2);
    return {
      disc: 0, p, q, caseType: 'repeated',
      roots: [
        { real: rnd(2 * u - shift), imag: 0, isComplex: false, isDouble: false },
        { real: rnd(-u - shift), imag: 0, isComplex: false, isDouble: true },
        { real: rnd(-u - shift), imag: 0, isComplex: false, isDouble: true },
      ],
    };
  } else {
    const r = Math.sqrt(-p / 3);
    const phi = Math.acos(Math.max(-1, Math.min(1, -q / 2 / (r * r * r))));
    const roots: Root[] = [];
    for (let k = 0; k < 3; k++) {
      roots.push({
        real: rnd(2 * r * Math.cos((phi + 2 * Math.PI * k) / 3) - shift),
        imag: 0, isComplex: false, isDouble: false,
      });
    }
    return { disc, p, q, caseType: 'three-real', roots };
  }
}

export function buildEquation(a: number, b: number, c: number, d: number): string {
  if (a === 0) return 'f(x) = ? (a ≠ 0 required)';
  const fmt = (v: number, power: string, isFirst: boolean): string => {
    if (v === 0) return '';
    const abs = Math.abs(v);
    const sign = v < 0 ? ' − ' : isFirst ? '' : ' + ';
    const coeff = abs === 1 ? '' : String(abs);
    return sign + coeff + power;
  };
  let eq = 'f(x) = ';
  eq += fmt(a, 'x³', true) || '0';
  eq += fmt(b, 'x²', false);
  eq += fmt(c, 'x', false);
  if (d !== 0) eq += (d < 0 ? ' − ' : ' + ') + Math.abs(d);
  return eq;
}

export function findCriticalPoints(a: number, b: number, c: number, d: number): CriticalPoint[] {
  // Derivative: f'(x) = 3ax² + 2bx + c = 0
  const A = 3 * a, B = 2 * b, C = c;
  const disc = B * B - 4 * A * C;
  if (disc < 0) return [];
  const sqrtD = Math.sqrt(Math.max(0, disc));
  const xs: number[] = Math.abs(disc) < EPSILON
    ? [rnd(-B / (2 * A))]
    : [rnd((-B + sqrtD) / (2 * A)), rnd((-B - sqrtD) / (2 * A))];
  return xs
    .map((x) => {
      const y = rnd(a * x ** 3 + b * x ** 2 + c * x + d);
      const secondDeriv = 6 * a * x + 2 * b;
      return { x, y, type: secondDeriv < 0 ? 'max' : 'min' } as CriticalPoint;
    })
    .sort((p1, p2) => p1.x - p2.x);
}

export function drawGraph(
  canvas: HTMLCanvasElement,
  a: number,
  b: number,
  c: number,
  d: number,
  roots: Root[],
  criticalPoints: CriticalPoint[],
): void {
  const ctx = canvas.getContext('2d')!;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0d0f14';
  ctx.fillRect(0, 0, W, H);

  const xC = W / 2, yC = H / 2, scale = 28;

  // Grid lines
  ctx.beginPath();
  ctx.strokeStyle = '#1c2030';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += scale) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
  for (let y = 0; y <= H; y += scale) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
  ctx.stroke();

  // Axes
  ctx.beginPath();
  ctx.strokeStyle = '#3a3f50';
  ctx.lineWidth = 1.5;
  ctx.moveTo(xC, 0); ctx.lineTo(xC, H);
  ctx.moveTo(0, yC); ctx.lineTo(W, yC);
  ctx.stroke();

  // Axis tick labels
  ctx.fillStyle = '#3a4055';
  ctx.font = '9px monospace';
  ctx.textAlign = 'center';
  for (let i = -Math.floor(xC / scale); i <= Math.floor(xC / scale); i++) {
    if (i !== 0) ctx.fillText(String(i), xC + i * scale, yC + 12);
  }

  // Cubic curve
  const xStart = -xC / scale, xEnd = xC / scale;
  ctx.save();
  ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
  ctx.beginPath();
  ctx.strokeStyle = '#c8ff00';
  ctx.lineWidth = 2.5;
  let isFirst = true;
  for (let x = xStart; x <= xEnd; x += 0.02) {
    const y = a * x ** 3 + b * x ** 2 + c * x + d;
    const px = xC + x * scale, py = yC - y * scale;
    if (isFirst) { ctx.moveTo(px, py); isFirst = false; } else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();

  // Real root markers
  const subs = ['₁', '₂', '₃'];
  roots.forEach((root, idx) => {
    if (root.isComplex) return;
    const cx = xC + root.real * scale, cy = yC;
    const color = root.isDouble ? '#00d4ff' : '#c8ff00';
    ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#0d0f14'; ctx.fill();
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = color; ctx.fill();
    ctx.font = 'bold 10px monospace'; ctx.fillStyle = color; ctx.textAlign = 'center';
    ctx.fillText(`x${subs[idx]}=${root.real}`, cx, cy > H / 2 ? cy - 14 : cy + 22);
  });

  // Critical point markers (BONUS)
  criticalPoints.forEach((pt) => {
    const cx = xC + pt.x * scale, cy = yC - pt.y * scale;
    const color = pt.type === 'max' ? '#ff6b35' : '#00d4ff';
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = color; ctx.fill();
    ctx.font = 'bold 9px monospace'; ctx.fillStyle = color; ctx.textAlign = 'center';
    ctx.fillText(`${pt.type === 'max' ? '▲' : '▼'}(${pt.x},${pt.y})`, cx, cy - 11);
  });
}
