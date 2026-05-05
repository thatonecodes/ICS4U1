import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaSearch, FaFilm, FaTv, FaUser } from 'react-icons/fa';
import { searchMulti } from '../services/tmdbApi';
import { getImageUrl } from '../services/tmdbApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import type { Movie, TVShow, Person } from '../types';

export default function SearchView() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<(Movie | TVShow | Person)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    searchMulti(query)
      .then((data) => {
        setResults(data.results.filter((item) => item.media_type !== 'collection'));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Search failed');
        setLoading(false);
      });
  }, [query]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <FaSearch className="text-tmdb-light" /> Search Results
      </h1>

      {query && <p className="text-gray-400 mb-6">Results for &quot;{query}&quot;</p>}

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && results.length === 0 && query && (
        <p className="text-gray-400 text-lg">No results found for &quot;{query}&quot;.</p>
      )}

      {!query && (
        <div className="text-center py-20">
          <FaSearch className="text-6xl text-gray-700 mx-auto mb-4" />
          <p className="text-xl text-gray-400">Enter a search term to find movies, TV shows, and people.</p>
        </div>
      )}

      <div className="space-y-4">
        {results.map((item) => {
          if (item.media_type === 'movie') {
            const movie = item as Movie;
            return (
              <Link
                to={`/movies/${movie.id}`}
                key={movie.id}
                className="flex gap-4 bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition group"
              >
                <img
                  src={getImageUrl(movie.poster_path, 'w200')}
                  alt={movie.title}
                  className="w-24 md:w-32 aspect-[2/3] object-cover"
                  loading="lazy"
                />
                <div className="p-4 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FaFilm className="text-tmdb-light" />
                    <h3 className="text-lg font-bold group-hover:text-tmdb-light transition">{movie.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">
                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                  </p>
                  <p className="text-gray-300 text-sm line-clamp-2">{movie.overview}</p>
                </div>
              </Link>
            );
          }
          if (item.media_type === 'tv') {
            const show = item as TVShow;
            return (
              <Link
                to={`/tv/${show.id}`}
                key={show.id}
                className="flex gap-4 bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition group"
              >
                <img
                  src={getImageUrl(show.poster_path, 'w200')}
                  alt={show.name}
                  className="w-24 md:w-32 aspect-[2/3] object-cover"
                  loading="lazy"
                />
                <div className="p-4 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FaTv className="text-tmdb-green" />
                    <h3 className="text-lg font-bold group-hover:text-tmdb-light transition">{show.name}</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">
                    {show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'N/A'}
                  </p>
                  <p className="text-gray-300 text-sm line-clamp-2">{show.overview}</p>
                </div>
              </Link>
            );
          }
          const person = item as Person;
          return (
            <Link
              to={`/person/${person.id}`}
              key={person.id}
              className="flex gap-4 bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition group"
            >
              <img
                src={getImageUrl(person.profile_path, 'w200')}
                alt={person.name}
                className="w-24 md:w-32 aspect-[2/3] object-cover"
                loading="lazy"
              />
              <div className="p-4 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FaUser className="text-gray-400" />
                  <h3 className="text-lg font-bold group-hover:text-tmdb-light transition">{person.name}</h3>
                </div>
                <p className="text-sm text-gray-400">{person.known_for_department}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
