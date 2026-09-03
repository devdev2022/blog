import { getPaginationItems } from "@/utils/getPaginationItems";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const paginationItems = getPaginationItems(currentPage, totalPages);

  return (
    <nav className="posts-pagination">
      <button
        className="pagination-btn pagination-arrow"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
          <path
            d="M6 1L1 6L6 11"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {paginationItems.map((item, idx) =>
        item === "..." ? (
          <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
            …
          </span>
        ) : (
          <button
            key={item}
            className={`pagination-btn${currentPage === item ? " active" : ""}`}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        ),
      )}

      <button
        className="pagination-btn pagination-arrow"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
          <path
            d="M1 1L6 6L1 11"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </nav>
  );
}

export default Pagination;
