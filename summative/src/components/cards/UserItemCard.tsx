import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import type { UserItem } from '@/types';
import { getImageUrl } from '@/services/tmdbApi';
import { calculatePrice, formatPrice } from '@/utils/price';

interface UserItemCardProps {
  item: UserItem;
  showPrice?: boolean;
  onRemove: (id: number) => void;
}

export default function UserItemCard({ item, showPrice, onRemove }: UserItemCardProps) {
  const linkTo =
    item.mediaType === 'season' && item.showId
      ? `/tv/${item.showId}/seasons`
      : item.mediaType === 'tv'
      ? `/tv/${item.id}`
      : `/movies/${item.id}`;

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden flex flex-col sm:flex-row gap-4 p-4 hover:bg-gray-750 transition">
      <Link to={linkTo} className="shrink-0">
        <img
          src={getImageUrl(item.posterPath, 'w200')}
          alt={item.title}
          className="w-24 md:w-32 aspect-[2/3] object-cover rounded-lg"
          loading="lazy"
        />
      </Link>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold">
                <Link to={linkTo} className="hover:text-tmdb-light transition">
                  {item.title}
                </Link>
              </h3>
              <p className="text-sm text-gray-400 capitalize">
                {item.mediaType === 'season' ? `Season ${item.seasonNumber}` : item.mediaType}
                {item.showName ? ` • ${item.showName}` : ''}
              </p>
              {item.date && (
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(item.date).getFullYear()}
                </p>
              )}
            </div>
            {showPrice && (
              <span className="text-lg font-bold text-tmdb-green">
                {formatPrice(calculatePrice(item.date))}
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-3">
          <button
            onClick={() => onRemove(item.id)}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition text-sm"
          >
            <FaTrash /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}
