/**
 * Clearcut stats engine — two-proportion z-test for A/B experiments.
 * All functions are pure and side-effect free.
 */

// ---------------------------------------------------------------------------
// Normal distribution primitives
// ---------------------------------------------------------------------------

/** Approximation of the standard normal CDF using Horner's method (Abramowitz & Stegun 26.2.17). */
export function normalCDF(z: number): number {
  if (z < -8) return 0;
  if (z > 8) return 1;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const poly =
    t * (0.319381530 +
    t * (-0.356563782 +
    t * (1.781477937 +
    t * (-1.821255978 +
    t * 1.330274429))));
  const pdf = Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
  const p = 1 - pdf * poly;
  return z >= 0 ? p : 1 - p;
}

/** Inverse normal CDF (probit) — Beasley-Springer-Moro algorithm. */
export function normalInv(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p === 0.5) return 0;

  const a = [
    -3.969683028665376e1,  2.209460984245205e2,
    -2.759285104469687e2,  1.383577518672690e2,
    -3.066479806614716e1,  2.506628277459239,
  ];
  const b = [
    -5.447609879822406e1,  1.615858368580409e2,
    -1.556989798598866e2,  6.680131188771972e1,
    -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1,
    -2.400758277161838,    -2.549732539343734,
     4.374664141464968,     2.938163982698783,
  ];
  const d = [
     7.784695709041462e-3,  3.224671290700398e-1,
     2.445134137142996,     3.754408661907416,
  ];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  let q: number, r: number;

  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
           ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
  } else if (p <= pHigh) {
    q = p - 0.5;
    r = q * q;
    return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q /
           (((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
             ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
  }
}

// ---------------------------------------------------------------------------
// Core types
// ---------------------------------------------------------------------------

export interface SampleSizeInput {
  baselineRate: number;   // e.g. 0.05 for 5%
  mde: number;            // minimum detectable effect, relative — e.g. 0.10 for +10%
  alpha: number;          // significance level — e.g. 0.05
  power: number;          // statistical power — e.g. 0.80
  variants: number;       // number of variants (excluding control) — e.g. 1 for A/B
}

export interface SampleSizeResult {
  samplePerVariant: number;   // required users per variant (control counts as one)
  totalSample: number;        // across all arms (control + variants)
  treatmentRate: number;      // baseline * (1 + mde)
  absoluteMde: number;        // absolute difference
  zAlpha: number;
  zBeta: number;
}

export interface ReadoutInput {
  controlUsers: number;
  controlConversions: number;
  variantUsers: number;
  variantConversions: number;
  alpha: number;              // significance level
}

export interface ReadoutResult {
  controlRate: number;
  variantRate: number;
  absoluteLift: number;
  relativeLift: number;
  zScore: number;
  pValue: number;             // two-tailed
  significant: boolean;
  ciLow: number;              // 95% CI on the absolute lift
  ciHigh: number;
  pooledStdErr: number;
}

// ---------------------------------------------------------------------------
// Sample size calculation
// ---------------------------------------------------------------------------

/**
 * Required sample size per variant for a two-proportion z-test.
 * Uses the standard formula: n = (z_α/2 + z_β)² · (p1·q1 + p2·q2) / δ²
 */
export function calculateSampleSize(input: SampleSizeInput): SampleSizeResult {
  const { baselineRate, mde, alpha, power, variants } = input;

  const zAlpha = normalInv(1 - alpha / 2);   // two-tailed
  const zBeta  = normalInv(power);

  const p1 = baselineRate;
  const p2 = baselineRate * (1 + mde);
  const delta = Math.abs(p2 - p1);

  const numerator   = (zAlpha + zBeta) ** 2 * (p1 * (1 - p1) + p2 * (1 - p2));
  const denominator = delta ** 2;

  const samplePerVariant = Math.ceil(numerator / denominator);
  const totalSample = samplePerVariant * (variants + 1); // +1 for control

  return {
    samplePerVariant,
    totalSample,
    treatmentRate: p2,
    absoluteMde: delta,
    zAlpha,
    zBeta,
  };
}

/**
 * Estimated days to reach required sample size.
 */
export function estimateDuration(
  totalSample: number,
  dailyVisitors: number,
  variants: number,
): number {
  if (dailyVisitors <= 0) return Infinity;
  // traffic is split equally across control + all variants
  const arms = variants + 1;
  const dailyPerArm = dailyVisitors / arms;
  const samplePerArm = totalSample / arms;
  return Math.ceil(samplePerArm / dailyPerArm);
}

// ---------------------------------------------------------------------------
// Readout — did my experiment win?
// ---------------------------------------------------------------------------

/**
 * Two-proportion z-test for an observed experiment readout.
 */
export function calculateReadout(input: ReadoutInput): ReadoutResult {
  const { controlUsers, controlConversions, variantUsers, variantConversions, alpha } = input;

  const controlRate = controlConversions / controlUsers;
  const variantRate = variantConversions / variantUsers;
  const absoluteLift = variantRate - controlRate;
  const relativeLift = controlRate > 0 ? absoluteLift / controlRate : 0;

  // Pooled standard error
  const pooledP = (controlConversions + variantConversions) / (controlUsers + variantUsers);
  const pooledStdErr = Math.sqrt(pooledP * (1 - pooledP) * (1 / controlUsers + 1 / variantUsers));

  const zScore = pooledStdErr > 0 ? absoluteLift / pooledStdErr : 0;
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore))); // two-tailed

  // Confidence interval on absolute lift (unpooled SE)
  const unpooledSE = Math.sqrt(
    (controlRate * (1 - controlRate)) / controlUsers +
    (variantRate * (1 - variantRate)) / variantUsers
  );
  const zCI = normalInv(1 - alpha / 2);
  const ciLow  = absoluteLift - zCI * unpooledSE;
  const ciHigh = absoluteLift + zCI * unpooledSE;

  return {
    controlRate,
    variantRate,
    absoluteLift,
    relativeLift,
    zScore,
    pValue,
    significant: pValue < alpha,
    ciLow,
    ciHigh,
    pooledStdErr,
  };
}

// ---------------------------------------------------------------------------
// Power analysis — given a fixed sample, what MDE can we detect?
// ---------------------------------------------------------------------------

/**
 * Minimum detectable effect (relative) achievable for a given sample size and power.
 * Binary searches over MDE until the required sample matches the available sample.
 */
export function calculateMDE(
  baselineRate: number,
  samplePerVariant: number,
  alpha: number,
  power: number,
): number {
  const zAlpha = normalInv(1 - alpha / 2);
  const zBeta  = normalInv(power);

  let lo = 0.001, hi = 5.0;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const p2 = baselineRate * (1 + mid);
    const delta = Math.abs(p2 - baselineRate);
    const n = ((zAlpha + zBeta) ** 2 * (baselineRate * (1 - baselineRate) + p2 * (1 - p2))) / delta ** 2;
    if (n > samplePerVariant) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
