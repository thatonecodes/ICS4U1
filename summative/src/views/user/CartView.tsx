import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaCreditCard } from 'react-icons/fa';
import { useUserContext } from '@/hooks';
import UserItemCard from '@/components/cards/UserItemCard';
import Dialog from '@/components/site/Dialog';
import { calculatePrice, formatPrice, CANADIAN_TAX_RATE } from '@/utils/price';
import type { Purchase } from '@/types';

export default function CartView() {
  const { cart, removeCart, addPurchase, clearCart } = useUserContext();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState('');

  const items = Array.from(cart.values());
  const subtotal = items.reduce((sum, item) => sum + calculatePrice(item.date), 0);
  const tax = subtotal * CANADIAN_TAX_RATE;
  const total = subtotal + tax;

  const handleConfirmPurchase = useCallback(async () => {
    setError('');
    setPurchasing(true);

    try {
      const purchase: Purchase = {
        id: `${Date.now()}`,
        items: items.map((item) => ({ ...item })),
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
  }, [addPurchase, clearCart, items, navigate, subtotal, tax, total]);

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
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to purchase {items.length} item(s) for{' '}
            <span className="font-bold text-white">{formatPrice(total)}</span>?
          </p>
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
