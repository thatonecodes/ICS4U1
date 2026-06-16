import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { FaThLarge } from 'react-icons/fa';
import { useFetch } from '@/hooks/useTMDB';
import { useUserContext } from '@/hooks';
import { discoverByGenre } from '@/services/tmdbApi';
import MovieCard from '@/components/cards/MovieCard';
import TVShowCard from '@/components/cards/TVShowCard';
import Loading from '@/components/feedback/Loading';
import ErrorMessage from '@/components/feedback/ErrorMessage';
import Pagination from '@/components/controls/Pagination';
import type { TVShow } from '@/types';

const movieGenres = [
  { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' }, { id: 80, name: 'Crime' }, { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' }, { id: 10751, name: 'Family' }, { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' }, { id: 27, name: 'Horror' }, { id: 9648, name: 'Mystery' }, { id: 878, name: 'Sci-Fi' },
];

const tvGenres = [
  { id: 10759, name: 'Action' }, { id: 16, name: 'Animation' }, { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' }, { id: 99, name: 'Documentary' }, { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' }, { id: 10762, name: 'Kids' }, { id: 9648, name: 'Mystery' }, { id: 10765, name: 'Sci-Fi' },
];

export default function GenreView() {
  const { mediaType = 'movie' } = useParams<{ mediaType: 'movie' | 'tv' }>();
  const activeMedia = mediaType;
  const [searchParams, setSearchParams] = useSearchParams();
  const { genrePreferences } = useUserContext();

  const selectedGenres = useMemo(() => {
    const raw = searchParams.get('genres');
    if (raw) {
      return raw
        .split(',')
        .map((id) => Number(id))
        .filter((id) => !isNaN(id));
    }
    return genrePreferences[activeMedia] ?? [];
  }, [searchParams, activeMedia, genrePreferences]);

  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [mediaType, searchParams]);

  const { data, loading, error, refetch } = useFetch(
    () => discoverByGenre(activeMedia, selectedGenres.length > 0 ? selectedGenres : [28], page),
    [activeMedia, selectedGenres.join(','), page]
  );

  const genres = activeMedia === 'movie' ? movieGenres : tvGenres;

  const toggleGenre = (id: number) => {
    const updated = selectedGenres.includes(id)
      ? selectedGenres.filter((g) => g !== id)
      : [...selectedGenres, id];

    if (updated.length === 0) {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ genres: updated.join(',') }, { replace: true });
    }
  };

  const selectedGenreNames = genres
    .filter((g) => selectedGenres.includes(g.id))
    .map((g) => g.name);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <FaThLarge className="text-tmdb-light" /> Genres
      </h1>

      <div className="flex gap-2 mb-6">
        <Link
          to="/genre/movie"
          className={`px-4 py-2 rounded-full font-medium transition ${
            activeMedia === 'movie'
              ? 'bg-tmdb-light text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Movies
        </Link>
        <Link
          to="/genre/tv"
          className={`px-4 py-2 rounded-full font-medium transition ${
            activeMedia === 'tv'
              ? 'bg-tmdb-light text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          TV Shows
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => toggleGenre(genre.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              selectedGenres.includes(genre.id)
                ? 'bg-tmdb-green text-gray-900'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">
        {selectedGenreNames.length > 0
          ? selectedGenreNames.join(', ')
          : 'All'} {activeMedia === 'movie' ? 'Movies' : 'TV Shows'}
      </h2>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}
      {data && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data.results.map((item) =>
              activeMedia === 'movie' && 'title' in item ? (
                <MovieCard key={item.id} movie={item} />
              ) : (
                <TVShowCard key={item.id} show={item as TVShow} />
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
