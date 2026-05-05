import { useState } from 'react';
import { FaFilm } from 'react-icons/fa';
import { useFetch } from '../hooks/useTMDB';
import { getMovies } from '../services/tmdbApi';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const categories = [
  { key: 'now_playing', label: 'Now Playing' },
  { key: 'popular', label: 'Popular' },
  { key: 'top_rated', label: 'Top Rated' },
  { key: 'upcoming', label: 'Upcoming' },
];

export default function MoviesView() {
  const [activeCategory, setActiveCategory] = useState('now_playing');
  const { data, loading, error, refetch } = useFetch(() => getMovies(activeCategory), [activeCategory]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <FaFilm className="text-tmdb-light" /> Movies
      </h1>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
