import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaList, FaArrowLeft, FaCalendar, FaFilm } from 'react-icons/fa';
import { BsCart2 as BsCart2Icon, BsCartFill as BsCartFillIcon } from 'react-icons/bs';
import { useFetch } from '@/hooks/useTMDB';
import { getSeasons, getImageUrl } from '@/services/tmdbApi';
import { useUserContext } from '@/hooks';
import Loading from '@/components/feedback/Loading';
import ErrorMessage from '@/components/feedback/ErrorMessage';
import type { Season } from '@/types';

export default function SeasonsView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numericId = Number(id);
  const { cart, toggleCart } = useUserContext();

  const { data, loading, error, refetch } = useFetch(() => getSeasons(numericId), [numericId]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!data) return <ErrorMessage message="No seasons found" />;

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-tmdb-light hover:underline mb-6"
      >
        <FaArrowLeft /> Back
      </button>
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <FaList className="text-tmdb-light" /> Seasons
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((season: Season) => {
          const inCart = cart.has(season.id);
          const userItem = {
            id: season.id,
            title: season.name,
            posterPath: season.poster_path,
            date: season.air_date,
            mediaType: 'season' as const,
            showId: numericId,
            seasonNumber: season.season_number,
          };

          return (
            <div key={season.id} className="group bg-gray-800 rounded-xl overflow-hidden hover:scale-[1.02] transition relative">
              <Link to={`/tv/${numericId}/seasons/${season.season_number}`}>
                <div className="flex">
                  <img
                    src={getImageUrl(season.poster_path)}
                    alt={season.name}
                    className="w-32 md:w-40 object-cover"
                    loading="lazy"
                  />
                  <div className="p-4 flex-1">
                    <h3 className="text-xl font-bold group-hover:text-tmdb-light transition">{season.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <FaFilm /> {season.episode_count} Episodes
                      </span>
                      {season.air_date && (
                        <span className="flex items-center gap-1">
                          <FaCalendar /> {new Date(season.air_date).getFullYear()}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mt-3 line-clamp-3">{season.overview || 'No overview available.'}</p>
                  </div>
                </div>
              </Link>
              <button
                onClick={() => toggleCart(userItem)}
                className="absolute top-2 right-2 rounded-full bg-black/60 p-2 backdrop-blur-sm hover:bg-black/80 transition"
                title={inCart ? 'Remove from cart' : 'Add to cart'}
              >
                {inCart ? <BsCartFillIcon className="text-tmdb-green" /> : <BsCart2Icon className="text-white" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
