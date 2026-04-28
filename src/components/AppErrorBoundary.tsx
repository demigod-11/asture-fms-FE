import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/** Catches render errors and shows a fallback so the screen is not blank. */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('AppErrorBoundary caught an error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            fontFamily: 'system-ui, sans-serif',
            backgroundColor: '#f9fafb',
            color: '#111827',
          }}
        >
          <h1 style={{ fontSize: 20, marginBottom: 8 }}>
            Something went wrong
          </h1>
          <p
            style={{
              maxWidth: 480,
              marginBottom: 16,
              fontSize: 14,
              color: '#6b7280',
            }}
          >
            {this.state.error.message}
          </p>
          <button
            type='button'
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '8px 16px',
              fontSize: 14,
              cursor: 'pointer',
              backgroundColor: '#073E60',
              color: 'white',
              border: 'none',
              borderRadius: 6,
            }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
