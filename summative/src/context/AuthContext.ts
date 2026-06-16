import { createContext } from 'react';
import type { User, UserCredential } from 'firebase/auth';

export type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
