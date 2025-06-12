import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(_error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          border: '1px solid #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#ffe0e0',
          color: '#d63031'
        }}>
          <h2>⚠️ Algo deu errado</h2>
          <p>Ocorreu um erro inesperado na aplicação.</p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            <summary>Detalhes do erro (clique para expandir)</summary>
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#f8f9fa', 
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              marginTop: '10px',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo?.componentStack}
            </div>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#0984e3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Recarregar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
