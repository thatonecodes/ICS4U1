import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import type { TVShow } from '../types';
import { getImageUrl } from '../services/tmdbApi';

interface TVShowCardProps {
  show: TVShow;
}

export default function TVShowCard({ show }: TVShowCardProps) {
  return (
    <Link to={`/tv/${show.id}`} className="group block">
      <div className="relative rounded-lg overflow-hidden bg-gray-800 shadow-lg transition-transform duration-300 group-hover:scale-105">
        <img
          src={getImageUrl(show.poster_path)}
          alt={show.name}
          className="w-full aspect-[2/3] object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded flex items-center gap-1">
          <FaStar className="text-yellow-400 text-sm" />
          <span className="text-sm font-bold">{show.vote_average.toFixed(1)}</span>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-white truncate group-hover:text-tmdb-light transition">
            {show.name}
          </h3>
          <p className="text-sm text-gray-400">
            {show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'N/A'}
          </p>
        </div>
      </div>
    </Link>
  );
}
