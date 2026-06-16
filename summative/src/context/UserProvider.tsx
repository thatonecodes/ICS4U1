import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { UserContext } from "@/context/UserContext";
import type { UserItem, GenrePreferences, Purchase } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAuth } from "@/hooks/useAuth";
import { getUserData, saveGenrePreferences as saveGenrePreferencesToFirestore, addPurchase as addPurchaseToFirestore } from "@/services/firestore";

const FAVORITES_KEY = "a5_favorites";
const CART_KEY = "a5_cart";

const defaultPreferences: GenrePreferences = { movie: [], tv: [] };

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const { currentUser } = useAuth();

  const [favorites, setFavorites] = useLocalStorage<Map<number, UserItem>, [number, UserItem][]>(
    FAVORITES_KEY,
    new Map(),
    {
      deserialize: (entries) => new Map(entries),
      serialize: (map) => Array.from(map.entries()),
    }
  );
  const [cart, setCart] = useLocalStorage<Map<number, UserItem>, [number, UserItem][]>(
    CART_KEY,
    new Map(),
    {
      deserialize: (entries) => new Map(entries),
      serialize: (map) => Array.from(map.entries()),
    }
  );

  const [genrePreferences, setGenrePreferences] = useState<GenrePreferences>(defaultPreferences);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    if (!currentUser) {
      setGenrePreferences(defaultPreferences);
      setPurchases([]);
      return;
    }

    let cancelled = false;
    getUserData(currentUser.uid)
      .then((data) => {
        if (cancelled) return;
        if (data?.genrePreferences) {
          setGenrePreferences(data.genrePreferences);
        }
        if (data?.purchases) {
          setPurchases(data.purchases);
        }
      })
      .catch((err) => console.error("Failed to load user data:", err));

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const toggleFavorite = (item: UserItem) => {
    setFavorites((prev) => {
      const cloned = new Map(prev);
      if (cloned.has(item.id)) {
        cloned.delete(item.id);
      } else {
        cloned.set(item.id, item);
      }
      return cloned;
    });
    setCart((prev) => {
      const cloned = new Map(prev);
      if (cloned.has(item.id)) {
        cloned.delete(item.id);
      }
      return cloned;
    });
  };

  const toggleCart = (item: UserItem) => {
    setCart((prev) => {
      const cloned = new Map(prev);
      if (cloned.has(item.id)) {
        cloned.delete(item.id);
      } else {
        cloned.set(item.id, item);
      }
      return cloned;
    });
    setFavorites((prev) => {
      const cloned = new Map(prev);
      if (cloned.has(item.id)) {
        cloned.delete(item.id);
      }
      return cloned;
    });
  };

  const removeFavorite = (id: number) => {
    setFavorites((prev) => {
      const cloned = new Map(prev);
      cloned.delete(id);
      return cloned;
    });
  };

  const removeCart = (id: number) => {
    setCart((prev) => {
      const cloned = new Map(prev);
      cloned.delete(id);
      return cloned;
    });
  };

  const clearCart = useCallback(() => {
    setCart(new Map());
  }, [setCart]);

  const saveGenrePreferences = useCallback(
    async (preferencesToSave?: GenrePreferences) => {
      if (!currentUser) return;
      const preferences = preferencesToSave ?? genrePreferences;
      await saveGenrePreferencesToFirestore(currentUser.uid, preferences);
    },
    [currentUser, genrePreferences]
  );

  const addPurchase = useCallback(async (purchase: Purchase) => {
    if (!currentUser) return;
    await addPurchaseToFirestore(currentUser.uid, purchase);
    setPurchases((prev) => [...prev, purchase]);
  }, [currentUser]);

  return (
    <UserContext.Provider
      value={{
        favorites,
        cart,
        genrePreferences,
        purchases,
        setGenrePreferences,
        saveGenrePreferences,
        toggleFavorite,
        toggleCart,
        removeFavorite,
        removeCart,
        addPurchase,
        clearCart,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
