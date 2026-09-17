import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "#0a0a0f",
            color: "#f3f4f6",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            textAlign: "center",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              marginBottom: "16px",
              filter: "drop-shadow(0 0 20px rgba(220, 30, 30, 0.6))",
            }}
          >
            ⚠️
          </div>
          <h1
            style={{
              fontSize: "32px",
              color: "#dc1e1e",
              margin: "0 0 12px 0",
              fontWeight: 800,
              letterSpacing: "1px",
            }}
          >
            GAME COMPROMISED
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#9ca3af",
              maxWidth: "460px",
              marginBottom: "28px",
              lineHeight: 1.5,
            }}
          >
            An unexpected error occurred during the session. Don't worry, your player profile and scores are safely preserved.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              background: "linear-gradient(135deg, #dc1e1e, #8b0000)",
              color: "#ffffff",
              border: "none",
              padding: "14px 32px",
              fontSize: "16px",
              fontWeight: 700,
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0 0 25px rgba(220, 30, 30, 0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            🔄 Restart Game
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
