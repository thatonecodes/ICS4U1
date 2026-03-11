import "./style.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Root {
  real: number;
  imag: number;
  isComplex: boolean;
  isDouble: boolean;
}

interface CubicResult {
  roots: Root[];
  caseType: "three-real" | "one-real-two-complex" | "repeated";
  discriminant: number;
  p: number;
  q: number;
}

const EPSILON = 1e-10;

function round(n: number, decimals = 6): number {
  return Math.round(n * 10 ** decimals) / 10 ** decimals;
}

function solveCubic(a: number, b: number, c: number, d: number): CubicResult {
  const shift = b / (3 * a);
  const p = c / a - (b * b) / (3 * a * a);
  const q = (2 * b * b * b) / (27 * a * a * a) - (b * c) / (3 * a * a) + d / a;
  const discriminant = (q * q) / 4 + (p * p * p) / 27;

  if (discriminant > EPSILON) {
    const sqrtD = Math.sqrt(discriminant);
    const u = Math.cbrt(-q / 2 + sqrtD);
    const v = Math.cbrt(-q / 2 - sqrtD);
    const realRoot = round(u + v - shift);
    const realPart = round(-(u + v) / 2 - shift);
    const imagPart = round(((u - v) * Math.sqrt(3)) / 2);
    return {
      discriminant,
      p,
      q,
      caseType: "one-real-two-complex",
      roots: [
        { real: realRoot, imag: 0, isComplex: false, isDouble: false },
        { real: realPart, imag: imagPart, isComplex: true, isDouble: false },
        { real: realPart, imag: -imagPart, isComplex: true, isDouble: false },
      ],
    };
  } else if (Math.abs(discriminant) <= EPSILON) {
    if (Math.abs(p) <= EPSILON && Math.abs(q) <= EPSILON) {
      const tripleRoot = round(-shift);
      return {
        discriminant: 0,
        p,
        q,
        caseType: "repeated",
        roots: [
          { real: tripleRoot, imag: 0, isComplex: false, isDouble: true },
          { real: tripleRoot, imag: 0, isComplex: false, isDouble: true },
          { real: tripleRoot, imag: 0, isComplex: false, isDouble: true },
        ],
      };
    }
    const u = Math.cbrt(-q / 2);
    const doubleRoot = round(-u - shift);
    const singleRoot = round(2 * u - shift);
    return {
      discriminant: 0,
      p,
      q,
      caseType: "repeated",
      roots: [
        { real: singleRoot, imag: 0, isComplex: false, isDouble: false },
        { real: doubleRoot, imag: 0, isComplex: false, isDouble: true },
        { real: doubleRoot, imag: 0, isComplex: false, isDouble: true },
      ],
    };
  } else {
    const r = Math.sqrt(-p / 3);
    const phi = Math.acos(Math.max(-1, Math.min(1, -q / 2 / (r * r * r))));
    const roots: Root[] = [];
    for (let k = 0; k < 3; k++) {
      const val = round(2 * r * Math.cos((phi + 2 * Math.PI * k) / 3) - shift);
      roots.push({ real: val, imag: 0, isComplex: false, isDouble: false });
    }
    return { discriminant, p, q, caseType: "three-real", roots };
  }
}

// ─── Equation Preview ─────────────────────────────────────────────────────────

function buildEquation(a: number, b: number, c: number, d: number): string {
  if (a === 0) return "a cannot be 0";
  let eq = "f(x) = ";
  const fmt = (v: number, power: string, isFirst: boolean) => {
    if (v === 0) return "";
    const abs = Math.abs(v);
    const sign = v < 0 ? " − " : isFirst ? "" : " + ";
    const coeff = abs === 1 ? "" : String(abs);
    return sign + coeff + power;
  };
  eq += fmt(a, "x³", true) || "0";
  eq += fmt(b, "x²", false);
  eq += fmt(c, "x", false);
  if (d !== 0) eq += (d < 0 ? " − " : " + ") + Math.abs(d);
  return eq;
}

// ─── Graph ────────────────────────────────────────────────────────────────────

function drawGraph(
  canvas: HTMLCanvasElement,
  a: number,
  b: number,
  c: number,
  d: number,
  roots: Root[],
): void {
  const ctx = canvas.getContext("2d")!;
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#0f1116";
  ctx.fillRect(0, 0, W, H);

  const xCenter = W / 2;
  const yCenter = H / 2;
  const scale = 30;

  // Grid
  ctx.beginPath();
  ctx.strokeStyle = "#1c2030";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += scale) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
  }
  for (let y = 0; y <= H; y += scale) {
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
  }
  ctx.stroke();

  // Axes
  ctx.beginPath();
  ctx.strokeStyle = "#3a3f50";
  ctx.lineWidth = 1;
  ctx.moveTo(xCenter, 0);
  ctx.lineTo(xCenter, H);
  ctx.moveTo(0, yCenter);
  ctx.lineTo(W, yCenter);
  ctx.stroke();

  // Curve
  const xStart = -W / 2 / scale;
  const xEnd = W / 2 / scale;

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, H);
  ctx.clip();
  ctx.beginPath();
  ctx.strokeStyle = "#c8ff00";
  ctx.lineWidth = 2.5;
  ctx.shadowBlur = 8;
  ctx.shadowColor = "rgba(200,255,0,0.3)";

  const yStart = a * xStart ** 3 + b * xStart ** 2 + c * xStart + d;
  ctx.moveTo(xCenter + xStart * scale, yCenter - yStart * scale);
  for (let x = xStart; x <= xEnd; x += 0.1) {
    const y = a * x ** 3 + b * x ** 2 + c * x + d;
    ctx.lineTo(xCenter + x * scale, yCenter - y * scale);
  }
  ctx.stroke();
  ctx.restore();

  // Root markers
  roots.forEach((root, idx) => {
    if (root.isComplex) return;
    const cx = xCenter + root.real * scale;
    const cy = yCenter;
    const color = root.isDouble ? "#00d4ff" : "#c8ff00";

    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#0f1116";
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.font = "bold 11px Space Mono, monospace";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(
      `x${["₁", "₂", "₃"][idx]}=${root.real}`,
      cx,
      cy > H / 2 ? cy - 14 : cy + 22,
    );
  });
}

// ─── DOM Helpers ──────────────────────────────────────────────────────────────

function renderRoots(result: CubicResult): void {
  const tbody = document.getElementById("rootsBody")!;
  tbody.innerHTML = "";

  result.roots.forEach((root, i) => {
    const tr = document.createElement("tr");

    const tdIdx = document.createElement("td");
    tdIdx.innerHTML = `<span class="root-index">x<sub>${i + 1}</sub></span>`;
    tr.appendChild(tdIdx);

    const tdVal = document.createElement("td");
    if (root.isComplex) {
      tdVal.innerHTML = `<span class="root-value complex">Complex Number</span>`;
    } else {
      tdVal.innerHTML = `<span class="root-value">${root.real}</span>`;
    }
    tr.appendChild(tdVal);

    const tdType = document.createElement("td");
    let badgeClass = "badge-real";
    let label = "Real";
    if (root.isComplex) {
      badgeClass = "badge-complex";
      label = "Complex";
    } else if (root.isDouble) {
      badgeClass = "badge-double";
      label = "Repeated";
    }
    tdType.innerHTML = `<span class="root-type-badge ${badgeClass}">${label}</span>`;
    tr.appendChild(tdType);

    tbody.appendChild(tr);
  });

  const caseLabels: Record<string, string> = {
    "three-real": "Three distinct real roots",
    "one-real-two-complex": "One real root + two complex conjugates",
    repeated: "Repeated root(s)",
  };

  const infoEl = document.getElementById("discriminantInfo")!;
  infoEl.innerHTML = `
    <strong>p</strong> = ${round(result.p, 6)}<br>
    <strong>q</strong> = ${round(result.q, 6)}<br>
    <strong>Δ</strong> = ${result.discriminant}<br>
    <strong>Case:</strong> ${caseLabels[result.caseType] ?? result.caseType}
  `;
  infoEl.classList.add("visible");
}

// ─── Main Logic ───────────────────────────────────────────────────────────────

function getInputs(): { a: number; b: number; c: number; d: number } | null {
  const get = (id: string) =>
    parseFloat((document.getElementById(id) as HTMLInputElement).value);
  const a = get("a"),
    b = get("b"),
    c = get("c"),
    d = get("d");
  if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) return null;
  if (a === 0) return null;
  return { a, b, c, d };
}

function updateEquationPreview(): void {
  const vals = getInputs();
  const el = document.getElementById("equationPreview")!;
  if (!vals) {
    el.textContent = "f(x) = ? (a ≠ 0 required)";
    return;
  }
  el.textContent = buildEquation(vals.a, vals.b, vals.c, vals.d);
}

function solve(): void {
  const vals = getInputs();
  if (!vals) {
    alert(
      "Please enter valid numbers for all coefficients. Note: a cannot be 0.",
    );
    return;
  }
  const { a, b, c, d } = vals;
  const result = solveCubic(a, b, c, d);
  renderRoots(result);
  const canvas = document.getElementById("graph") as HTMLCanvasElement;
  drawGraph(canvas, a, b, c, d, result.roots);
}

document.getElementById("solveBtn")!.addEventListener("click", solve);
["a", "b", "c", "d"].forEach((id) => {
  document.getElementById(id)!.addEventListener("input", updateEquationPreview);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") solve();
});

updateEquationPreview();
solve();
