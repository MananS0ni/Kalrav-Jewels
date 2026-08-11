import React, { Component } from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      isOffline: !navigator.onLine,
      isBackOnline: false,
      reason: !navigator.onLine ? 'offline' : 'crash'
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, reason: 'crash' };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Kalrav Jewels Error Boundary caught an error:', error, errorInfo);
  }

  componentDidMount() {
    window.addEventListener('offline', this.handleOffline);
    window.addEventListener('online', this.handleOnline);

    if (!navigator.onLine) {
      this.setState({
        hasError: true,
        isOffline: true,
        reason: 'offline'
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('offline', this.handleOffline);
    window.removeEventListener('online', this.handleOnline);
  }

  handleOffline = () => {
    this.setState({
      hasError: true,
      isOffline: true,
      isBackOnline: false,
      reason: 'offline'
    });
  };

  handleOnline = () => {
    if (this.state.reason === 'offline') {
      this.setState({
        isOffline: false,
        isBackOnline: true
      });
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    const { hasError, reason, isBackOnline } = this.state;

    if (hasError) {
      const isOfflineReason = reason === 'offline';

      return (
        <div className="error-boundary-page">
          <div className="error-boundary-card">
            <img src="/kalrav_vertical_v2.png" alt="Kalrav Jewels" className="error-boundary-logo" />
            <div className="gold-line-center" style={{ margin: '20px auto 24px' }}></div>
            <p className="error-boundary-label">Kalrav Jewels</p>
            <h1 className="error-boundary-title">
              {isOfflineReason ? "You're Offline" : "We'll Be Right Back"}
            </h1>
            <p className="error-boundary-message">
              {isOfflineReason
                ? "You appear to be offline. Please check your internet connection and try again to continue exploring our fine 925 sterling silver collection."
                : "We experienced a brief technical hiccup while loading this page. Please refresh or return to our home page to continue browsing our fine 925 sterling silver collection."}
            </p>

            <div className="error-boundary-actions">
              <button className="btn-primary" onClick={this.handleReload} id="error-boundary-reload-btn">
                <span>
                  {isOfflineReason
                    ? isBackOnline
                      ? 'Back Online — Tap to Reload'
                      : 'Try Reconnecting'
                    : 'Refresh Page'}
                </span>
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
