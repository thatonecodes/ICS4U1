import { useState } from 'react';
import { FaHeart, FaFilm, FaTv } from 'react-icons/fa';
import { useUserContext } from '@/hooks';
import UserItemCard from '@/components/cards/UserItemCard';
import type { UserItem } from '@/types';

type FilterType = 'all' | 'movie' | 'tv';

const matchesFilter = (item: UserItem, filter: FilterType) => {
  if (filter === 'all') return true;
  if (filter === 'movie') return item.mediaType === 'movie';
  return item.mediaType === 'tv' || item.mediaType === 'season';
};

export default function FavoritesView() {
  const { favorites, removeFavorite } = useUserContext();
  const [filter, setFilter] = useState<FilterType>('all');

  const allItems = Array.from(favorites.values());
  const items = allItems.filter((item) => matchesFilter(item, filter));

  const filters: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: `All (${allItems.length})`, icon: null },
    { key: 'movie', label: `Movies (${allItems.filter((i) => i.mediaType === 'movie').length})`, icon: <FaFilm /> },
    { key: 'tv', label: `TV (${allItems.filter((i) => i.mediaType === 'tv' || i.mediaType === 'season').length})`, icon: <FaTv /> },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <FaHeart className="text-red-500" /> Favorites
      </h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition ${
              filter === key
                ? 'bg-tmdb-light text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="text-gray-400 text-lg">
          {allItems.length === 0 ? 'You have no favorites yet.' : `No ${filter === 'all' ? '' : filter} favorites found.`}
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <UserItemCard
              key={item.id}
              item={item}
              onRemove={removeFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
