import { useState } from 'react';
import { FaFire } from 'react-icons/fa';
import { useFetch } from '../hooks/useTMDB';
import { getTrending } from '../services/tmdbApi';
import MovieCard from '../components/MovieCard';
import TVShowCard from '../components/TVShowCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';

export default function TrendingView() {
  const [mediaType, setMediaType] = useState<'movie' | 'tv' | 'all'>('all');
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('week');
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useFetch(
    () => getTrending(mediaType, timeWindow, page),
    [mediaType, timeWindow, page]
  );

  const handleMediaTypeChange = (type: 'movie' | 'tv' | 'all') => {
    setMediaType(type);
    setPage(1);
  };

  const handleTimeWindowChange = (time: 'day' | 'week') => {
    setTimeWindow(time);
    setPage(1);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <FaFire className="text-orange-500" /> Trending
      </h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex gap-2">
          {(['all', 'movie', 'tv'] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleMediaTypeChange(type)}
              className={`px-4 py-2 rounded-full font-medium capitalize transition ${
                mediaType === type
                  ? 'bg-tmdb-light text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {type === 'all' ? 'All' : type === 'movie' ? 'Movies' : 'TV Shows'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(['day', 'week'] as const).map((time) => (
            <button
              key={time}
              onClick={() => handleTimeWindowChange(time)}
              className={`px-4 py-2 rounded-full font-medium capitalize transition ${
                timeWindow === time
                  ? 'bg-tmdb-green text-gray-900'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}
      {data && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data.results.map((item) =>
              'title' in item ? (
                <MovieCard key={item.id} movie={item} />
              ) : (
                <TVShowCard key={item.id} show={item} />
              )
            )}
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