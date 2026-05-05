import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FaComment, FaArrowLeft, FaStar, FaUser } from 'react-icons/fa';
import { useFetch } from '../hooks/useTMDB';
import { getReviews } from '../services/tmdbApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function ReviewsView() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const mediaType = location.pathname.startsWith('/tv') ? 'tv' : 'movie';
  const numericId = Number(id);
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useFetch(
    () => getReviews(mediaType, numericId),
    [numericId, mediaType]
  );

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const reviews = data?.results || [];

  return (
    <div>
      <button
		onClick={() => {navigate(-1)}}
        className="inline-flex items-center gap-2 text-tmdb-light hover:underline mb-6"
      >
        <FaArrowLeft /> Back
      </button>
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <FaComment className="text-tmdb-light" /> Reviews
      </h1>

      {reviews.length === 0 ? (
        <p className="text-gray-400 text-lg">No reviews yet.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                    <FaUser className="text-gray-400" />
                  </div>
                  <div>
                    <p className="font-semibold">{review.author}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {review.author_details.rating && (
                  <span className="flex items-center gap-1 text-yellow-400 bg-gray-900 px-3 py-1 rounded-full">
                    <FaStar /> {review.author_details.rating}/10
                  </span>
                )}
              </div>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{review.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
