import React from "react";
import s from "./ImposterGame.module.css";

export default function InstructionManual({ onClose }) {
  return (
    <div className={s.manualOverlay} onClick={onClose}>
      <div className={s.manualContent} onClick={(e) => e.stopPropagation()}>
        <h2>🎭 How to Play</h2>
        <ol>
          <li>
            <strong>1️⃣ Setup</strong>
            <ul>
              <li>Choose 3–10 players and enter everyone's name.</li>
              <li>Pick a genre — Video Games, Sports, Movies (Tamil, Telugu, Malayalam, Hindi, English), Characters, Food, Animals, and more!</li>
              <li>Toggle "Show hint to imposter" for an extra clue.</li>
            </ul>
          </li>
          <li>
            <strong>2️⃣ Secret Roles</strong>
            <ul>
              <li>The device is passed player by player — only you see your card.</li>
              <li>Tap <strong>"I'm Ready"</strong> to reveal your role privately.</li>
              <li>Most players see the <strong>secret word</strong>.</li>
              <li>One player becomes the <strong>IMPOSTER</strong> — they see "IMPOSTER" instead (with a hint if enabled).</li>
              <li>Tap <strong>"Got It!"</strong> to pass to the next player.</li>
            </ul>
          </li>
          <li>
            <strong>3️⃣ Discuss</strong>
            <ul>
              <li>A random player is chosen to start the discussion.</li>
              <li>Each player describes the word — not too obvious, not too vague!</li>
              <li>The Imposter must blend in and figure out the word from clues.</li>
            </ul>
          </li>
          <li>
            <strong>4️⃣ Vote</strong>
            <ul>
              <li>After discussing, everyone votes for who they think is the Imposter.</li>
              <li>Select a suspect and confirm your vote.</li>
            </ul>
          </li>
          <li>
            <strong>5️⃣ Result</strong>
            <ul>
              <li>The game reveals whether the group caught the Imposter or not!</li>
              <li>The secret word is revealed to everyone.</li>
            </ul>
          </li>
        </ol>

        <button className={s.closeManualBtn} onClick={onClose}>
          ✕ Close
        </button>
      </div>
    </div>
  );
}