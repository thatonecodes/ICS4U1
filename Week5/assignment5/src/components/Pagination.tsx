import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const maxPages = Math.min(totalPages, 500);
  
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(maxPages, currentPage + 2);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < maxPages) {
      if (end < maxPages - 1) pages.push('...');
      pages.push(maxPages);
    }

    return pages;
  };

  if (maxPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center gap-1 px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        <FaChevronLeft /> Prev
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              page === currentPage
                ? 'bg-tmdb-light text-white'
                : page === '...'
                ? 'bg-transparent text-gray-400 cursor-default'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= maxPages}
        className="flex items-center gap-1 px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        Next <FaChevronRight />
      </button>
    </div>
  );
}
