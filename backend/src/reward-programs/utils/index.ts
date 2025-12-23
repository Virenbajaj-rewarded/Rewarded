export const toNumber = (val: any, fallback?: number | null): number | null => {
  if (val === undefined || val === null) return fallback ?? null;
  if (typeof val === 'number') return val;
  if (typeof val === 'string' && val.trim() !== '') return Number(val);
  if (typeof val.toNumber === 'function') return val.toNumber();
  const n = Number(val);
  return isNaN(n) ? (fallback ?? null) : n;
};
