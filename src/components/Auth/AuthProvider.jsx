// AuthProvider.jsx — Fully Offline localStorage-based Player Identity
import React, { useState, useCallback } from "react";
import { AuthContext } from "./AuthContext";

const STORAGE_KEY = "imposter_player";
const SCORES_KEY = "imposter_scores";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.displayName) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("Failed to load saved player:", err);
    }
    return null;
  });
  const [isLoading] = useState(false);

  // Login — just set the display name, store in localStorage
  const login = useCallback((displayName) => {
    const trimmed = (displayName || "").trim();
    if (!trimmed) return { success: false, error: "Please enter a name" };

    const player = {
      displayName: trimmed,
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
    } catch {
      // localStorage might be full or disabled — still allow playing
    }

    setUser(player);
    return { success: true, user: player };
  }, []);

  // Logout — clear localStorage and reset user
  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore errors
    }
    setUser(null);
  }, []);

  // Score management (persisted across sessions)
  const getScores = useCallback(() => {
    try {
      const stored = localStorage.getItem(SCORES_KEY);
      return stored ? JSON.parse(stored) : { crewWins: 0, imposterWins: 0, totalRounds: 0 };
    } catch {
      return { crewWins: 0, imposterWins: 0, totalRounds: 0 };
    }
  }, []);

  const updateScores = useCallback((crewWon) => {
    try {
      const current = JSON.parse(localStorage.getItem(SCORES_KEY) || "{}");
      const updated = {
        crewWins: (current.crewWins || 0) + (crewWon ? 1 : 0),
        imposterWins: (current.imposterWins || 0) + (crewWon ? 0 : 1),
        totalRounds: (current.totalRounds || 0) + 1,
      };
      localStorage.setItem(SCORES_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return { crewWins: 0, imposterWins: 0, totalRounds: 0 };
    }
  }, []);

  const resetScores = useCallback(() => {
    try {
      localStorage.removeItem(SCORES_KEY);
    } catch {
      // Ignore
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    getScores,
    updateScores,
    resetScores,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
