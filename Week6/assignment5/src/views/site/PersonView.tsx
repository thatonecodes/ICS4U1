import {
	FaBirthdayCake,
	FaBriefcase,
	FaFilm,
	FaImages,
	FaMapMarkerAlt,
	FaStar,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import MovieCard from "../components/MovieCard";
import TVShowCard from "../components/TVShowCard";
import { useFetch } from "../hooks/useTMDB";
import {
	getImageUrl,
	getPersonCredits,
	getPersonDetails,
} from "../services/tmdbApi";

export default function PersonView() {
	const { id } = useParams<{ id: string }>();
	const numericId = Number(id);

	const {
		data: person,
		loading: personLoading,
		error: personError,
		refetch: refetchPerson,
	} = useFetch(() => getPersonDetails(numericId), [numericId]);
	const {
		data: credits,
		loading: creditsLoading,
		error: creditsError,
		refetch: refetchCredits,
	} = useFetch(() => getPersonCredits(numericId), [numericId]);

	if (personLoading || creditsLoading) return <Loading />;
	if (personError)
		return <ErrorMessage message={personError} onRetry={refetchPerson} />;
	if (creditsError)
		return <ErrorMessage message={creditsError} onRetry={refetchCredits} />;
	if (!person) return <ErrorMessage message="Person not found" />;

	const knownFor = credits?.cast?.slice(0, 8) || [];

	return (
		<div className="space-y-8">
			<div className="flex flex-col md:flex-row gap-8">
				<img
					src={getImageUrl(person.profile_path)}
					alt={person.name}
					className="w-full md:w-80 rounded-xl shadow-2xl self-start"
				/>
				<div className="flex-1 space-y-4">
					<h1 className="text-3xl md:text-5xl font-bold">{person.name}</h1>
					<p className="text-gray-400 text-lg">{person.known_for_department}</p>

					<div className="flex flex-wrap gap-4 text-sm text-gray-300">
						{person.birthday && (
							<span className="flex items-center gap-1">
								<FaBirthdayCake /> Born: {person.birthday}
							</span>
						)}
						{person.deathday && (
							<span className="flex items-center gap-1">
								Died: {person.deathday}
							</span>
						)}
						{person.place_of_birth && (
							<span className="flex items-center gap-1">
								<FaMapMarkerAlt /> {person.place_of_birth}
							</span>
						)}
						<span className="flex items-center gap-1">
							<FaStar /> Popularity: {person.popularity.toFixed(1)}
						</span>
					</div>

					{person.also_known_as.length > 0 && (
						<div>
							<p className="text-sm text-gray-400 mb-1">Also known as:</p>
							<p className="text-sm text-gray-300">
								{person.also_known_as.join(", ")}
							</p>
						</div>
					)}

					<p className="text-gray-300 leading-relaxed">
						{person.biography || "No biography available."}
					</p>

					<div className="flex flex-wrap gap-3 pt-4">
						<Link
							to={`/person/${numericId}/career`}
							className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-tmdb-light transition"
						>
							<FaBriefcase /> Full Career
						</Link>
						<Link
							to={`/person/${numericId}/images`}
							className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-tmdb-light transition"
						>
							<FaImages /> Images
						</Link>
					</div>
				</div>
			</div>

			{knownFor.length > 0 && (
				<section>
					<h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
						<FaFilm className="text-tmdb-light" /> Known For
					</h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{knownFor.map((item) =>
							item.media_type === "movie" ? (
								<MovieCard key={item.id} movie={item as any} />
							) : (
								<TVShowCard key={item.id} show={item as any} />
							),
						)}
					</div>
				</section>
			)}
		</div>
	);
}
