import { FaHeart } from 'react-icons/fa';
import { useUserContext } from '@/hooks';
import UserItemCard from '@/components/cards/UserItemCard';

export default function FavoritesView() {
  const { favorites, removeFavorite } = useUserContext();
  const items = Array.from(favorites.values());

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <FaHeart className="text-red-500" /> Favorites
      </h1>

      {items.length === 0 ? (
        <p className="text-gray-400 text-lg">You have no favorites yet.</p>
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
