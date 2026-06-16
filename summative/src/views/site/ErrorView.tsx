import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

export default function ErrorView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <FaExclamationTriangle className="text-6xl text-yellow-500 mb-6" />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-400 text-lg mb-8 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/home"
        className="flex items-center gap-2 px-6 py-3 bg-tmdb-light text-white rounded-lg hover:bg-blue-600 transition font-semibold"
      >
        <FaHome /> Go Home
      </Link>
    </div>
  );
}
