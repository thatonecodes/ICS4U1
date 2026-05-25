import { Link } from "react-router-dom";
import { getImageUrl } from "../services/tmdbApi";
import type { Person } from "../types";

interface PersonCardProps {
	person: Person;
}

export default function PersonCard({ person }: PersonCardProps) {
	return (
		<Link to={`/person/${person.id}`} className="group block">
			<div className="relative rounded-lg overflow-hidden bg-gray-800 shadow-lg transition-transform duration-300 group-hover:scale-105">
				<img
					src={getImageUrl(person.profile_path)}
					alt={person.name}
					className="w-full aspect-[2/3] object-cover"
					loading="lazy"
				/>
				<div className="p-3">
					<h3 className="font-semibold text-white truncate group-hover:text-tmdb-light transition">
						{person.name}
					</h3>
					<p className="text-sm text-gray-400">{person.known_for_department}</p>
				</div>
			</div>
		</Link>
	);
}
