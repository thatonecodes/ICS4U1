import { FaShoppingCart } from 'react-icons/fa';
import { useUserContext } from '@/hooks';
import UserItemCard from '@/components/cards/UserItemCard';
import { calculatePrice, formatPrice } from '@/utils/price';

export default function CartView() {
  const { cart, removeCart } = useUserContext();
  const items = Array.from(cart.values());
  const total = items.reduce((sum, item) => sum + calculatePrice(item.date), 0);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <FaShoppingCart className="text-tmdb-green" /> Cart
      </h1>

      {items.length === 0 ? (
        <p className="text-gray-400 text-lg">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <UserItemCard
              key={item.id}
              item={item}
              showPrice
              onRemove={removeCart}
            />
          ))}
          <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-700">
            <span className="text-gray-400">{items.length} item(s)</span>
            <span className="text-2xl font-bold text-tmdb-green">
              Total: {formatPrice(total)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
