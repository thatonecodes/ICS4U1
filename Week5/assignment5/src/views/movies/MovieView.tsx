import { useParams, useLocation, Link } from 'react-router-dom';
import { FaStar, FaCalendar, FaClock, FaGlobe, FaLink, FaList, FaVideo, FaUsers, FaComment, FaHeart, FaRegHeart } from 'react-icons/fa';
import { BsCart2, BsCartFill } from 'react-icons/bs';
import { useFetch } from '@/hooks/useTMDB';
import { getMovieDetails, getTVDetails, getImageUrl, getBackdropUrl } from '@/services/tmdbApi';
import { useUserContext } from '@/hooks';
import Loading from '@/components/feedback/Loading';
import ErrorMessage from '@/components/feedback/ErrorMessage';

export default function MovieView() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const mediaType = location.pathname.startsWith('/tv') ? 'tv' : 'movie';
  const mediaPath = location.pathname.startsWith('/tv') ? 'tv' : 'movies';
  const numericId = Number(id);
  const { favorites, cart, toggleFavorite, toggleCart } = useUserContext();

  const { data, loading, error, refetch } = useFetch(
    () => (mediaType === 'movie' ? getMovieDetails(numericId) : getTVDetails(numericId)),
    [numericId, mediaType]
  );

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!data) return <ErrorMessage message="No data found" />;

  const title = data.title || data.name || 'Unknown';
  const releaseDate = data.release_date || data.first_air_date;
  const runtime = data.runtime || data.episode_run_time?.[0];
  const isFav = favorites.has(data.id);
  const inCart = cart.has(data.id);

  const userItem = {
    id: data.id,
    title,
    posterPath: data.poster_path,
    date: releaseDate || '',
    mediaType: mediaType as 'movie' | 'tv',
  };

  return (
    <div className="space-y-8">
      <div className="relative rounded-2xl overflow-hidden">
        <div className="h-[300px] md:h-[400px]">
          <img
            src={getBackdropUrl(data.backdrop_path)}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
      </div>

      <div className="flex flex-col md:flex-row gap-8 -mt-32 relative z-10 px-4">
        <img
          src={getImageUrl(data.poster_path)}
          alt={title}
          className="w-full md:w-80 rounded-xl shadow-2xl self-start"
        />
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl md:text-5xl font-bold">{title}</h1>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => toggleFavorite(userItem)}
                className="rounded-full bg-gray-800 p-3 hover:bg-gray-700 transition"
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFav ? <FaHeart className="text-red-500 text-xl" /> : <FaRegHeart className="text-white text-xl" />}
              </button>
              {mediaType === 'movie' && (
                <button
                  onClick={() => toggleCart(userItem)}
                  className="rounded-full bg-gray-800 p-3 hover:bg-gray-700 transition"
                  title={inCart ? 'Remove from cart' : 'Add to cart'}
                >
                  {inCart ? <BsCartFill className="text-tmdb-green text-xl" /> : <BsCart2 className="text-white text-xl" />}
                </button>
              )}
            </div>
          </div>
          {data.tagline && <p className="text-xl text-gray-400 italic">{data.tagline}</p>}

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-yellow-400">
              <FaStar /> {data.vote_average.toFixed(1)} ({data.vote_count} votes)
            </span>
            {releaseDate && (
              <span className="flex items-center gap-1 text-gray-300">
                <FaCalendar /> {new Date(releaseDate).getFullYear()}
              </span>
            )}
            {runtime && (
              <span className="flex items-center gap-1 text-gray-300">
                <FaClock /> {runtime} min
              </span>
            )}
            <span className="flex items-center gap-1 text-gray-300">
              <FaGlobe /> {data.original_language.toUpperCase()}
            </span>
            <span className="px-2 py-1 bg-gray-800 rounded text-gray-300">{data.status}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.genres.map((genre) => (
              <Link
                key={genre.id}
                to={`/genre/${mediaType}/${genre.id}`}
                className="px-3 py-1 bg-gray-800 rounded-full text-sm hover:bg-tmdb-light transition"
              >
                {genre.name}
              </Link>
            ))}
          </div>

          <p className="text-gray-300 leading-relaxed text-lg">{data.overview}</p>

          {data.homepage && (
            <a
              href={data.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-tmdb-light hover:underline"
            >
              <FaLink /> Official Website
            </a>
          )}

          {mediaType === 'tv' && data.number_of_seasons && (
            <div className="bg-gray-800 rounded-lg p-4 inline-block">
              <p className="text-gray-300">
                <span className="font-semibold text-white">{data.number_of_seasons}</span> Seasons
              </p>
              <p className="text-gray-300">
                <span className="font-semibold text-white">{data.number_of_episodes}</span> Episodes
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-4">
            <Link
              to={`/${mediaPath}/${numericId}/credits`}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-tmdb-light transition"
            >
              <FaUsers /> Cast & Crew
            </Link>
            <Link
              to={`/${mediaPath}/${numericId}/trailers`}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-tmdb-light transition"
            >
              <FaVideo /> Trailers
            </Link>
            <Link
              to={`/${mediaPath}/${numericId}/reviews`}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-tmdb-light transition"
            >
              <FaComment /> Reviews
            </Link>
            {mediaType === 'tv' && (
              <Link
                to={`/tv/${numericId}/seasons`}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-tmdb-light transition"
              >
                <FaList /> Seasons
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
