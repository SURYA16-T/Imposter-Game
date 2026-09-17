import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import AuthProvider from '../components/Auth/AuthProvider';
import { useAuth } from '../components/Auth/useAuth';

function TestConsumer() {
  const { user, isAuthenticated, login, logout, getScores, updateScores, resetScores } = useAuth();

  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'logged-in' : 'logged-out'}</span>
      <span data-testid="display-name">{user ? user.displayName : 'none'}</span>
      <button onClick={() => login('Commander')}>Login Commander</button>
      <button onClick={() => login('')}>Login Empty</button>
      <button onClick={logout}>Logout</button>
      <button onClick={() => updateScores(true)}>Crew Win</button>
      <button onClick={() => updateScores(false)}>Imposter Win</button>
      <button onClick={resetScores}>Reset Scores</button>
      <span data-testid="scores">{JSON.stringify(getScores())}</span>
    </div>
  );
}

describe('AuthProvider & useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts unauthenticated when localStorage is empty', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status').textContent).toBe('logged-out');
    expect(screen.getByTestId('display-name').textContent).toBe('none');
  });

  it('allows a user to log in and persists to localStorage', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    const loginBtn = screen.getByText('Login Commander');
    act(() => {
      loginBtn.click();
    });

    expect(screen.getByTestId('auth-status').textContent).toBe('logged-in');
    expect(screen.getByTestId('display-name').textContent).toBe('Commander');

    const stored = JSON.parse(localStorage.getItem('imposter_player'));
    expect(stored.displayName).toBe('Commander');
  });

  it('rejects empty display names during login', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    const emptyBtn = screen.getByText('Login Empty');
    act(() => {
      emptyBtn.click();
    });

    expect(screen.getByTestId('auth-status').textContent).toBe('logged-out');
  });

  it('clears session upon logout', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    act(() => {
      screen.getByText('Login Commander').click();
    });
    expect(screen.getByTestId('auth-status').textContent).toBe('logged-in');

    act(() => {
      screen.getByText('Logout').click();
    });
    expect(screen.getByTestId('auth-status').textContent).toBe('logged-out');
    expect(localStorage.getItem('imposter_player')).toBeNull();
  });

  it('tracks and persists game scores', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    act(() => {
      screen.getByText('Crew Win').click();
    });
    act(() => {
      screen.getByText('Imposter Win').click();
    });

    const storedScores = JSON.parse(localStorage.getItem('imposter_scores'));
    expect(storedScores.crewWins).toBe(1);
    expect(storedScores.imposterWins).toBe(1);
    expect(storedScores.totalRounds).toBe(2);

    act(() => {
      screen.getByText('Reset Scores').click();
    });
    expect(localStorage.getItem('imposter_scores')).toBeNull();
  });
});
