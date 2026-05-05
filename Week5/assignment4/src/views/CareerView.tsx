import { useParams, Link } from 'react-router-dom';
import { FaBriefcase, FaArrowLeft, FaStar } from 'react-icons/fa';
import { useFetch } from '../hooks/useTMDB';
import { getPersonCredits, getImageUrl } from '../services/tmdbApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function CareerView() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);

  const { data, loading, error, refetch } = useFetch(() => getPersonCredits(numericId), [numericId]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!data) return <ErrorMessage message="No career data found" />;

  const allRoles = [...(data.cast || []), ...(data.crew || [])].sort(
    (a, b) => new Date(b.release_date || b.first_air_date || '0').getTime() - new Date(a.release_date || a.first_air_date || '0').getTime()
  );

  return (
    <div>
      <Link
        to={`/person/${numericId}`}
        className="inline-flex items-center gap-2 text-tmdb-light hover:underline mb-6"
      >
        <FaArrowLeft /> Back to Profile
      </Link>
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <FaBriefcase className="text-tmdb-light" /> Career
      </h1>

      <div className="space-y-4">
        {allRoles.map((role, index) => (
          <Link
            to={`/${role.media_type === 'movie' ? 'movies' : 'tv'}/${role.id}`}
            key={`${role.id}-${index}`}
            className="flex gap-4 bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition group"
          >
            <img
              src={getImageUrl(role.poster_path, 'w200')}
              alt={role.title || role.name}
              className="w-24 md:w-32 aspect-[2/3] object-cover"
              loading="lazy"
            />
            <div className="p-4 flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold group-hover:text-tmdb-light transition">
                    {role.title || role.name}
                  </h3>
                  <p className="text-sm text-gray-400 capitalize">{role.media_type}</p>
                </div>
                {role.vote_average > 0 && (
                  <span className="flex items-center gap-1 text-yellow-400 text-sm shrink-0">
                    <FaStar /> {role.vote_average.toFixed(1)}
                  </span>
                )}
              </div>
              <p className="text-gray-300 mt-2">
                <span className="text-tmdb-light">{role.character || role.job}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {role.release_date || role.first_air_date
                  ? new Date(role.release_date || role.first_air_date!).getFullYear()
                  : 'TBA'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
