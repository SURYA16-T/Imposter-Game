import { describe, it, expect } from 'vitest';
import { GENRES, cryptoRandom, generateHint, assignRoles } from '../components/ImposterGame/constants';

describe('Game Engine & Constants', () => {
  describe('GENRES dataset integrity', () => {
    it('should have all 17 distinct game categories', () => {
      const genreKeys = Object.keys(GENRES);
      expect(genreKeys.length).toBe(17);
      expect(genreKeys).toContain('🎮 Video Games');
      expect(genreKeys).toContain('🏏 Sports');
      expect(genreKeys).toContain('🍕 Food');
      expect(genreKeys).toContain('🌍 Places');
      expect(genreKeys).toContain('🐾 Animals');
    });

    it('should ensure each category contains valid word objects with hints', () => {
      Object.entries(GENRES).forEach(([, words]) => {
        expect(Array.isArray(words)).toBe(true);
        expect(words.length).toBeGreaterThanOrEqual(15);
        words.forEach((item) => {
          expect(item).toHaveProperty('word');
          expect(typeof item.word).toBe('string');
          expect(item.word.length).toBeGreaterThan(0);
          expect(item).toHaveProperty('hint');
          expect(typeof item.hint).toBe('string');
          expect(item.hint.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('cryptoRandom utility', () => {
    it('should return an integer between 0 and max - 1', () => {
      const max = 10;
      for (let i = 0; i < 50; i++) {
        const val = cryptoRandom(max);
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(max);
        expect(Number.isInteger(val)).toBe(true);
      }
    });
  });

  describe('generateHint utility', () => {
    it('should generate hints for a word object with a custom hint', () => {
      const wordObj = { word: 'Minecraft', hint: 'Block-building sandbox game' };
      const hint = generateHint(wordObj, '🎮 Video Games');

      expect(hint.categoryClue).toBe('Block-building sandbox game');
      expect(hint.firstLetter).toBe('M');
      expect(hint.wordLength).toBe(9);
      expect(hint.categoryName).toBe('Video Games');
      expect(hint.fullGenre).toBe('🎮 Video Games');
    });

    it('should fallback gracefully for string words without a hint object', () => {
      const hint = generateHint('Cricket', '🏏 Sports');
      expect(hint.categoryClue).toBe('Word relates to Sports');
      expect(hint.firstLetter).toBe('C');
      expect(hint.wordLength).toBe(7);
      expect(hint.categoryName).toBe('Sports');
    });
  });

  describe('assignRoles utility', () => {
    const mockPlayers = ['Alice', 'Bob', 'Charlie', 'Dave'];

    it('should assign an imposter index within player boundaries', () => {
      const result = assignRoles(mockPlayers, '🎮 Video Games');
      expect(result.imposterIndex).toBeGreaterThanOrEqual(0);
      expect(result.imposterIndex).toBeLessThan(mockPlayers.length);
      expect(result.word).toBeTruthy();
      expect(result.genre).toBe('🎮 Video Games');
    });

    it('should support custom word selection', () => {
      const customWords = ['SecretBase', 'HiddenVault'];
      const result = assignRoles(mockPlayers, 'Custom Room', customWords);
      expect(customWords).toContain(result.word);
      expect(result.genre).toBe('Custom Room');
    });

    it('should rotate the imposter index if previous index is supplied and players > 1', () => {
      const previousIndex = 2;
      for (let i = 0; i < 20; i++) {
        const result = assignRoles(mockPlayers, '🏏 Sports', null, previousIndex);
        expect(result.imposterIndex).not.toBe(previousIndex);
      }
    });

    it('should support multi-genre selection array', () => {
      const multiGenres = ['🎮 Video Games', '🍕 Food'];
      const result = assignRoles(mockPlayers, multiGenres);
      expect(multiGenres).toContain(result.genre);
      expect(result.word).toBeTruthy();
    });
  });
});
