export function adjust<P>(
  max: number,
  parameters: P & { per_page?: number }
): P & { per_page?: number } {
  const { ...adjusted } = parameters;
  const per_page = parameters.per_page;
  if (max <= 100 && (per_page === undefined || max < per_page)) {
    adjusted.per_page = max;
  }
  return adjusted;
}

// vim: set ts=2 sw=2 sts=2:
