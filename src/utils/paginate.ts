export function parsePage(req: any) {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || 25)));
  const search = (req.query.search as string | undefined)?.trim();
  return { page, limit, search };
}