import { useParams, Link } from 'react-router-dom';
import { FaList, FaArrowLeft, FaCalendar, FaFilm } from 'react-icons/fa';
import { useFetch } from '../hooks/useTMDB';
import { getSeasons, getImageUrl } from '../services/tmdbApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import type { Season } from '../types';

export default function SeasonsView() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);

  const { data, loading, error, refetch } = useFetch(() => getSeasons(numericId), [numericId]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!data) return <ErrorMessage message="No seasons found" />;

  return (
    <div>
      <Link
        to={`/tv/${numericId}`}
        className="inline-flex items-center gap-2 text-tmdb-light hover:underline mb-6"
      >
        <FaArrowLeft /> Back to Show
      </Link>
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <FaList className="text-tmdb-light" /> Seasons
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((season: Season) => (
          <Link
            to={`/tv/${numericId}/seasons/${season.season_number}`}
            key={season.id}
            className="group bg-gray-800 rounded-xl overflow-hidden hover:scale-[1.02] transition"
          >
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
        ))}
      </div>
    </div>
  );
}