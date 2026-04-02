export interface Root {
  real: number;
  imag: number;
  isComplex: boolean;
  isDouble: boolean;
}

export interface CubicResult {
  roots: Root[];
  caseType: 'three-real' | 'one-real-two-complex' | 'repeated';
  disc: number;
  p: number;
  q: number;
}

export interface Coefficients {
  a: number;
  b: number;
  c: number;
  d: number;
}

export interface HistoryEntry {
  id: number;
  coefficients: Coefficients;
}

export interface CriticalPoint {
  x: number;
  y: number;
  type: 'max' | 'min';
}
