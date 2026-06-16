import type { ReactNode } from "react";
import { UserContext } from "@/context/UserContext";
import type { UserItem, GenrePreferences } from "@/types";
import { useLocalStorage } from "@/hooks";

const USERNAME_KEY = "a5_username";
const FAVORITES_KEY = "a5_favorites";
const CART_KEY = "a5_cart";
const GENRES_KEY = "a5_genres";

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userName, setUserName] = useLocalStorage<string, string>(USERNAME_KEY, "User");
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
  const [genrePreferences, setGenrePreferences] = useLocalStorage<GenrePreferences, GenrePreferences>(
    GENRES_KEY,
    { movie: [], tv: [] }
  );

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
    // Mutual exclusivity: remove from cart if present
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
    // Mutual exclusivity: remove from favorites if present
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

  return (
    <UserContext.Provider
      value={{
        userName,
        favorites,
        cart,
        genrePreferences,
        setUserName,
        setGenrePreferences,
        toggleFavorite,
        toggleCart,
        removeFavorite,
        removeCart,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
