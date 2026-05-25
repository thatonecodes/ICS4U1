import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getImageUrl } from "../services/tmdbApi";
import type { Movie } from "../types";

interface MovieCardProps {
	movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
	return (
		<Link to={`/movies/${movie.id}`} className="group block">
			<div className="relative rounded-lg overflow-hidden bg-gray-800 shadow-lg transition-transform duration-300 group-hover:scale-105">
				<img
					src={getImageUrl(movie.poster_path)}
					alt={movie.title}
					className="w-full aspect-[2/3] object-cover"
					loading="lazy"
				/>
				<div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded flex items-center gap-1">
					<FaStar className="text-yellow-400 text-sm" />
					<span className="text-sm font-bold">
						{movie.vote_average.toFixed(1)}
					</span>
				</div>
				<div className="p-3">
					<h3 className="font-semibold text-white truncate group-hover:text-tmdb-light transition">
						{movie.title}
					</h3>
					<p className="text-sm text-gray-400">
						{movie.release_date
							? new Date(movie.release_date).getFullYear()
							: "N/A"}
					</p>
				</div>
			</div>
		</Link>
	);
}
