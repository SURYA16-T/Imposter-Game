import AuthProvider from './components/Auth/AuthProvider';
import { useAuth } from './components/Auth/useAuth';
import LoginScreen from './components/Auth/LoginScreen';
import ImposterGame from './components/ImposterGame/ImposterGame';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#dc1e1e',
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '28px',
        letterSpacing: '4px',
      }}>
        Loading...
      </div>
    );
  }

  return isAuthenticated ? <ImposterGame /> : <LoginScreen />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;