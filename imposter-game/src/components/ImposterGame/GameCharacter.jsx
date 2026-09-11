import React from "react";
import s from "./GameCharacter.module.css";

const COLOR_CLASSES = [
  s.colorRed, s.colorBlue, s.colorGreen, s.colorPink,
  s.colorOrange, s.colorYellow, s.colorPurple, s.colorCyan,
  s.colorLime, s.colorMaroon,
];

const SIZE_MAP = {
  small: s.sizeSmall,
  medium: s.sizeMedium,
  large: s.sizeLarge,
  xlarge: s.sizeXLarge,
};

const POSE_MAP = {
  idle: s.idle,
  walking: s.walking,
  celebrating: s.celebrating,
  sneaking: s.sneaking,
  caught: s.caught,
  escaped: s.escaped,
  ghost: s.ghost,
};

/**
 * GameCharacter — Among Us-style animated character
 *
 * @param {object} props
 * @param {string} [props.name]         — Display name below character
 * @param {number} [props.colorIndex=0] — Color preset index (0-9)
 * @param {string} [props.size='medium'] — 'small' | 'medium' | 'large' | 'xlarge'
 * @param {string} [props.pose='idle']  — 'idle' | 'walking' | 'celebrating' | 'sneaking' | 'caught' | 'escaped' | 'ghost'
 * @param {boolean} [props.imposterGlow=false] — Red glow effect
 * @param {object} [props.walkConfig]   — { start, end, duration } for walk animation
 * @param {object} [props.style]        — Additional inline styles
 * @param {string} [props.className]    — Additional class names
 */
export default function GameCharacter({
  name,
  colorIndex = 0,
  size = "medium",
  pose = "idle",
  imposterGlow = false,
  walkConfig,
  style = {},
  className = "",
}) {
  const colorClass = COLOR_CLASSES[colorIndex % COLOR_CLASSES.length];
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.medium;
  const poseClass = POSE_MAP[pose] || POSE_MAP.idle;

  const walkStyle = walkConfig
    ? {
        "--walk-start": walkConfig.start || "-100px",
        "--walk-end": walkConfig.end || "100px",
        "--walk-duration": walkConfig.duration || "6s",
      }
    : {};

  const isGhost = pose === "ghost";

  return (
    <div
      className={`${s.character} ${sizeClass} ${colorClass} ${poseClass} ${
        imposterGlow ? s.imposterGlow : ""
      } ${className}`}
      style={{ ...walkStyle, ...style }}
    >
      <div className={s.body}>
        <div className={s.visor} />
        <div className={s.backpack} />
      </div>

      {isGhost ? (
        <div className={s.ghostTail}>
          <div className={s.ghostTailPiece} />
          <div className={s.ghostTailPiece} />
          <div className={s.ghostTailPiece} />
        </div>
      ) : (
        <div className={s.legs}>
          <div className={s.leg} />
          <div className={s.leg} />
        </div>
      )}

      {name && <div className={s.nameLabel}>{name}</div>}
    </div>
  );
}
