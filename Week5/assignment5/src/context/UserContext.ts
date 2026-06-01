import { createContext } from "react";
import type { UserItem, GenrePreferences } from "../types";

export type UserContextType = {
  userName: string;
  favorites: Map<number, UserItem>;
  cart: Map<number, UserItem>;
  genrePreferences: GenrePreferences;
  setUserName: (userName: string) => void;
  setGenrePreferences: (prefs: GenrePreferences) => void;
  toggleFavorite: (item: UserItem) => void;
  toggleCart: (item: UserItem) => void;
  removeFavorite: (id: number) => void;
  removeCart: (id: number) => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);
