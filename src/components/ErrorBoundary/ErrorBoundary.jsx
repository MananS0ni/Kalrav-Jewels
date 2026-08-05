import React, { Component } from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Kalrav Jewels Error Boundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-page">
          <div className="error-boundary-card">
            <img src="/kalrav_vertical_v2.png" alt="Kalrav Jewels" className="error-boundary-logo" />
            <div className="gold-line-center" style={{ margin: '20px auto 24px' }}></div>
            <p className="error-boundary-label">Kalrav Jewels</p>
            <h1 className="error-boundary-title">We'll Be Right Back</h1>
            <p className="error-boundary-message">
              We experienced a brief technical hiccup while loading this page. Please refresh or return to our home page to continue browsing our fine 925 sterling silver collection.
            </p>

            <div className="error-boundary-actions">
              <button className="btn-primary" onClick={this.handleReload} id="error-boundary-reload-btn">
                <span>Refresh Page</span>
              </button>
              <button className="btn-outline" onClick={this.handleGoHome} id="error-boundary-home-btn">
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
