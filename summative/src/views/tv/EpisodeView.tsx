import { useParams, Link } from 'react-router-dom';
import { FaTv, FaArrowLeft, FaStar, FaCalendar } from 'react-icons/fa';
import { useFetch } from '@/hooks/useTMDB';
import { getSeasonDetails, getImageUrl } from '@/services/tmdbApi';
import Loading from '@/components/feedback/Loading';
import ErrorMessage from '@/components/feedback/ErrorMessage';

export default function EpisodeView() {
  const { id, seasonNumber } = useParams<{ id: string; seasonNumber: string }>();
  const numericId = Number(id);
  const numericSeason = Number(seasonNumber);

  const { data, loading, error, refetch } = useFetch(
    () => getSeasonDetails(numericId, numericSeason),
    [numericId, numericSeason]
  );

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!data) return <ErrorMessage message="No episodes found" />;

  return (
    <div>
      <Link
        to={`/tv/${numericId}/seasons`}
        className="inline-flex items-center gap-2 text-tmdb-light hover:underline mb-6"
      >
        <FaArrowLeft /> Back to Seasons
      </Link>
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <FaTv className="text-tmdb-light" /> {data.name}
      </h1>
      <p className="text-gray-400 mb-8">{data.overview}</p>

      <div className="space-y-4">
        {data.episodes.map((episode) => (
          <div key={episode.id} className="bg-gray-800 rounded-xl overflow-hidden flex flex-col md:flex-row">
            <img
              src={getImageUrl(episode.still_path, 'w300')}
              alt={episode.name}
              className="w-full md:w-64 aspect-video object-cover"
              loading="lazy"
            />
            <div className="p-4 flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">
                    {episode.episode_number}. {episode.name}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                    {episode.air_date && (
                      <span className="flex items-center gap-1">
                        <FaCalendar /> {episode.air_date}
                      </span>
                    )}
                    {episode.runtime && <span>{episode.runtime} min</span>}
                  </div>
                </div>
                {episode.vote_average > 0 && (
                  <span className="flex items-center gap-1 text-yellow-400 bg-gray-900 px-3 py-1 rounded-full text-sm shrink-0">
                    <FaStar /> {episode.vote_average.toFixed(1)}
                  </span>
                )}
              </div>
              <p className="text-gray-300 mt-3 text-sm">{episode.overview || 'No overview available.'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
