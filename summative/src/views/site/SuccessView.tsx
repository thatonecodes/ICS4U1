import { Link } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaReceipt } from 'react-icons/fa';

export default function SuccessView() {
  return (
    <div className="max-w-lg mx-auto py-16 text-center">
      <div className="mb-6 flex justify-center">
        <FaCheckCircle className="text-6xl text-tmdb-green" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Purchase Successful!</h1>
      <p className="text-gray-400 mb-8">
        Thank you for your order. Your purchase has been saved and you can view it in your settings.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition font-medium"
        >
          <FaHome /> Home
        </Link>
        <Link
          to="/settings"
          className="flex items-center gap-2 px-5 py-2.5 bg-tmdb-light rounded-lg hover:bg-blue-600 transition font-medium text-white"
        >
          <FaReceipt /> View Purchases
        </Link>
      </div>
    </div>
  );
}
