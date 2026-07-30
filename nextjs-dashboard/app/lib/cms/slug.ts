export function slugifyArticleTitle(title: string) {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^\w가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || `article-${Date.now()}`;
}
