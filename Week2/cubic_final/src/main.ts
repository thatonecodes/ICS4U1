import "./style.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Root {
  real: number;
  imag: number;       // imaginary part (0 if purely real)
  isComplex: boolean;
  isDouble: boolean;  // flagged as a double/repeated root
}

interface CubicResult {
  roots: Root[];
  caseType: "three-real" | "one-real-two-complex" | "repeated";
  discriminant: number;
}

// ─── Math: Solve Cubic ────────────────────────────────────────────────────────

const EPSILON = 1e-10;

function round(n: number, decimals = 6): number {
  return Math.round(n * 10 ** decimals) / 10 ** decimals;
}

function solveCubic(a: number, b: number, c: number, d: number): CubicResult {
  // Normalise to x³ + px + q = 0 via substitution x = t - b/(3a)
  const shift = b / (3 * a);
  const p = (c / a) - (b * b) / (3 * a * a);
  const q = (2 * b * b * b) / (27 * a * a * a) - (b * c) / (3 * a * a) + d / a;

  // Discriminant of the depressed cubic
  const discriminant = (q * q) / 4 + (p * p * p) / 27;

  if (discriminant > EPSILON) {
    // ── One real root, two complex conjugates ──────────────────────────────
    const sqrtD = Math.sqrt(discriminant);
    const u = Math.cbrt(-q / 2 + sqrtD);
    const v = Math.cbrt(-q / 2 - sqrtD);

    const realRoot = round(u + v - shift);

    // Real parts of complex pair: -(u+v)/2 - shift
    // Imaginary parts: ±(u-v)*√3/2
    const realPart = round(-(u + v) / 2 - shift);
    const imagPart = round((u - v) * Math.sqrt(3) / 2);

    return {
      discriminant,
      caseType: "one-real-two-complex",
      roots: [
        { real: realRoot, imag: 0,        isComplex: false, isDouble: false },
        { real: realPart, imag: imagPart,  isComplex: true,  isDouble: false },
        { real: realPart, imag: -imagPart, isComplex: true,  isDouble: false },
      ],
    };
  } else if (Math.abs(discriminant) <= EPSILON) {
    // ── Repeated roots (at least two equal) ───────────────────────────────
    if (Math.abs(p) <= EPSILON && Math.abs(q) <= EPSILON) {
      // Triple root
      const tripleRoot = round(-shift);
      return {
        discriminant: 0,
        caseType: "repeated",
        roots: [
          { real: tripleRoot, imag: 0, isComplex: false, isDouble: true },
          { real: tripleRoot, imag: 0, isComplex: false, isDouble: true },
          { real: tripleRoot, imag: 0, isComplex: false, isDouble: true },
        ],
      };
    }
    const u = Math.cbrt(-q / 2);
    const doubleRoot  = round(-u - shift);
    const singleRoot  = round(2 * u - shift);
    return {
      discriminant: 0,
      caseType: "repeated",
      roots: [
        { real: singleRoot, imag: 0, isComplex: false, isDouble: false },
        { real: doubleRoot,  imag: 0, isComplex: false, isDouble: true  },
        { real: doubleRoot,  imag: 0, isComplex: false, isDouble: true  },
      ],
    };
  } else {
    // ── Three distinct real roots (trigonometric method) ──────────────────
    const r   = Math.sqrt(-p / 3);
    const phi = Math.acos(Math.max(-1, Math.min(1, (-q / 2) / (r * r * r))));
    const roots: Root[] = [];
    for (let k = 0; k < 3; k++) {
      const val = round(2 * r * Math.cos((phi + 2 * Math.PI * k) / 3) - shift);
      roots.push({ real: val, imag: 0, isComplex: false, isDouble: false });
    }
    return { discriminant, caseType: "three-real", roots };
  }
}

// ─── Equation Preview ─────────────────────────────────────────────────────────

function formatCoeff(val: number, isFirst: boolean): string {
  if (val === 0) return "";
  const abs = Math.abs(val);
  const sign = val < 0 ? " − " : isFirst ? "" : " + ";
  const num  = abs === 1 ? "" : String(abs);
  return sign + (abs === 1 && isFirst ? "" : num !== "" ? num : "1");
}

function buildEquation(a: number, b: number, c: number, d: number): string {
  if (a === 0) return "a cannot be 0";
  let eq = "f(x) = ";
  const fmt = (v: number, power: string, isFirst: boolean) => {
    if (v === 0) return "";
    const abs  = Math.abs(v);
    const sign = v < 0 ? " − " : isFirst ? "" : " + ";
    const coeff = abs === 1 ? "" : String(abs);
    return sign + coeff + power;
  };
  eq += fmt(a, "x³", true)  || "0";
  eq += fmt(b, "x²", false);
  eq += fmt(c, "x",  false);
  if (d !== 0) eq += (d < 0 ? " − " : " + ") + Math.abs(d);
  return eq;
}

// ─── Canvas Graph ─────────────────────────────────────────────────────────────

function drawGraph(
  canvas: HTMLCanvasElement,
  a: number, b: number, c: number, d: number,
  roots: Root[]
): void {
  const ctx = canvas.getContext("2d")!;
  const W = canvas.width;
  const H = canvas.height;

  // Clear
  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = "#0f1116";
  ctx.fillRect(0, 0, W, H);

  // Determine x range based on real roots
  const realRoots = roots.filter(r => !r.isComplex).map(r => r.real);
  let xMin: number, xMax: number;

  if (realRoots.length > 0) {
    const spread = Math.max(Math.abs(Math.max(...realRoots) - Math.min(...realRoots)), 2);
    const center = (Math.max(...realRoots) + Math.min(...realRoots)) / 2;
    xMin = center - spread * 2;
    xMax = center + spread * 2;
  } else {
    xMin = -5; xMax = 5;
  }

  const evalCubic = (x: number) => a * x ** 3 + b * x ** 2 + c * x + d;

  // Sample y values to determine range
  const STEPS = 300;
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const x = xMin + (xMax - xMin) * i / STEPS;
    xs.push(x);
    ys.push(evalCubic(x));
  }
  const yVals = ys.filter(isFinite);
  let yMin = Math.min(...yVals);
  let yMax = Math.max(...yVals);
  const yRange = yMax - yMin || 4;
  yMin -= yRange * 0.12;
  yMax += yRange * 0.12;

  // Coordinate transforms
  const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * W;
  const toCanvasY = (y: number) => H - ((y - yMin) / (yMax - yMin)) * H;

  // ── Grid lines ──────────────────────────────────────────────────────────
  ctx.strokeStyle = "#1c2030";
  ctx.lineWidth = 1;
  const xStep = niceTick(xMax - xMin);
  const yStep = niceTick(yMax - yMin);

  for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
    const cx = toCanvasX(x);
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
  }
  for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
    const cy = toCanvasY(y);
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
  }

  // ── Axes ────────────────────────────────────────────────────────────────
  const ox = toCanvasX(0);
  const oy = toCanvasY(0);

  ctx.strokeStyle = "#3a3f50";
  ctx.lineWidth = 1;
  if (ox >= 0 && ox <= W) {
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, H); ctx.stroke();
  }
  if (oy >= 0 && oy <= H) {
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(W, oy); ctx.stroke();
  }

  // Axis tick labels
  ctx.fillStyle = "#4a5060";
  ctx.font = "10px Space Mono, monospace";
  ctx.textAlign = "center";
  for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
    if (Math.abs(x) < 0.001) continue;
    const cx = toCanvasX(x);
    ctx.fillText(String(+x.toFixed(2)), cx, Math.min(H - 6, oy + 14));
  }
  ctx.textAlign = "right";
  for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
    if (Math.abs(y) < 0.001) continue;
    const cy = toCanvasY(y);
    ctx.fillText(String(+y.toFixed(2)), Math.max(36, ox - 6), cy + 3);
  }

  // ── Cubic curve ──────────────────────────────────────────────────────────
  ctx.beginPath();
  ctx.strokeStyle = "#c8ff00";
  ctx.lineWidth = 2.5;
  ctx.shadowBlur = 8;
  ctx.shadowColor = "rgba(200, 255, 0, 0.3)";
  let started = false;
  for (let i = 0; i <= STEPS; i++) {
    const cx = toCanvasX(xs[i]);
    const cy = toCanvasY(ys[i]);
    if (!isFinite(cy) || cy < -200 || cy > H + 200) { started = false; continue; }
    if (!started) { ctx.moveTo(cx, cy); started = true; }
    else ctx.lineTo(cx, cy);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  // ── Root markers ────────────────────────────────────────────────────────
  roots.forEach((root, idx) => {
    if (root.isComplex) return;
    const cx = toCanvasX(root.real);
    const cy = toCanvasY(0);
    if (cx < 0 || cx > W) return;

    const color = root.isDouble ? "#00d4ff" : "#c8ff00";

    // Circle marker
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#0f1116";
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner dot
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Label
    ctx.font = "bold 11px Space Mono, monospace";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    const labelY = cy > H / 2 ? cy - 14 : cy + 22;
    ctx.fillText(`x${["₁","₂","₃"][idx]}=${root.real}`, cx, labelY);
  });
}

function niceTick(range: number): number {
  const rough = range / 6;
  const pow   = Math.floor(Math.log10(rough));
  const frac  = rough / 10 ** pow;
  let nice: number;
  if      (frac < 1.5) nice = 1;
  else if (frac < 3.5) nice = 2;
  else if (frac < 7.5) nice = 5;
  else                 nice = 10;
  return nice * 10 ** pow;
}

// ─── DOM Helpers ──────────────────────────────────────────────────────────────

function formatRoot(root: Root): string {
  if (!root.isComplex) return String(root.real);
  const sign = root.imag < 0 ? " − " : " + ";
  return `${root.real}${sign}${Math.abs(root.imag)}i`;
}

function renderRoots(roots: Root[], caseType: string, disc: number): void {
  const tbody = document.getElementById("rootsBody")!;
  tbody.innerHTML = "";

  roots.forEach((root, i) => {
    const tr = document.createElement("tr");

    // Index
    const tdIdx = document.createElement("td");
    tdIdx.innerHTML = `<span class="root-index">x<sub>${i + 1}</sub></span>`;
    tr.appendChild(tdIdx);

    // Value
    const tdVal = document.createElement("td");
    if (root.isComplex) {
      tdVal.innerHTML = `<span class="root-value complex">Complex Number</span>`;
    } else {
      tdVal.innerHTML = `<span class="root-value">${root.real}</span>`;
    }
    tr.appendChild(tdVal);

    // Type badge
    const tdType = document.createElement("td");
    let badgeClass = "badge-real";
    let label = "Real";
    if (root.isComplex) { badgeClass = "badge-complex"; label = "Complex"; }
    else if (root.isDouble) { badgeClass = "badge-double"; label = "Repeated"; }
    tdType.innerHTML = `<span class="root-type-badge ${badgeClass}">${label}</span>`;
    tr.appendChild(tdType);

    tbody.appendChild(tr);
  });

  // Discriminant info
  const infoEl = document.getElementById("discriminantInfo")!;
  const caseLabels: Record<string, string> = {
    "three-real":           "Three distinct real roots",
    "one-real-two-complex": "One real root + two complex conjugates",
    "repeated":             "Repeated root(s)",
  };
  infoEl.innerHTML = `
    <strong>Δ</strong> = ${disc.toExponential(4)}<br>
    <strong>Case:</strong> ${caseLabels[caseType] ?? caseType}
  `;
  infoEl.classList.add("visible");
}

// ─── Main Logic ───────────────────────────────────────────────────────────────

function getInputs(): { a: number; b: number; c: number; d: number } | null {
  const get = (id: string) => parseFloat((document.getElementById(id) as HTMLInputElement).value);
  const a = get("a"), b = get("b"), c = get("c"), d = get("d");
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
    alert("Please enter valid numbers for all coefficients. Note: a cannot be 0.");
    return;
  }

  const { a, b, c, d } = vals;
  const result = solveCubic(a, b, c, d);

  renderRoots(result.roots, result.caseType, result.discriminant);

  const canvas = document.getElementById("graph") as HTMLCanvasElement;
  drawGraph(canvas, a, b, c, d, result.roots);
}

// ─── Event Listeners ──────────────────────────────────────────────────────────

document.getElementById("solveBtn")!.addEventListener("click", solve);

["a", "b", "c", "d"].forEach(id => {
  document.getElementById(id)!.addEventListener("input", updateEquationPreview);
});

// Handle Enter key
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") solve();
});

// Init preview
updateEquationPreview();

// Draw initial graph with default values
solve();
