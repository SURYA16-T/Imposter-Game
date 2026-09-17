import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import InstructionManual from '../components/ImposterGame/InstructionManual';
import LoginScreen from '../components/Auth/LoginScreen';
import AuthProvider from '../components/Auth/AuthProvider';
import ErrorBoundary from '../components/ErrorBoundary';

function ProblemChild() {
  throw new Error('Explosion in game room');
}

describe('React Component Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('ErrorBoundary Component', () => {
    it('catches render errors and displays recovery UI without white-screening', () => {
      // Suppress console.error in test output for intentional throw
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ProblemChild />
        </ErrorBoundary>
      );

      expect(screen.getByText(/GAME COMPROMISED/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Restart Game/i })).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('App Component', () => {
    it('renders the LoginScreen when no player is saved in localStorage', () => {
      render(<App />);
      expect(screen.getByText(/Who is among us\?/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Your display name.../i)).toBeInTheDocument();
    });

    it('renders the ImposterGame directly when player is already stored', () => {
      localStorage.setItem('imposter_player', JSON.stringify({ displayName: 'Captain' }));
      render(<App />);
      expect(screen.getByText(/IMPOSTER/i)).toBeInTheDocument();
      expect(screen.getByText(/PLAY/i)).toBeInTheDocument();
    });
  });

  describe('LoginScreen Component', () => {
    it('validates name input before submitting', () => {
      render(
        <AuthProvider>
          <LoginScreen />
        </AuthProvider>
      );

      const submitBtn = screen.getByRole('button', { name: /Start Playing/i });
      fireEvent.click(submitBtn);

      expect(screen.getByText(/Please enter your name to play/i)).toBeInTheDocument();
    });

    it('rejects names with less than 2 characters', () => {
      render(
        <AuthProvider>
          <LoginScreen />
        </AuthProvider>
      );

      const input = screen.getByPlaceholderText(/Your display name.../i);
      fireEvent.change(input, { target: { value: 'A' } });

      const submitBtn = screen.getByRole('button', { name: /Start Playing/i });
      fireEvent.click(submitBtn);

      expect(screen.getByText(/Name must be at least 2 characters/i)).toBeInTheDocument();
    });
  });

  describe('InstructionManual Component', () => {
    it('renders rules and triggers onClose callback when clicking close button', () => {
      const handleClose = vi.fn();
      render(<InstructionManual onClose={handleClose} />);

      expect(screen.getByText(/🎭 How to Play/i)).toBeInTheDocument();
      expect(screen.getByText(/1️⃣ Setup/i)).toBeInTheDocument();
      expect(screen.getByText(/2️⃣ Secret Roles/i)).toBeInTheDocument();
      expect(screen.getByText(/3️⃣ Discuss/i)).toBeInTheDocument();
      expect(screen.getByText(/4️⃣ Vote/i)).toBeInTheDocument();

      const closeBtn = screen.getByRole('button', { name: /✕ Close/i });
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
