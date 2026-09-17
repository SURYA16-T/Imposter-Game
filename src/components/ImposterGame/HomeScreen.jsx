import React from "react";
import s from "./HomeScreen.module.css";
import GameCharacter from "./GameCharacter";
import ParticleBackground from "./ParticleBackground";
import InstructionManual from "./InstructionManual";

/**
 * HomeScreen — Hub page after login
 * Shows animated characters, session stats, and quick-start buttons.
 */
export default function HomeScreen({
  user,
  scores,
  onStartGame,
  onLogout,
  onResetScores,
}) {
  const [showManual, setShowManual] = React.useState(false);
  const [showScoreReset, setShowScoreReset] = React.useState(false);

  const paradeColors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className={s.homeWrapper}>
      <ParticleBackground />
      <div className={s.bgGrid} />
      <div className={s.bgGlow} />
      <div className={s.bgGlow2} />

      <div className={s.contentLayer}>
        {/* Logo */}
        <div className={s.logo}>
          <h1>
            IMPOS<span>TER</span>
          </h1>
          <div className={s.subtitle}>Who is among us?</div>
        </div>

        {/* Character Parade */}
        <div className={s.characterParade}>
          <div className={s.paradeTrack}>
            {paradeColors.map((colorIdx) => (
              <GameCharacter
                key={colorIdx}
                colorIndex={colorIdx}
                size="small"
                pose="walking"
              />
            ))}
          </div>
        </div>

        {/* Welcome Card */}
        <div className={s.welcomeCard}>
          <div className={s.welcomeGreeting}>Welcome Back</div>
          <div className={s.welcomeName}>
            {user?.displayName || "Player"} 👋
          </div>

          {/* Stats Row */}
          <div className={s.statsRow}>
            <div className={s.statCard}>
              <div className={s.statValue} style={{ color: "#00ffd0" }}>
                {scores.crewWins}
              </div>
              <div className={s.statLabel}>Crew Wins</div>
            </div>
            <div className={s.statCard}>
              <div className={s.statValue} style={{ color: "#dc1e1e" }}>
                {scores.imposterWins}
              </div>
              <div className={s.statLabel}>Imposter Wins</div>
            </div>
            <div className={s.statCard}>
              <div className={s.statValue} style={{ color: "#fbbf24" }}>
                {scores.totalRounds}
              </div>
              <div className={s.statLabel}>Total Rounds</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={s.actionButtons}>
            <button className={s.primaryBtn} onClick={onStartGame}>
              🎮 Start New Game
            </button>

            <div className={s.secondaryBtnRow}>
              <button
                className={s.secondaryBtn}
                onClick={() => setShowManual(true)}
              >
                📖 How to Play
              </button>
              <button
                className={s.secondaryBtn}
                onClick={() => setShowScoreReset(true)}
              >
                🏆 Scores
              </button>
            </div>

            <button className={s.logoutBtn} onClick={onLogout}>
              🚪 Logout
            </button>
          </div>
        </div>

        <div className={s.versionBadge}>v1.0 — Offline Party Game</div>
      </div>

      {/* Instruction Manual Overlay */}
      {showManual && (
        <InstructionManual onClose={() => setShowManual(false)} />
      )}

      {/* Score Reset Confirmation */}
      {showScoreReset && (
        <div
          className={s.homeWrapper}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowScoreReset(false)}
        >
          <div
            style={{
              background: "rgba(20, 20, 30, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "20px",
              padding: "40px 32px",
              maxWidth: "380px",
              width: "90%",
              textAlign: "center",
              animation: "bounceIn 0.5s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏆</div>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "28px",
                letterSpacing: "3px",
                color: "#fff",
                marginBottom: "8px",
              }}
            >
              Score Board
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                margin: "20px 0",
                justifyContent: "center",
              }}
            >
              <div style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "32px", color: "#00ffd0" }}>{scores.crewWins}</div>
                <div style={{ fontSize: "10px", color: "#666", letterSpacing: "1px", textTransform: "uppercase" }}>Crew Wins</div>
              </div>
              <div style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "32px", color: "#dc1e1e" }}>{scores.imposterWins}</div>
                <div style={{ fontSize: "10px", color: "#666", letterSpacing: "1px", textTransform: "uppercase" }}>Imposter Wins</div>
              </div>
              <div style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "32px", color: "#fbbf24" }}>{scores.totalRounds}</div>
                <div style={{ fontSize: "10px", color: "#666", letterSpacing: "1px", textTransform: "uppercase" }}>Total Rounds</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                style={{
                  flex: 1, padding: "14px", border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "12px", background: "transparent", color: "#aaa",
                  fontFamily: "'Bebas Neue', sans-serif", fontSize: "18px",
                  letterSpacing: "2px", cursor: "pointer",
                }}
                onClick={() => setShowScoreReset(false)}
              >
                Close
              </button>
              <button
                style={{
                  flex: 1, padding: "14px", border: "none",
                  borderRadius: "12px", background: "linear-gradient(135deg, #dc1e1e, #ff4444)",
                  color: "#fff", fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "18px", letterSpacing: "2px", cursor: "pointer",
                }}
                onClick={() => {
                  onResetScores();
                  setShowScoreReset(false);
                }}
              >
                Reset Scores
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
