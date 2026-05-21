import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../service/firebase";

type UserRole = "guest" | "user" | "admin";

const adminEmails = new Set(
  [import.meta.env.VITE_ADMIN_EMAIL, import.meta.env.VITE_ADMIN_EMAILS]
    .filter((email): email is string => Boolean(email))
    .flatMap((value) => value.split(","))
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);

const getUserRole = (email?: string | null): UserRole => {
  if (!email) {
    return "guest";
  }

  return adminEmails.has(email.trim().toLowerCase()) ? "admin" : "user";
};

interface AuthContextValue {
  user: User | null;
  role: UserRole;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("guest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setRole(getUserRole(currentUser?.email));
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const value = useMemo(
    () => ({ user, role, isAdmin: role === "admin", loading, signInWithGoogle, signOutUser }),
    [user, role, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};