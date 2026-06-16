import { createContext } from "react";
import type { UserItem, GenrePreferences, Purchase } from "@/types";

export type UserContextType = {
  favorites: Map<number, UserItem>;
  cart: Map<number, UserItem>;
  genrePreferences: GenrePreferences;
  purchases: Purchase[];
  setGenrePreferences: (prefs: GenrePreferences) => void;
  saveGenrePreferences: (prefs?: GenrePreferences) => Promise<void>;
  toggleFavorite: (item: UserItem) => void;
  toggleCart: (item: UserItem) => void;
  removeFavorite: (id: number) => void;
  removeCart: (id: number) => void;
  addPurchase: (purchase: Purchase) => Promise<void>;
  clearCart: () => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);
