import { FaArrowLeft, FaImages } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import { useFetch } from "../hooks/useTMDB";
import { getImageUrl, getPersonImages } from "../services/tmdbApi";
import type { PersonImage } from "../types";

export default function ImagesView() {
	const { id } = useParams<{ id: string }>();
	const numericId = Number(id);

	const { data, loading, error, refetch } = useFetch(
		() => getPersonImages(numericId),
		[numericId],
	);

	if (loading) return <Loading />;
	if (error) return <ErrorMessage message={error} onRetry={refetch} />;

	const images = data || [];

	return (
		<div>
			<Link
				to={`/person/${numericId}`}
				className="inline-flex items-center gap-2 text-tmdb-light hover:underline mb-6"
			>
				<FaArrowLeft /> Back to Profile
			</Link>
			<h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
				<FaImages className="text-tmdb-light" /> Images
			</h1>

			{images.length === 0 ? (
				<p className="text-gray-400 text-lg">No images available.</p>
			) : (
				<div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
					{images.map((image: PersonImage, index: number) => (
						<div key={index} className="break-inside-avoid">
							<img
								src={getImageUrl(image.file_path, "w500")}
								alt={`Profile ${index + 1}`}
								className="w-full rounded-lg hover:scale-[1.02] transition"
								loading="lazy"
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
