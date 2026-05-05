import { useParams, useLocation, Link } from 'react-router-dom';
import { FaUsers, FaArrowLeft } from 'react-icons/fa';
import { useFetch } from '../hooks/useTMDB';
import { getCredits, getImageUrl } from '../services/tmdbApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function CreditsView() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const mediaType = location.pathname.startsWith('/tv') ? 'tv' : 'movie';
  const numericId = Number(id);

  const { data, loading, error, refetch } = useFetch(
    () => getCredits(mediaType, numericId),
    [numericId, mediaType]
  );

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!data) return <ErrorMessage message="No credits found" />;

  return (
    <div>
      <Link
        to={`/${mediaType}/${numericId}`}
        className="inline-flex items-center gap-2 text-tmdb-light hover:underline mb-6"
      >
        <FaArrowLeft /> Back to Details
      </Link>
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <FaUsers className="text-tmdb-light" /> Cast & Crew
      </h1>

      <h2 className="text-2xl font-semibold mb-4">Cast ({data.cast.length})</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
        {data.cast.map((person) => (
          <Link to={`/person/${person.id}`} key={person.id} className="group">
            <div className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition">
              <img
                src={getImageUrl(person.profile_path)}
                alt={person.name}
                className="w-full aspect-[2/3] object-cover"
                loading="lazy"
              />
              <div className="p-3">
                <p className="font-semibold text-white group-hover:text-tmdb-light transition">{person.name}</p>
                <p className="text-sm text-gray-400">{person.character}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Crew ({data.crew.length})</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data.crew.slice(0, 24).map((person) => (
          <Link to={`/person/${person.id}`} key={`${person.id}-${person.job}`} className="group">
            <div className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition">
              <img
                src={getImageUrl(person.profile_path)}
                alt={person.name}
                className="w-full aspect-[2/3] object-cover"
                loading="lazy"
              />
              <div className="p-3">
                <p className="font-semibold text-white group-hover:text-tmdb-light transition">{person.name}</p>
                <p className="text-sm text-gray-400">{person.job}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
