import { Link } from 'react-router-dom';
import { FaFilm, FaTv, FaFire, FaStar, FaArrowRight } from 'react-icons/fa';
import { useFetch } from '@/hooks/useTMDB';
import { getMovies, getTVShows, getTrending, getImageUrl } from '@/services/tmdbApi';
import MovieCard from '@/components/cards/MovieCard';
import TVShowCard from '@/components/cards/TVShowCard';
import Loading from '@/components/feedback/Loading';
import ErrorMessage from '@/components/feedback/ErrorMessage';

export default function HomeView() {
  const { data: movies, loading: moviesLoading, error: moviesError, refetch: refetchMovies } = useFetch(() => getMovies('now_playing'));
  const { data: tvShows, loading: tvLoading, error: tvError, refetch: refetchTV } = useFetch(() => getTVShows('airing_today'));
  const { data: trending, loading: trendingLoading, error: trendingError, refetch: refetchTrending } = useFetch(() => getTrending('all', 'week'));

  const featured = trending?.results[0];

  return (
    <div className="space-y-12">
      {featured && 'title' in featured && (
        <section className="relative rounded-2xl overflow-hidden h-[400px] md:h-[500px]">
          <img
            src={getImageUrl(featured.backdrop_path, 'original')}
            alt={'title' in featured ? featured.title : 'Featured'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-10 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">
              {'title' in featured ? featured.title : ''}
            </h1>
            <p className="text-gray-300 text-lg mb-4 line-clamp-3">{featured.overview}</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-yellow-400">
                <FaStar /> {featured.vote_average.toFixed(1)}
              </span>
              <Link
                to={`/movies/${featured.id}`}
                className="flex items-center gap-2 px-6 py-3 bg-tmdb-light rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                View Details <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaFilm className="text-tmdb-light" /> Now Playing
          </h2>
          <Link to="/movies" className="text-tmdb-light hover:underline flex items-center gap-1">
            View All <FaArrowRight />
          </Link>
        </div>
        {moviesLoading && <Loading />}
        {moviesError && <ErrorMessage message={moviesError} onRetry={refetchMovies} />}
        {movies && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.results.slice(0, 5).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaFire className="text-orange-500" /> Trending This Week
          </h2>
          <Link to="/trending" className="text-tmdb-light hover:underline flex items-center gap-1">
            View All <FaArrowRight />
          </Link>
        </div>
        {trendingLoading && <Loading />}
        {trendingError && <ErrorMessage message={trendingError} onRetry={refetchTrending} />}
        {trending && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {trending.results.slice(0, 5).map((item) =>
              'title' in item ? (
                <MovieCard key={item.id} movie={item} />
              ) : (
                <TVShowCard key={item.id} show={item} />
              )
            )}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaTv className="text-tmdb-green" /> TV Shows Airing Today
          </h2>
          <Link to="/tv" className="text-tmdb-light hover:underline flex items-center gap-1">
            View All <FaArrowRight />
          </Link>
        </div>
        {tvLoading && <Loading />}
        {tvError && <ErrorMessage message={tvError} onRetry={refetchTV} />}
        {tvShows && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tvShows.results.slice(0, 5).map((show) => (
              <TVShowCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
