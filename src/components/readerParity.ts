export function getPhysicalSpread(index: number, lastIndex: number) {
  const normalized = Math.max(0, Math.min(index, lastIndex))
  if (normalized === 0 || normalized === lastIndex) return [normalized]
  const odd = normalized % 2 === 1 ? normalized : normalized - 1
  return [odd, odd + 1]
}
