import { useParams, useLocation, Link } from 'react-router-dom';
import { FaVideo, FaArrowLeft } from 'react-icons/fa';
import { useFetch } from '../hooks/useTMDB';
import { getVideos } from '../services/tmdbApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function TrailersView() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const mediaType = location.pathname.startsWith('/tv') ? 'tv' : 'movie';
  const numericId = Number(id);

  const { data, loading, error, refetch } = useFetch(
    () => getVideos(mediaType, numericId),
    [numericId, mediaType]
  );

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const trailers = data?.filter((v) => v.site === 'YouTube' && v.type === 'Trailer') || [];
  const allVideos = data?.filter((v) => v.site === 'YouTube') || [];
  const videosToShow = trailers.length > 0 ? trailers : allVideos;

  return (
    <div>
      <Link
        to={`/${mediaType}/${numericId}`}
        className="inline-flex items-center gap-2 text-tmdb-light hover:underline mb-6"
      >
        <FaArrowLeft /> Back to Details
      </Link>
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <FaVideo className="text-tmdb-light" /> Trailers & Videos
      </h1>

      {videosToShow.length === 0 ? (
        <p className="text-gray-400 text-lg">No videos available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videosToShow.map((video) => (
            <div key={video.id} className="bg-gray-800 rounded-xl overflow-hidden">
              <div className="relative aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${video.key}`}
                  title={video.name}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{video.name}</h3>
                <p className="text-sm text-gray-400">{video.type} • {video.official ? 'Official' : 'Fan-made'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
