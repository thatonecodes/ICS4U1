import { FaSpinner } from "react-icons/fa";

export default function Loading() {
	return (
		<div className="flex items-center justify-center min-h-[50vh]">
			<FaSpinner className="animate-spin text-4xl text-tmdb-light" />
		</div>
	);
}
