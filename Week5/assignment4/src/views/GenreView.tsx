import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaThLarge } from 'react-icons/fa';
import { useFetch } from '../hooks/useTMDB';
import { discoverByGenre } from '../services/tmdbApi';
import MovieCard from '../components/MovieCard';
import TVShowCard from '../components/TVShowCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const movieGenres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 9648, name: 'Mystery' },
  { id: 878, name: 'Sci-Fi' },
];

const tvGenres = [
  { id: 10759, name: 'Action' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 10762, name: 'Kids' },
  { id: 9648, name: 'Mystery' },
  { id: 10765, name: 'Sci-Fi' },
];

export default function GenreView() {
  const { mediaType = 'movie', genreId = '28' } = useParams<{ mediaType: 'movie' | 'tv'; genreId: string }>();
  const [activeMedia, setActiveMedia] = useState<'movie' | 'tv'>(mediaType);
  const [activeGenre, setActiveGenre] = useState(Number(genreId));

  useEffect(() => {
    setActiveMedia(mediaType);
    setActiveGenre(Number(genreId));
  }, [mediaType, genreId]);

  const { data, loading, error, refetch } = useFetch(
    () => discoverByGenre(activeMedia, activeGenre),
    [activeMedia, activeGenre]
  );

  const genres = activeMedia === 'movie' ? movieGenres : tvGenres;
  const currentGenre = genres.find((g) => g.id === activeGenre);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <FaThLarge className="text-tmdb-light" /> Genres
      </h1>

      <div className="flex gap-2 mb-6">
        <Link
          to="/genre/movie/28"
          onClick={() => setActiveMedia('movie')}
          className={`px-4 py-2 rounded-full font-medium transition ${
            activeMedia === 'movie'
              ? 'bg-tmdb-light text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Movies
        </Link>
        <Link
          to="/genre/tv/10759"
          onClick={() => setActiveMedia('tv')}
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
          <Link
            key={genre.id}
            to={`/genre/${activeMedia}/${genre.id}`}
            onClick={() => setActiveGenre(genre.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              activeGenre === genre.id
                ? 'bg-tmdb-green text-gray-900'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {genre.name}
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">
        {currentGenre?.name} {activeMedia === 'movie' ? 'Movies' : 'TV Shows'}
      </h2>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data.results.map((item) =>
            activeMedia === 'movie' && 'title' in item ? (
              <MovieCard key={item.id} movie={item} />
            ) : (
              <TVShowCard key={item.id} show={item as any} />
            )
          )}
        </div>
      )}
    </div>
  );
}
