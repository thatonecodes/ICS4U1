import { FaShoppingCart } from 'react-icons/fa';
import { useUserContext } from '@/hooks';
import UserItemCard from '@/components/cards/UserItemCard';
import { calculatePrice, formatPrice, CANADIAN_TAX_RATE } from '@/utils/price';

export default function CartView() {
  const { cart, removeCart } = useUserContext();
  const items = Array.from(cart.values());
  const subtotal = items.reduce((sum, item) => sum + calculatePrice(item.date), 0);
  const tax = subtotal * CANADIAN_TAX_RATE;
  const total = subtotal + tax;

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
          <div className="flex flex-col items-end gap-2 pt-4 border-t border-gray-700">
            <div className="flex justify-end items-center gap-4 w-full">
              <span className="text-gray-400">{items.length} item(s)</span>
            </div>
            <div className="flex justify-end items-center gap-4 w-full">
              <span className="text-gray-400">Subtotal:</span>
              <span className="text-xl font-bold text-white">
                {formatPrice(subtotal)}
              </span>
            </div>
            <div className="flex justify-end items-center gap-4 w-full">
              <span className="text-gray-400">Tax ({(CANADIAN_TAX_RATE * 100).toFixed(0)}%):</span>
              <span className="text-xl font-bold text-white">
                {formatPrice(tax)}
              </span>
            </div>
            <div className="flex justify-end items-center gap-4 w-full">
              <span className="text-2xl font-bold text-tmdb-green">
                Total:
              </span>
              <span className="text-2xl font-bold text-tmdb-green">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
