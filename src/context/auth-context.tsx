"use client";
import { useTheme } from "next-themes";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, ApiError, getToken, setToken } from "@/lib/api";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar: string | null;
  banner: string | null;
  bio: string;
  isPremium: boolean;
  favorites: string[];
  favoritesCount: number;
  uploadsCount?: number;
}

interface SignupPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type AuthModalView =
  | "login"
  | "signin"
  | "signup"
  | "full-signin"
  | "forgot"
  | "premium";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (payload: SignupPayload) => Promise<AuthUser>;
  loginWithGoogle: (credential: string) => Promise<AuthUser>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
  ) => Promise<void>;
  updateProfile: (payload: {
    firstName?: string;
    lastName?: string;
    name?: string;
    bio?: string;
    avatar?: string;
    banner?: string;
  }) => Promise<AuthUser>;
  logout: () => void;
  refreshMe: () => Promise<void>;
  setUser: (u: AuthUser | null) => void;
  // Favorites
  isFavorited: (wallpaperId: string) => boolean;
  toggleFavorite: (
    wallpaperId: string,
  ) => Promise<{ isFavorite: boolean; favoritesCount: number } | null>;
  authModal: { open: boolean; view: AuthModalView };
  openAuthModal: (view?: AuthModalView) => void;
  closeAuthModal: () => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLight: boolean;
  mounted: boolean;
  setTheme: (theme: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthSuccess = { token: string; user: AuthUser };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModal, setAuthModal] = useState<{
    open: boolean;
    view: AuthModalView;
  }>({
    open: false,
    view: "signin",
  });
  const { resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === "light";
  // Hydrate the session from a stored token on first load.
  useEffect(() => {
    let active = true;
    (async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.get<{
          user: AuthUser;
          favoritesCount: number;
          uploadsCount: number;
        }>("/me");
        if (active)
          setUser({
            ...data.user,
            favoritesCount: data.favoritesCount,
            uploadsCount: data.uploadsCount,
          });
      } catch {
        // Token invalid/expired → drop it.
        setToken(null);
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const persistSession = useCallback((data: AuthSuccess) => {
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await api.post<AuthSuccess>("/auth/login", {
        email,
        password,
      });
      return persistSession(data);
    },
    [persistSession],
  );

  const signup = useCallback(
    async (payload: SignupPayload) => {
      const data = await api.post<AuthSuccess>("/auth/signup", payload);
      return persistSession(data);
    },
    [persistSession],
  );

  const loginWithGoogle = useCallback(
    async (credential: string) => {
      const data = await api.post<AuthSuccess>("/auth/google", { credential });
      return persistSession(data);
    },
    [persistSession],
  );

  const changePassword = useCallback(
    async (
      currentPassword: string,
      newPassword: string,
      confirmNewPassword: string,
    ) => {
      const data = await api.post<{ token: string }>("/auth/change-password", {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      setToken(data.token); // keep this session alive with the fresh token
    },
    [],
  );

  const updateProfile = useCallback(
    async (payload: {
      firstName?: string;
      lastName?: string;
      name?: string;
      bio?: string;
      avatar?: string;
      banner?: string;
    }) => {
      const data = await api.patch<{ user: AuthUser }>("/me", payload);
      setUser((u) =>
        u
          ? {
              ...data.user,
              uploadsCount: u.uploadsCount,
              favoritesCount: u.favoritesCount,
            }
          : data.user,
      );
      return data.user;
    },
    [],
  );

  const refreshMe = useCallback(async () => {
    if (!getToken()) return;
    const data = await api.get<{
      user: AuthUser;
      favoritesCount: number;
      uploadsCount: number;
    }>("/me");
    setUser({
      ...data.user,
      favoritesCount: data.favoritesCount,
      uploadsCount: data.uploadsCount,
    });
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const openAuthModal = useCallback((view: AuthModalView = "signin") => {
    setAuthModal({ open: true, view });
  }, []);
  const closeAuthModal = useCallback(
    () => setAuthModal((m) => ({ ...m, open: false })),
    [],
  );

  const isFavorited = useCallback(
    (wallpaperId: string) => !!user?.favorites?.includes(wallpaperId),
    [user],
  );

  // Add/remove a favorite. Optimistically updates the user's favorites; opens
  // the auth modal for guests. Returns the server's {isFavorite, favoritesCount}.
  const toggleFavorite = useCallback(
    async (wallpaperId: string) => {
      if (!user) {
        openAuthModal("signin");
        return null;
      }
      const currentlyFav = user.favorites.includes(wallpaperId);
      // optimistic
      setUser((u) =>
        u
          ? {
              ...u,
              favorites: currentlyFav
                ? u.favorites.filter((f) => f !== wallpaperId)
                : [...u.favorites, wallpaperId],
            }
          : u,
      );
      try {
        const data = currentlyFav
          ? await api.delete<{
              favorites: string[];
              favoritesCount: number;
              isFavorite: boolean;
            }>(`/me/favorites/${wallpaperId}`)
          : await api.post<{
              favorites: string[];
              favoritesCount: number;
              isFavorite: boolean;
            }>(`/me/favorites/${wallpaperId}`);
        setUser((u) => (u ? { ...u, favorites: data.favorites } : u));
        return {
          isFavorite: data.isFavorite,
          favoritesCount: data.favoritesCount,
        };
      } catch (err) {
        // revert
        setUser((u) =>
          u
            ? {
                ...u,
                favorites: currentlyFav
                  ? [...u.favorites, wallpaperId]
                  : u.favorites.filter((f) => f !== wallpaperId),
              }
            : u,
        );
        if (err instanceof ApiError && err.statusCode === 401)
          openAuthModal("signin");
        throw err;
      }
    },
    [user, openAuthModal],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      signup,
      loginWithGoogle,
      changePassword,
      updateProfile,
      logout,
      refreshMe,
      setUser,
      isFavorited,
      toggleFavorite,
      authModal,
      openAuthModal,
      closeAuthModal,
      open,
      setOpen,
      isLight,
      mounted,
      setTheme,
    }),
    [
      user,
      loading,
      login,
      open,
      signup,
      loginWithGoogle,
      changePassword,
      updateProfile,
      logout,
      refreshMe,
      isFavorited,
      toggleFavorite,
      authModal,
      openAuthModal,
      closeAuthModal,
      isLight,
      mounted,
      setTheme,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
