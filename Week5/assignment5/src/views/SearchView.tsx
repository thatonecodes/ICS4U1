import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaSearch, FaFilm, FaTv, FaUser } from 'react-icons/fa';
import { searchMulti, searchMovies, searchTV, searchPeople } from '../services/tmdbApi';
import { getImageUrl } from '../services/tmdbApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';
import type { Movie, TVShow, Person } from '../types';

export default function SearchView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const type = (searchParams.get('type') as 'multi' | 'movie' | 'tv' | 'person') || 'multi';
  const [results, setResults] = useState<(Movie | TVShow | Person)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const prevQueryRef = useRef(query);
  const prevTypeRef = useRef(type);

  const typeLabels = {
    multi: 'All',
    movie: 'Movies',
    tv: 'TV Shows',
    person: 'People',
  };

  useEffect(() => {
    if (!query) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    if (prevQueryRef.current !== query || prevTypeRef.current !== type) {
      setPage(1);
      prevQueryRef.current = query;
      prevTypeRef.current = type;
      return;
    }

    setLoading(true);
    setError(null);

    let searchFn;
    switch (type) {
      case 'movie':
        searchFn = searchMovies;
        break;
      case 'tv':
        searchFn = searchTV;
        break;
      case 'person':
        searchFn = searchPeople;
        break;
      default:
        searchFn = searchMulti;
    }

    searchFn(query, page)
      .then((data) => {
        const filtered = type === 'multi'
          ? data.results.filter((item: Movie | TVShow | Person) => 'media_type' in item && item.media_type !== 'collection')
          : data.results;
        setResults(filtered);
        setTotalPages(data.total_pages);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Search failed');
        setLoading(false);
      });
  }, [query, type, page]);

  const handleTypeChange = (newType: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('type', newType);
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <FaSearch className="text-tmdb-light" /> Search Results
      </h1>
      {query && <p className="text-gray-400 mb-4">Results for &quot;{query}&quot;</p>}

      <div className="flex gap-2 mb-6">
        {(['multi', 'movie', 'tv', 'person'] as const).map((t) => (
          <button
            key={t}
            onClick={() => handleTypeChange(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              type === t
                ? 'bg-tmdb-light text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {typeLabels[t]}
          </button>
        ))}
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && results.length === 0 && query && (
        <p className="text-gray-400 text-lg">No results found for &quot;{query}&quot;.</p>
      )}

      {!query && (
        <div className="text-center py-20">
          <FaSearch className="text-6xl text-gray-700 mx-auto mb-4" />
          <p className="text-xl text-gray-400">Start typing to search movies, TV shows, and people.</p>
        </div>
      )}

      <div className="space-y-4">
        {results.map((item) => {
          if ('title' in item || (type === 'movie' && 'release_date' in item)) {
            const m = item as Movie;
            return (
              <Link
                to={`/movies/${m.id}`}
                key={`movie-${m.id}`}
                className="flex gap-4 bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition group"
              >
                <img
                  src={getImageUrl(m.poster_path, 'w200')}
                  alt={m.title}
                  className="w-24 md:w-32 aspect-[2/3] object-cover"
                  loading="lazy"
                />
                <div className="p-4 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FaFilm className="text-tmdb-light" />
                    <h3 className="text-lg font-bold group-hover:text-tmdb-light transition">{m.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">
                    {m.release_date ? new Date(m.release_date).getFullYear() : 'N/A'}
                  </p>
                  <p className="text-gray-300 text-sm line-clamp-2">{m.overview}</p>
                </div>
              </Link>
            );
          }
          if ('name' in item && 'first_air_date' in item) {
            const s = item as TVShow;
            return (
              <Link
                to={`/tv/${s.id}`}
                key={`tv-${s.id}`}
                className="flex gap-4 bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition group"
              >
                <img
                  src={getImageUrl(s.poster_path, 'w200')}
                  alt={s.name}
                  className="w-24 md:w-32 aspect-[2/3] object-cover"
                  loading="lazy"
                />
                <div className="p-4 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FaTv className="text-tmdb-green" />
                    <h3 className="text-lg font-bold group-hover:text-tmdb-light transition">{s.name}</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">
                    {s.first_air_date ? new Date(s.first_air_date).getFullYear() : 'N/A'}
                  </p>
                  <p className="text-gray-300 text-sm line-clamp-2">{s.overview}</p>
                </div>
              </Link>
            );
          }
          const p = item as Person;
          return (
            <Link
              to={`/person/${p.id}`}
              key={`person-${p.id}`}
              className="flex gap-4 bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition group"
            >
              <img
                src={getImageUrl(p.profile_path, 'w200')}
                alt={p.name}
                className="w-24 md:w-32 aspect-[2/3] object-cover"
                loading="lazy"
              />
              <div className="p-4 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FaUser className="text-gray-400" />
                  <h3 className="text-lg font-bold group-hover:text-tmdb-light transition">{p.name}</h3>
                </div>
                <p className="text-sm text-gray-400">{p.known_for_department}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {results.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
