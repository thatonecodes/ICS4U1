import { FaExclamationTriangle } from "react-icons/fa";

interface ErrorMessageProps {
	message: string;
	onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
			<FaExclamationTriangle className="text-4xl text-red-500" />
			<p className="text-lg text-gray-300">{message}</p>
			{onRetry && (
				<button
					onClick={onRetry}
					className="px-4 py-2 bg-tmdb-light text-white rounded hover:bg-blue-600 transition"
				>
					Retry
				</button>
			)}
		</div>
	);
}
