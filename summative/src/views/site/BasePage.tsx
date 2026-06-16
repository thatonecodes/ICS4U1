import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaFilm } from 'react-icons/fa';
import { useFetch } from '@/hooks/useTMDB';
import { getMovies, getImageUrl, getBackdropUrl } from '@/services/tmdbApi';
import Loading from '@/components/feedback/Loading';
import ErrorMessage from '@/components/feedback/ErrorMessage';

const VISITED_KEY = 'a5_visited';

export default function BasePage() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useFetch(() => getMovies('now_playing', 1), []);

  const handleEnter = () => {
    localStorage.setItem(VISITED_KEY, 'true');
    navigate('/home');
  };

  const showcase = data?.results.slice(0, 5) ?? [];
  const backdrop = showcase[0]?.backdrop_path;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        {backdrop ? (
          <img
            src={getBackdropUrl(backdrop, 'original')}
            alt="Backdrop"
            className="w-full h-full object-cover opacity-30"
          />
        ) : (
          <div className="w-full h-full bg-tmdb-dark" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40" />
      </div>

      <div className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 inline-flex items-center gap-3 text-5xl md:text-7xl font-bold text-tmdb-green">
          <FaFilm />
          <span>TMDB Explorer</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 max-w-4xl">
          Discover your next favorite movie or show
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl">
          Browse trending titles, build your watchlist, and keep track of everything you love — all in one place.
        </p>

        <button
          onClick={handleEnter}
          className="group flex items-center gap-3 px-8 py-4 bg-tmdb-light text-white text-lg font-semibold rounded-full hover:bg-blue-600 transition shadow-lg shadow-blue-500/25"
        >
          Enter <FaArrowRight className="group-hover:translate-x-1 transition" />
        </button>

        {loading && (
          <div className="mt-16">
            <Loading />
          </div>
        )}
        {error && (
          <div className="mt-16">
            <ErrorMessage message={error} onRetry={refetch} />
          </div>
        )}

        {!loading && !error && showcase.length > 0 && (
          <div className="mt-16 w-full max-w-6xl">
            <p className="text-sm uppercase tracking-wider text-gray-400 mb-4">Now in theaters</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {showcase.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition"
                >
                  <img
                    src={getImageUrl(movie.poster_path)}
                    alt={movie.title}
                    className="w-full aspect-[2/3] object-cover"
                    loading="lazy"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold truncate">{movie.title}</h3>
                    <p className="text-sm text-gray-400">
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
