import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaCreditCard, FaFilm, FaTv } from 'react-icons/fa';
import { useUserContext } from '@/hooks';
import UserItemCard from '@/components/cards/UserItemCard';
import Dialog from '@/components/site/Dialog';
import { calculatePrice, formatPrice, CANADIAN_TAX_RATE } from '@/utils/price';
import type { Purchase, UserItem } from '@/types';

type FilterType = 'all' | 'movie' | 'tv';

const matchesFilter = (item: UserItem, filter: FilterType) => {
  if (filter === 'all') return true;
  if (filter === 'movie') return item.mediaType === 'movie';
  return item.mediaType === 'tv' || item.mediaType === 'season';
};

export default function CartView() {
  const { cart, removeCart, addPurchase, clearCart } = useUserContext();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const allItems = Array.from(cart.values());
  const items = allItems.filter((item) => matchesFilter(item, filter));

  const subtotal = allItems.reduce((sum, item) => sum + calculatePrice(item.date), 0);
  const tax = subtotal * CANADIAN_TAX_RATE;
  const total = subtotal + tax;

  const filters: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: `All (${allItems.length})`, icon: null },
    { key: 'movie', label: `Movies (${allItems.filter((i) => i.mediaType === 'movie').length})`, icon: <FaFilm /> },
    { key: 'tv', label: `TV (${allItems.filter((i) => i.mediaType === 'tv' || i.mediaType === 'season').length})`, icon: <FaTv /> },
  ];

  const handleConfirmPurchase = useCallback(async () => {
    setError('');
    setPurchasing(true);

    try {
      const purchase: Purchase = {
        id: `${Date.now()}`,
        items: allItems.map((item) => ({ ...item })),
        subtotal,
        tax,
        total,
        createdAt: Date.now(),
      };

      await addPurchase(purchase);
      clearCart();
      setShowDialog(false);
      navigate('/success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  }, [addPurchase, clearCart, allItems, navigate, subtotal, tax, total]);

  const groupedItems = {
    movie: allItems.filter((item) => item.mediaType === 'movie'),
    tv: allItems.filter((item) => item.mediaType === 'tv' || item.mediaType === 'season'),
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <FaShoppingCart className="text-tmdb-green" /> Cart
      </h1>

      {allItems.length > 0 && (
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
      )}

      {allItems.length === 0 ? (
        <p className="text-gray-400 text-lg">Your cart is empty.</p>
      ) : items.length === 0 ? (
        <p className="text-gray-400 text-lg">No {filter} items in your cart.</p>
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
              <span className="text-gray-400">{allItems.length} item(s)</span>
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
            <button
              onClick={() => setShowDialog(true)}
              className="mt-4 flex items-center gap-2 px-6 py-3 bg-tmdb-light text-white rounded-lg hover:bg-blue-600 transition font-medium"
            >
              <FaCreditCard /> Purchase
            </button>
          </div>
        </div>
      )}

      <Dialog
        isOpen={showDialog}
        title="Confirm Purchase"
        confirmText={purchasing ? 'Processing...' : 'Confirm Purchase'}
        cancelText="Cancel"
        onConfirm={handleConfirmPurchase}
        onCancel={() => setShowDialog(false)}
        confirmDisabled={purchasing}
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <p className="text-gray-300">
            Are you sure you want to purchase {allItems.length} item(s) for{' '}
            <span className="font-bold text-white">{formatPrice(total)}</span>?
          </p>

          {groupedItems.movie.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                <FaFilm /> Movies ({groupedItems.movie.length})
              </h4>
              <ul className="space-y-1 text-sm text-gray-300">
                {groupedItems.movie.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span className="truncate">{item.title}</span>
                    <span className="text-tmdb-green">{formatPrice(calculatePrice(item.date))}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {groupedItems.tv.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                <FaTv /> TV ({groupedItems.tv.length})
              </h4>
              <ul className="space-y-1 text-sm text-gray-300">
                {groupedItems.tv.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span className="truncate">{item.title}</span>
                    <span className="text-tmdb-green">{formatPrice(calculatePrice(item.date))}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm bg-red-500/20 p-2 rounded">
              {error}
            </p>
          )}
        </div>
      </Dialog>
    </div>
  );
}
