import { createContext, useContext, useMemo, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../utils";

const AuthContext = createContext(null);

const usersList = [
  { "id": "u1", "username": "user1", "password": "password", "name": "User 1" },
  { "id": "u2", "username": "user2", "password": "password", "name": "User 2" }
]

export function AuthProvider({ children }) {
    const [storedAuth, setStoredAuth] = useLocalStorage(STORAGE_KEYS.auth, null);
    const [loading, setLoading] = useState(false);

    const login = async ({ username, password }) => {
        setLoading(true);
        try {
            const match = usersList.find((u) => u.username === username && u.password === password);
            if (!match) return { ok: false, message: "Invalid username/password" };
            setStoredAuth({ id: match.id, username: match.username, name: match.name });
            return { ok: true };
        } catch (e) {
            return { ok: false, message: e.message || "Login failed" };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setStoredAuth(null);
    };

    const value = useMemo(() => ({
        user: storedAuth,
        isAuthed: Boolean(storedAuth?.id),
        loading,
        login,
        logout,
    }), [storedAuth, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
