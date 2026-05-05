import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaSearch, FaFilm, FaTv, FaUser } from 'react-icons/fa';
import { useDebounce } from '../hooks/useDebounce';

type SearchType = 'multi' | 'movie' | 'tv' | 'person';

const searchOptions: { value: SearchType; label: string; icon: React.ReactNode }[] = [
  { value: 'multi', label: 'All', icon: <FaSearch className="text-xs" /> },
  { value: 'movie', label: 'Movies', icon: <FaFilm className="text-xs" /> },
  { value: 'tv', label: 'TV Shows', icon: <FaTv className="text-xs" /> },
  { value: 'person', label: 'People', icon: <FaUser className="text-xs" /> },
];

export default function SearchBar() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [searchType, setSearchType] = useState<SearchType>((searchParams.get('type') as SearchType) || 'multi');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 500);
  const isFirstRender = useRef(true);

  // Auto-search when debounced query changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (debouncedQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(debouncedQuery.trim())}&type=${searchType}`);
    }
  }, [debouncedQuery, searchType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}&type=${searchType}`);
    }
  };

  const selectedOption = searchOptions.find((o) => o.value === searchType);

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex items-center">
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 text-gray-300 rounded-l-full border-r border-gray-700 hover:bg-gray-700 transition text-sm font-medium h-[42px]"
          >
            {selectedOption?.icon}
            <span className="hidden sm:inline">{selectedOption?.label}</span>
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-36 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50">
              {searchOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setSearchType(option.value);
                    setDropdownOpen(false);
                  }}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition ${
                    searchType === option.value
                      ? 'bg-tmdb-light text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${selectedOption?.label.toLowerCase() || ''}...`}
            className="w-48 md:w-64 pl-10 pr-4 py-2 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tmdb-light transition h-[42px]"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-tmdb-light text-white rounded-r-full hover:bg-blue-600 transition font-medium h-[42px]"
        >
          Search
        </button>
      </div>
    </form>
  );
}
