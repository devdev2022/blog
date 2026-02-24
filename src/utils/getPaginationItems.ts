export function getPaginationItems(
  currentPage: number,
  totalPages: number,
): (number | '...')[] {
  if (totalPages === 0) return [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // '...'은 페이지 번호 생략을 위함
  const items: (number | '...')[] = [1];

  if (currentPage > 3) items.push('...');

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) items.push(i);

  if (currentPage < totalPages - 2) items.push('...');

  items.push(totalPages);
  return items;
}
