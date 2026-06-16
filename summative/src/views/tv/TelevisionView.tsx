import { useState } from 'react';
import { FaTv } from 'react-icons/fa';
import { useFetch } from '@/hooks/useTMDB';
import { getTVShows } from '@/services/tmdbApi';
import TVShowCard from '@/components/cards/TVShowCard';
import Loading from '@/components/feedback/Loading';
import ErrorMessage from '@/components/feedback/ErrorMessage';
import Pagination from '@/components/controls/Pagination';

const categories = [
  { key: 'airing_today', label: 'Airing Today' },
  { key: 'on_the_air', label: 'On The Air' },
  { key: 'popular', label: 'Popular' },
  { key: 'top_rated', label: 'Top Rated' },
];

export default function TelevisionView() {
  const [activeCategory, setActiveCategory] = useState('airing_today');
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useFetch(
    () => getTVShows(activeCategory, page),
    [activeCategory, page]
  );

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setPage(1);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <FaTv className="text-tmdb-green" /> TV Shows
      </h1>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleCategoryChange(cat.key)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              activeCategory === cat.key
                ? 'bg-tmdb-light text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}
      {data && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data.results.map((show) => (
              <TVShowCard key={show.id} show={show} />
            ))}
          </div>
          <Pagination
            currentPage={data.page}
            totalPages={data.total_pages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
