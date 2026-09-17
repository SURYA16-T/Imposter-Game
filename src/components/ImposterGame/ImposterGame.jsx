import React, { useState, useCallback, useRef, useEffect } from "react";
import { GENRES, assignRoles, generateHint, cryptoRandom } from "./constants";
import s from "./ImposterGame.module.css";
import InstructionManual from "./InstructionManual";
import Confetti from "./Confetti";
import ParticleBackground from "./ParticleBackground";
import GameCharacter from "./GameCharacter";
import HomeScreen from "./HomeScreen";
import { useAuth } from "../Auth/useAuth";

// Timer presets
const TIMER_OPTIONS = [
  { label: "60s", value: 60 },
  { label: "90s", value: 90 },
  { label: "120s", value: 120 },
  { label: "∞", value: 0 },
];

export default function ImposterGame() {
  const { user, logout, getScores, updateScores, resetScores } = useAuth();

  // ─── State ──────────────────────────────────────────────
  const [phase, setPhase] = useState("home");
  // phases: home | setup | passDevice | cardReveal | allReady | discussion | voting | result
  const [playerCount, setPlayerCount] = useState(4);
  const [playerNames, setPlayerNames] = useState(Array(4).fill(""));
  const [selectedGenres, setSelectedGenres] = useState(["🎮 Video Games"]);
  const [gameData, setGameData] = useState(null);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [customTopic, setCustomTopic] = useState("");
  const [customWords, setCustomWords] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [suspect, setSuspect] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [startingPlayerIndex, setStartingPlayerIndex] = useState(null);
  const [transitioning, setTransitioning] = useState(false);

  // Enhanced animation state
  const [phaseAnimClass, setPhaseAnimClass] = useState(s.phaseEnter);
  const [countKey, setCountKey] = useState(0);
  const [genreRippleKey, setGenreRippleKey] = useState(null);
  const [rerolling, setRerolling] = useState(false);
  const [showDrumRoll, setShowDrumRoll] = useState(false);
  const [lockAnimKey, setLockAnimKey] = useState(0);
  const [resultReady, setResultReady] = useState(false);

  // Logout modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const fileInputRef = useRef(null);

  // ─── NEW: Discussion Timer ──────────────────────────────
  const [timerDuration, setTimerDuration] = useState(90); // seconds, 0 = unlimited
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);

  // ─── NEW: Score & Round Tracking ────────────────────────
  const [roundNumber, setRoundNumber] = useState(1);
  const [sessionScores, setSessionScores] = useState({ crewWins: 0, imposterWins: 0, totalRounds: 0 });
  const [showScoreBoard, setShowScoreBoard] = useState(false);

  // ─── Result hint reveal toggle ──────────────────────────
  const [showHintReveal, setShowHintReveal] = useState(false);

  // ─── Track previous imposter ────────────────────────────
  const previousImposterRef = useRef(null);

  // Load scores on mount
  useEffect(() => {
    setSessionScores(getScores());
  }, [getScores]);

  // ─── Timer Effect ──────────────────────────────────────
  useEffect(() => {
    if (timerActive && timerRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, timerRemaining]);

  // ─── Animated phase transitions ─────────────────────────
  const changePhase = useCallback((newPhase) => {
    setPhaseAnimClass(s.phaseExit);
    setTimeout(() => {
      setPhase(newPhase);
      setPhaseAnimClass(s.phaseEnter);
    }, 300);
  }, []);

  // ─── Setup handlers ────────────────────────────────────
  const updateCount = (delta) => {
    const newCount = Math.min(10, Math.max(3, playerCount + delta));
    setPlayerCount(newCount);
    setCountKey((k) => k + 1);
    setPlayerNames((prev) => {
      const next = [...prev];
      while (next.length < newCount) next.push("");
      return next.slice(0, newCount);
    });
  };

  const updateName = (i, val) => {
    const next = [...playerNames];
    next[i] = val;
    setPlayerNames(next);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setCustomWords(event.target.result);
    reader.readAsText(file);
  };

  // ─── Genre Multi-Selection Handlers ───────────────────────
  const handleGenreToggle = (genre) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre);
      } else {
        return [...prev, genre];
      }
    });
    setGenreRippleKey(genre);
    setTimeout(() => setGenreRippleKey(null), 600);
  };

  const handleSelectAllGenres = () => {
    setSelectedGenres(Object.keys(GENRES));
  };

  const handleSelectRandomGenres = (count = 4) => {
    const all = Object.keys(GENRES);
    const shuffled = [...all].sort(() => 0.5 - Math.random());
    setSelectedGenres(shuffled.slice(0, Math.min(count, all.length)));
  };

  const handleClearGenres = () => {
    setSelectedGenres([]);
  };

  // ─── Can start? ────────────────────────────────────────
  const hasValidCustom =
    !selectedGenres.includes("✨ Custom") ||
    (customTopic.trim() &&
      customWords
        .split(/[,\s]+/)
        .map((w) => w.trim())
        .filter((w) => w.length > 0).length >= 3);

  const canStart =
    playerNames.slice(0, playerCount).every((n) => n.trim()) &&
    selectedGenres.length > 0 &&
    hasValidCustom;

  // ─── Start game ────────────────────────────────────────
  const startGame = useCallback(() => {
    const players = playerNames.slice(0, playerCount).map((n) => n.trim());
    const prevImposter = previousImposterRef.current;

    let roles;
    if (selectedGenres.length === 1 && selectedGenres[0] === "✨ Custom") {
      const words = customWords
        .split(/[,\s]+/)
        .map((w) => w.trim())
        .filter((w) => w.length > 0);
      roles = assignRoles(players, customTopic, words, prevImposter);
    } else {
      const normalGenres = selectedGenres.filter((g) => g !== "✨ Custom");
      roles = assignRoles(players, normalGenres.length > 0 ? normalGenres : selectedGenres, null, prevImposter);
    }
    
    previousImposterRef.current = roles.imposterIndex;

    let hint = null;
    if (showHint) {
      hint = generateHint(roles.wordObj, roles.genre);
    }

    setGameData({ ...roles, players, hint });
    setCurrentRevealIndex(0);
    setCardFlipped(false);
    setSuspect(null);
    setShowConfetti(false);
    setStartingPlayerIndex(null);
    setTransitioning(false);
    setResultReady(false);
    setTimerActive(false);
    setTimerRemaining(0);
    setShowHintReveal(false);
    changePhase("passDevice");
  }, [playerNames, playerCount, selectedGenres, customTopic, customWords, showHint, changePhase]);

  // ─── Card reveal handlers ──────────────────────────────
  const handleRevealCard = () => {
    setCardFlipped(true);
  };

  const handleGotIt = () => {
    setCardFlipped(false);
    setTransitioning(true);

    setTimeout(() => {
      if (currentRevealIndex < gameData.players.length - 1) {
        setCurrentRevealIndex(currentRevealIndex + 1);
        changePhase("passDevice");
      } else {
        let randomIndex = 0;
        if (gameData.players.length > 1) {
          do {
            randomIndex = cryptoRandom(gameData.players.length);
          } while (randomIndex === gameData.imposterIndex);
        }
        setStartingPlayerIndex(randomIndex);
        changePhase("allReady");
      }
      setTransitioning(false);
    }, 600);
  };

  const handleReadyForCard = () => {
    changePhase("cardReveal");
  };

  // ─── Start Discussion (with timer) ─────────────────────
  const handleStartDiscussion = () => {
    if (timerDuration > 0) {
      setTimerRemaining(timerDuration);
      setTimerActive(true);
    } else {
      setTimerRemaining(0);
      setTimerActive(false);
    }
    changePhase("discussion");
  };

  // ─── Voting ─────────────────────────────────────────────
  const handleVote = () => {
    if (suspect === null) return;
    setLockAnimKey((k) => k + 1);
    // Stop timer if still running
    setTimerActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    // Drum roll suspense
    setShowDrumRoll(true);
    setTimeout(() => {
      setShowDrumRoll(false);
      setShowConfetti(true);
      setResultReady(true);

      // Update scores
      const crewWon = suspect === gameData.imposterIndex;
      const updated = updateScores(crewWon);
      setSessionScores(updated);

      changePhase("result");
    }, 1500);
  };

  // ─── Re-roll with animation ─────────────────────────────
  const handleReroll = () => {
    setRerolling(true);
    setTimeout(() => {
      const newIndex = Math.floor(Math.random() * gameData.players.length);
      setStartingPlayerIndex(newIndex);
      setRerolling(false);
    }, 600);
  };

  // ─── Go Home ────────────────────────────────────────────
  const goHome = () => {
    changePhase("home");
    setTimeout(() => {
      setGameData(null);
      setCurrentRevealIndex(0);
      setCardFlipped(false);
      setSuspect(null);
      setShowConfetti(false);
      setStartingPlayerIndex(null);
      setTransitioning(false);
      setResultReady(false);
      setTimerActive(false);
      setTimerRemaining(0);
      setShowHintReveal(false);
    }, 300);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // ─── Reset (New Game from setup) ───────────────────────
  const resetGame = () => {
    changePhase("setup");
    setTimeout(() => {
      setGameData(null);
      setCurrentRevealIndex(0);
      setCardFlipped(false);
      setSuspect(null);
      setShowConfetti(false);
      setStartingPlayerIndex(null);
      setTransitioning(false);
      setResultReady(false);
      setTimerActive(false);
      setTimerRemaining(0);
      setShowHintReveal(false);
    }, 300);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // ─── Quick Restart (Same Players — Next Round) ─────────
  const quickRestart = () => {
    setRoundNumber((r) => r + 1);
    setPhaseAnimClass(s.phaseExit);
    if (timerRef.current) clearInterval(timerRef.current);
    
    setTimeout(() => {
      setGameData(null);
      setCurrentRevealIndex(0);
      setCardFlipped(false);
      setSuspect(null);
      setShowConfetti(false);
      setStartingPlayerIndex(null);
      setTransitioning(false);
      setResultReady(false);
      setTimerActive(false);
      setTimerRemaining(0);
      setShowHintReveal(false);
      startGame();
    }, 300);
  };

  // ─── Full Reset (New Players) ──────────────────────────
  const fullReset = () => {
    setRoundNumber(1);
    previousImposterRef.current = null;
    resetGame();
  };

  // ─── Logout ─────────────────────────────────────────────
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  // ─── Reset scores ───────────────────────────────────────
  const handleResetScores = () => {
    resetScores();
    setSessionScores({ crewWins: 0, imposterWins: 0, totalRounds: 0 });
  };

  // ─── Get current player info ───────────────────────────
  const currentPlayerName = gameData ? gameData.players[currentRevealIndex] : "";
  const nextPlayerName = gameData && currentRevealIndex < gameData.players.length - 1
    ? gameData.players[currentRevealIndex + 1]
    : null;
  const isImposter = gameData && currentRevealIndex === gameData.imposterIndex;

  // Progress for ring
  const progressOffset = gameData
    ? 283 - (283 * (currentRevealIndex + 1)) / gameData.players.length
    : 283;

  // Timer formatting
  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Letter-by-letter for result word
  const renderLetterByLetter = (word) => {
    return word.split("").map((ch, i) => (
      <span key={i} style={{ animationDelay: `${i * 80 + 300}ms` }}>
        {ch}
      </span>
    ));
  };

  // ═══════════════════════════════════════════════════════════
  // HOME SCREEN
  // ═══════════════════════════════════════════════════════════
  if (phase === "home") {
    return (
      <HomeScreen
        user={user}
        scores={sessionScores}
        onStartGame={() => changePhase("setup")}
        onLogout={handleLogout}
        onResetScores={handleResetScores}
      />
    );
  }

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <div className={s.app}>
      <ParticleBackground />
      <div className={s.bgGrid} />
      <div className={s.bgGlow} />

      {/* Drum Roll Overlay */}
      {showDrumRoll && (
        <div className={s.drumRollOverlay}>
          <div className={s.drumRollText}>🥁 THE VERDICT...</div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className={s.logoutOverlay} onClick={() => setShowLogoutModal(false)}>
          <div className={s.logoutModal} onClick={(e) => e.stopPropagation()}>
            <div className={s.logoutEmoji}>👋</div>
            <div className={s.logoutTitle}>Leaving so soon?</div>
            <div className={s.logoutSubtext}>
              Your scores will be saved for when you come back.
            </div>
            <div className={s.logoutActions}>
              <button className={s.logoutConfirmBtn} onClick={confirmLogout}>
                Logout
              </button>
              <button className={s.logoutCancelBtn} onClick={() => setShowLogoutModal(false)}>
                Stay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Score Board Overlay */}
      {showScoreBoard && (
        <div className={s.logoutOverlay} onClick={() => setShowScoreBoard(false)}>
          <div className={s.logoutModal} onClick={(e) => e.stopPropagation()}>
            <div className={s.logoutEmoji}>🏆</div>
            <div className={s.logoutTitle}>Score Board</div>
            <div className={s.scoreGrid}>
              <div className={s.scoreItem}>
                <div className={s.scoreValue} style={{ color: "#00ffd0" }}>{sessionScores.crewWins}</div>
                <div className={s.scoreLabel}>Crew Wins</div>
              </div>
              <div className={s.scoreItem}>
                <div className={s.scoreValue} style={{ color: "#dc1e1e" }}>{sessionScores.imposterWins}</div>
                <div className={s.scoreLabel}>Imposter Wins</div>
              </div>
              <div className={s.scoreItem}>
                <div className={s.scoreValue} style={{ color: "#fbbf24" }}>{sessionScores.totalRounds}</div>
                <div className={s.scoreLabel}>Total Rounds</div>
              </div>
            </div>
            <div className={s.logoutActions}>
              <button className={s.logoutCancelBtn} onClick={() => setShowScoreBoard(false)}>
                Close
              </button>
              <button className={s.logoutConfirmBtn} onClick={handleResetScores}>
                Reset Scores
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={s.container}>
        {/* ─── Header ────────────────────────────── */}
        <header className={s.logo}>
          <h1>IMPOS<span>TER</span></h1>
          <p>Who is among us?</p>
          <div className={s.headerButtons}>
            {user && (
              <span className={s.userBadge}>
                <span
                  className={s.userBadgeAvatar}
                  style={{
                    background: "linear-gradient(135deg, #dc1e1e, #ff4444)",
                  }}
                >
                  {(user.displayName || "?")[0].toUpperCase()}
                </span>
                <span className={s.userBadgeName}>{user.displayName || "Player"}</span>
              </span>
            )}
            {phase !== "setup" && (
              <span className={s.roundBadge}>
                Round {roundNumber}
              </span>
            )}
            <button className={s.scoreBoardBtn} onClick={() => setShowScoreBoard(true)}>
              🏆 {sessionScores.totalRounds}
            </button>
            <button className={s.homeBtn} onClick={goHome}>
              🏠 Home
            </button>
            <button className={s.logoutBtn} onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </header>

        {/* ═══════════════════════════════════════════ */}
        {/* PHASE: SETUP                                */}
        {/* ═══════════════════════════════════════════ */}
        {phase === "setup" && (
          <div className={`${s.setupView} ${phaseAnimClass}`}>
            {/* Player Count */}
            <div className={`${s.card} ${s.cardCascade}`}>
              <div className={s.sectionLabel}>Number of Players</div>
              <div className={s.playerCountRow}>
                <button className={s.countBtn} onClick={() => updateCount(-1)}>−</button>
                <div className={s.countDisplay}>
                  <span key={countKey} className={s.countFlip}>{playerCount}</span>
                </div>
                <button className={s.countBtn} onClick={() => updateCount(1)}>+</button>
              </div>
            </div>

            {/* Player Names */}
            <div className={`${s.card} ${s.cardCascade}`}>
              <div className={s.sectionLabel}>Player Names</div>
              <div className={s.playerInputs}>
                {playerNames.slice(0, playerCount).map((name, i) => (
                  <div
                    key={i}
                    className={`${s.playerInputWrap} ${s.playerInputElastic}`}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <span className={s.playerNum}>P{i + 1}</span>
                    <input
                      className={s.textInput}
                      type="text"
                      placeholder={`Player ${i + 1}`}
                      value={name}
                      onChange={(e) => updateName(i, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Category / Genre Selection */}
            <div className={`${s.card} ${s.cardCascade}`}>
              <div className={s.sectionLabel}>Choose Categories (Select 1, 4, or Any)</div>

              <div className={s.genreControlsRow}>
                <div className={s.genreStatusBadge}>
                  {selectedGenres.length === 0 ? (
                    <span style={{ color: "#ff6b6b" }}>⚠ Please select at least 1 category</span>
                  ) : (
                    <span>
                      Selected: <strong>{selectedGenres.length}</strong> {selectedGenres.length === 1 ? "category" : "categories"}
                    </span>
                  )}
                </div>
                <div className={s.genreActionChips}>
                  <button type="button" className={s.genreActionChip} onClick={() => handleSelectRandomGenres(4)}>
                    🎲 Pick 4
                  </button>
                  <button type="button" className={s.genreActionChip} onClick={() => handleSelectRandomGenres(1)}>
                    🎯 Pick 1
                  </button>
                  <button type="button" className={s.genreActionChip} onClick={handleSelectAllGenres}>
                    ✨ All
                  </button>
                  <button type="button" className={s.genreActionChip} onClick={handleClearGenres}>
                    ✕ Clear
                  </button>
                </div>
              </div>

              <div className={s.genreGrid}>
                {Object.keys(GENRES).map((genre) => {
                  const isSelected = selectedGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      type="button"
                      className={`${s.genreBtn} ${s.genreBtnInteractive} ${
                        isSelected ? s.genreBtnSelected : ""
                      } ${genreRippleKey === genre ? s.genreBtnRipple : ""}`}
                      onClick={() => handleGenreToggle(genre)}
                    >
                      {isSelected ? "✓ " : ""}{genre}
                    </button>
                  );
                })}
                <button
                  type="button"
                  className={`${s.genreBtn} ${s.genreBtnInteractive} ${
                    selectedGenres.includes("✨ Custom") ? s.genreBtnSelected : ""
                  } ${genreRippleKey === "✨ Custom" ? s.genreBtnRipple : ""}`}
                  onClick={() => handleGenreToggle("✨ Custom")}
                >
                  {selectedGenres.includes("✨ Custom") ? "✓ " : ""}✨ Custom
                </button>
              </div>

              {selectedGenres.includes("✨ Custom") && (
                <div className={s.customSection}>
                  <div className={s.sectionLabel} style={{ marginTop: "20px" }}>Custom Topic Name</div>
                  <input
                    className={s.textInput}
                    type="text"
                    placeholder="e.g. Inside Jokes"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                  />
                  <div className={s.sectionLabel} style={{ marginTop: "20px" }}>Custom Words</div>
                  <div className={s.customWordsHeader}>
                    <button className={s.uploadBtn} onClick={() => fileInputRef.current?.click()}>
                      📁 Upload File (.txt, .csv)
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".txt,.csv"
                      style={{ display: "none" }}
                    />
                  </div>
                  <textarea
                    className={s.textArea}
                    placeholder="Enter words separated by space or comma (min 3)"
                    value={customWords}
                    onChange={(e) => setCustomWords(e.target.value)}
                  />
                  <div className={s.wordCountHint}>
                    Words detected: {customWords.split(/[,\s]+/).filter((w) => w.trim()).length}
                  </div>
                </div>
              )}
            </div>

            {/* Timer Setting */}
            <div className={`${s.card} ${s.cardCascade}`}>
              <div className={s.sectionLabel}>Discussion Timer</div>
              <div className={s.timerOptions}>
                {TIMER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${s.timerOptionBtn} ${timerDuration === opt.value ? s.timerOptionActive : ""}`}
                    onClick={() => setTimerDuration(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Instructions & Hints */}
            <button className={s.manualBtn} onClick={() => setShowManual(true)}>
              📖 Show Instructions
            </button>
            {showManual && <InstructionManual onClose={() => setShowManual(false)} />}

            <div className={s.hintCheckbox}>
              <label>
                <input
                  type="checkbox"
                  checked={showHint}
                  onChange={() => setShowHint(!showHint)}
                />
                {" "}💡 Show hint to imposter
              </label>
            </div>

            <button className={s.startBtn} disabled={!canStart} onClick={startGame}>
              🎮 Start Game
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* PHASE: PASS DEVICE                          */}
        {/* ═══════════════════════════════════════════ */}
        {phase === "passDevice" && (
          <div className={`${s.passDeviceView} ${s.passDeviceVignette} ${phaseAnimClass}`}>
            <div className={s.card}>
              <div className={s.progressRow}>
                <svg className={s.progressSvg} width="100" height="100">
                  <circle className={s.progressBg} cx="50" cy="50" r="45" />
                  <circle
                    className={s.progressFill}
                    cx="50"
                    cy="50"
                    r="45"
                    style={{ strokeDashoffset: progressOffset }}
                  />
                </svg>
                <div className={s.progressText}>
                  {currentRevealIndex + 1} / {gameData.players.length}
                </div>
              </div>

              {/* Character handoff animation */}
              <div className={s.passCharacterRow}>
                <GameCharacter
                  colorIndex={currentRevealIndex}
                  size="medium"
                  pose="idle"
                  name={currentPlayerName}
                />
              </div>

              <div className={`${s.passDeviceIcon} ${s.iconRotate3D}`}>📱</div>
              <div className={s.passDeviceTitle}>PASS DEVICE TO</div>
              <div className={`${s.passDeviceName} ${s.glitchName}`}>{currentPlayerName}</div>
              <div className={s.passDeviceSubtext}>
                Make sure no one else is looking at the screen!
              </div>

              <button className={`${s.actionBtn} ${s.magneticBtn}`} onClick={handleReadyForCard}>
                I am {currentPlayerName} →
              </button>

              <button className={s.staticHomeBtn} onClick={goHome}>
                🏠 Go to Home
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* PHASE: CARD REVEAL                          */}
        {/* ═══════════════════════════════════════════ */}
        {phase === "cardReveal" && (
          <div className={`${s.cardRevealView} ${phaseAnimClass}`}>
            <div className={s.revealCardWrap}>
              <div
                className={`${s.secretCard} ${
                  cardFlipped ? (isImposter ? s.cardImposterBurst : s.cardCrewBurst) : ""
                } ${s.cardElasticIn}`}
              >
                {!cardFlipped ? (
                  <div className={`${s.cardFace} ${s.cardFront}`}>
                    <div className={s.cardFrontIcon}>🕵️</div>
                    <div className={s.cardFrontName}>{currentPlayerName}</div>
                    <button 
                      className={s.actionBtn} 
                      onClick={handleRevealCard}
                      style={{ marginTop: '20px', marginBottom: '15px' }}
                    >
                      REVEAL ROLE
                    </button>
                    <div className={s.cardFrontWarning}>
                      Keep the screen hidden from others
                    </div>
                  </div>
                ) : (
                  <div
                    className={`${s.cardFace} ${s.cardBack} ${
                      isImposter ? s.imposterCard : s.normalCard
                    }`}
                    style={{ visibility: transitioning ? "hidden" : "visible" }}
                  >
                    <div className={s.revealContent}>
                    <div className={s.revealIcon}>
                      {isImposter ? "😈" : "🤫"}
                    </div>
                    <div className={s.revealLabel}>
                      {isImposter ? "⚠ You Are" : "Your Word"}
                    </div>
                    <div className={s.revealWord}>
                      {isImposter ? "IMPOSTER" : gameData.word}
                    </div>

                    {isImposter ? (
                      <>
                        <div className={s.imposterCategoryTag}>
                          📂 Category: <strong>{gameData.genre}</strong>
                        </div>

                        {showHint && gameData.hint && (
                          <div className={s.imposterHintCard}>
                            <div className={s.imposterHintTitle}>
                              💡 Category Clue
                            </div>
                            <div className={s.imposterHintClue}>
                              "{gameData.hint.categoryClue}"
                            </div>
                            <div className={s.imposterHintMeta}>
                              <span>First Letter: <strong>{gameData.hint.firstLetter}</strong></span>
                              <span>Length: <strong>{gameData.hint.wordLength} chars</strong></span>
                            </div>
                            <div className={s.imposterStrategy}>
                              🎭 Pretend you know the secret word in {gameData.hint.categoryName}!
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className={s.revealGenre}>
                        📁 Category: {gameData.genre}
                      </div>
                    )}
                  </div>
                </div>
                )}
              </div>
            </div>

            {cardFlipped && (
              <div className={`${s.gotItSection} ${s.fadeSlideIn}`}>
                <button
                  className={`${s.gotItBtn} ${transitioning ? s.btnDisabled : ""}`}
                  onClick={handleGotIt}
                  disabled={transitioning}
                >
                  ✓ Got It!{nextPlayerName ? ` — Pass to ${nextPlayerName}` : " — Everyone's Done!"}
                </button>
              </div>
            )}

            <button className={s.staticHomeBtn} onClick={goHome}>
              🏠 Go to Home
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* PHASE: ALL READY                            */}
        {/* ═══════════════════════════════════════════ */}
        {phase === "allReady" && (
          <div className={`${s.allReadyView} ${phaseAnimClass}`}>
            <div className={s.card}>
              <div className={`${s.allReadyIcon} ${s.celebrateElastic}`}>🎉</div>
              <div className={s.allReadyTitle}>EVERYONE IS READY!</div>
              <div className={s.allReadySubtext}>
                All players have seen their secret roles.
              </div>

              {/* Character lineup */}
              <div className={s.characterLineup}>
                {gameData.players.map((name, i) => (
                  <GameCharacter
                    key={i}
                    colorIndex={i}
                    size="small"
                    pose="idle"
                    name={name.length > 6 ? name.slice(0, 5) + "…" : name}
                  />
                ))}
              </div>

              {startingPlayerIndex !== null && (
                <div className={`${s.starterCard} ${s.spotlightZoom}`}>
                  <div className={s.starterLabel}>First Player to Speak</div>
                  <div className={s.starterName}>
                    {gameData.players[startingPlayerIndex]}
                  </div>
                  <div className={s.starterSubtext}>
                    Describe the secret word without saying it directly!
                  </div>
                  <button
                    className={`${s.rerollBtn} ${rerolling ? s.rerollShaking : ""}`}
                    onClick={handleReroll}
                    disabled={rerolling}
                  >
                    🎲 Re-roll Starter
                  </button>
                </div>
              )}

              {timerDuration > 0 && (
                <div className={s.timerPreview}>
                  ⏱️ Timer: {timerDuration}s will start when discussion begins
                </div>
              )}

              <button className={s.actionBtn} onClick={handleStartDiscussion}>
                Start Discussion 💬
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* PHASE: DISCUSSION                           */}
        {/* ═══════════════════════════════════════════ */}
        {phase === "discussion" && (
          <div className={`${s.discussionView} ${phaseAnimClass}`}>
            <div className={s.card}>
              <div className={`${s.discussionIcon} ${s.detectivePulsing}`}>🕵️‍♂️</div>
              <div className={s.discussionTitle}>DISCUSSION TIME</div>

              {/* Timer Display */}
              {timerDuration > 0 && (
                <div className={`${s.timerDisplay} ${timerRemaining <= 10 && timerRemaining > 0 ? s.timerCritical : ""} ${timerRemaining === 0 ? s.timerDone : ""}`}>
                  <div className={s.timerClock}>
                    {timerRemaining > 0 ? formatTimer(timerRemaining) : "⏰ TIME'S UP!"}
                  </div>
                  {timerRemaining > 0 && (
                    <div className={s.timerBar}>
                      <div
                        className={s.timerBarFill}
                        style={{ width: `${(timerRemaining / timerDuration) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className={s.discussionSubtext}>
                Take turns giving one clue each about the secret word.
              </div>

              <div className={s.rulesList}>
                <div className={`${s.ruleItem} ${s.waveIn}`} style={{ animationDelay: "0ms" }}>
                  <span className={s.ruleNum}>1</span>
                  <span>Give vague but accurate clues about the secret word.</span>
                </div>
                <div className={`${s.ruleItem} ${s.waveIn}`} style={{ animationDelay: "100ms" }}>
                  <span className={s.ruleNum}>2</span>
                  <span>Imposter: Blend in and pretend you know the word!</span>
                </div>
                <div className={`${s.ruleItem} ${s.waveIn}`} style={{ animationDelay: "200ms" }}>
                  <span className={s.ruleNum}>3</span>
                  <span>When everyone has given clues, proceed to vote.</span>
                </div>
              </div>

              <button className={s.actionBtn} onClick={() => changePhase("voting")}>
                Time to Vote! 🗳️
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* PHASE: VOTING                               */}
        {/* ═══════════════════════════════════════════ */}
        {phase === "voting" && (
          <div className={`${s.votingView} ${phaseAnimClass}`}>
            <div className={s.card}>
              <div className={s.votingTitle}>WHO IS THE IMPOSTER?</div>
              <div className={s.votingSubtext}>
                Vote for the player you think is the imposter
              </div>

              <div className={s.voteGrid}>
                {gameData.players.map((name, i) => {
                  const isSelected = suspect === i;
                  const isDimmed = suspect !== null && suspect !== i;
                  return (
                    <button
                      key={i}
                      className={`${s.voteBtn} ${isSelected ? s.voteBtnSelected : ""} ${
                        isDimmed ? s.voteCardDimmed : ""
                      } ${s.voteCardCascade}`}
                      style={{ animationDelay: `${i * 80}ms` }}
                      onClick={() => setSuspect(i)}
                    >
                      <GameCharacter
                        colorIndex={i}
                        size="small"
                        pose={isSelected ? "celebrating" : "idle"}
                        imposterGlow={isSelected}
                      />
                      <div className={s.voteName}>{name}</div>
                      {isSelected && <div className={s.voteCheck}>🎯</div>}
                    </button>
                  );
                })}
              </div>

              <button
                key={lockAnimKey}
                className={`${s.actionBtn} ${s.voteConfirmPulse}`}
                disabled={suspect === null}
                onClick={handleVote}
              >
                {suspect !== null
                  ? `Lock Vote: ${gameData.players[suspect]} 🔒`
                  : "Select a player to vote"}
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* PHASE: RESULT                               */}
        {/* ═══════════════════════════════════════════ */}
        {phase === "result" && (
          <div className={`${s.resultView} ${phaseAnimClass}`}>
            {showConfetti && <Confetti />}

            {/* Character Animation — Caught or Escaped */}
            {resultReady && (
              <div className={s.resultCharacterScene}>
                <GameCharacter
                  colorIndex={gameData.imposterIndex}
                  size="large"
                  pose={suspect === gameData.imposterIndex ? "caught" : "escaped"}
                  imposterGlow={suspect !== gameData.imposterIndex}
                  name={gameData.players[gameData.imposterIndex]}
                />
              </div>
            )}

            {/* Verdict Card */}
            {resultReady && (
              <div
                className={`${s.verdictCard} ${
                  suspect === gameData.imposterIndex
                    ? `${s.verdictWin} ${s.greenExplosion}`
                    : `${s.verdictLose} ${s.redAlarmFlash}`
                } ${s.stampCrash}`}
              >
                <div className={s.verdictIcon}>
                  {suspect === gameData.imposterIndex ? "🎉" : "💀"}
                </div>
                <div className={s.verdictTitle}>
                  {suspect === gameData.imposterIndex
                    ? "IMPOSTER CAUGHT!"
                    : "IMPOSTER ESCAPED!"}
                </div>
                <div className={s.verdictSubtext}>
                  The Imposter was <strong className={s.imposterReveal}>
                    {gameData.players[gameData.imposterIndex]}
                  </strong> 🕵️
                </div>
              </div>
            )}

            <div className={s.wordRevealCard}>
              <div className={s.resultWordLabel}>The Secret Word Was</div>
              <div className={`${s.resultWord} ${s.letterByLetter}`}>
                {renderLetterByLetter(gameData.word)}
              </div>
              <div className={s.resultGenre}>
                Category: {gameData.genre}
              </div>
            </div>

            {/* ─── Hint Reveal Section ──────────────────── */}
            {showHint && gameData.hint && (
              <div className={s.hintRevealCard}>
                <button
                  className={s.hintRevealToggle}
                  onClick={() => setShowHintReveal(!showHintReveal)}
                >
                  {showHintReveal ? "🔽" : "▶️"} What the Imposter Knew
                </button>
                {showHintReveal && (
                  <div className={s.hintRevealContent}>
                    <div className={s.hintRevealRow}>
                      <span className={s.hintRevealLabel}>📂 Category:</span>
                      <span className={s.hintRevealValue}>{gameData.genre}</span>
                    </div>
                    <div className={s.hintRevealRow}>
                      <span className={s.hintRevealLabel}>💡 Clue:</span>
                      <span className={s.hintRevealValue}>"{gameData.hint.categoryClue}"</span>
                    </div>
                    <div className={s.hintRevealRow}>
                      <span className={s.hintRevealLabel}>🔤 First Letter:</span>
                      <span className={s.hintRevealValue}>{gameData.hint.firstLetter}</span>
                    </div>
                    <div className={s.hintRevealRow}>
                      <span className={s.hintRevealLabel}>📏 Word Length:</span>
                      <span className={s.hintRevealValue}>{gameData.hint.wordLength} characters</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Session Scores */}
            <div className={s.resultScoreCard}>
              <div className={s.resultScoreTitle}>Session Scores</div>
              <div className={s.resultScoreRow}>
                <div className={s.resultScoreStat}>
                  <span style={{ color: "#00ffd0" }}>🛡️ {sessionScores.crewWins}</span> Crew Wins
                </div>
                <div className={s.resultScoreStat}>
                  <span style={{ color: "#dc1e1e" }}>😈 {sessionScores.imposterWins}</span> Imposter Wins
                </div>
                <div className={s.resultScoreStat}>
                  <span style={{ color: "#fbbf24" }}>🔄 {sessionScores.totalRounds}</span> Rounds
                </div>
              </div>
            </div>

            {/* ─── 3-Button Result Actions ──────────────── */}
            <div className={s.resultActions}>
              <button className={s.actionBtn} onClick={quickRestart}>
                ⚡ Next Round — Same Players
              </button>
              <button className={s.resetBtn} onClick={fullReset}>
                🔄 New Game (Change Players)
              </button>
              <button className={s.homeReturnBtn} onClick={goHome}>
                🏠 Go to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}