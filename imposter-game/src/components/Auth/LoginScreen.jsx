// LoginScreen.jsx — Offline Name Entry (No Server Required)
import React, { useState, useRef } from "react";
import { useAuth } from "./useAuth";
import ParticleBackground from "../ImposterGame/ParticleBackground";
import s from "./LoginScreen.module.css";

export default function LoginScreen() {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [entering, setEntering] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name to play");
      return;
    }
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    setEntering(true);
    // Brief animation delay for the entry effect
    setTimeout(() => {
      const result = login(trimmed);
      if (!result.success) {
        setError(result.error || "Something went wrong");
        setEntering(false);
      }
    }, 600);
  };

  return (
    <div className={s.loginWrapper}>
      <ParticleBackground />
      <div className={s.loginBgGrid} />
      <div className={s.loginBgGlow} />
      <div className={s.loginBgGlow2} />

      <div className={`${s.loginContainer} ${entering ? s.loginEntering : ""}`}>
        {/* Logo */}
        <div className={s.loginLogo}>
          <h1>
            IMPOS<span>TER</span>
          </h1>
          <div className={s.loginSubtitle}>
            <span className={s.typewriterText}>Who is among us?</span>
          </div>
        </div>

        {/* Login Card */}
        <div className={s.loginCard}>
          <div className={s.loginTitle}>Welcome, Player</div>
          <div className={s.loginDesc}>
            Enter your name to start playing — no account needed!
          </div>

          {/* Offline Badge */}
          <div className={s.offlineBadge}>
            <span className={s.offlineDot} />
            Works 100% Offline — No Server Required
          </div>

          {/* Error Banner */}
          {error && <div className={s.errorMessage}>{error}</div>}

          {/* Form */}
          <form className={s.form} onSubmit={handleSubmit}>
            <div className={s.inputGroup}>
              <span className={s.inputIcon}>🎮</span>
              <input
                ref={inputRef}
                className={s.input}
                type="text"
                placeholder="Your display name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                autoFocus
                maxLength={20}
              />
            </div>

            <button
              type="submit"
              className={`${s.submitBtn} ${entering ? s.submitBtnLoading : ""}`}
              disabled={entering}
            >
              {entering ? (
                <span className={s.btnSpinner} />
              ) : (
                "🚀 Start Playing"
              )}
            </button>
          </form>

          {/* Feature list */}
          <div className={s.featureList}>
            <div className={s.featureItem}>🎭 Find the imposter among your friends</div>
            <div className={s.featureItem}>📱 Works on mobile & desktop</div>
            <div className={s.featureItem}>🌐 17+ categories with 400+ words</div>
            <div className={s.featureItem}>⚡ No download or signup needed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
