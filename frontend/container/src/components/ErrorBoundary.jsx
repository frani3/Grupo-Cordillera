import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    this.error = error;
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[calc(100vh-112px)] items-center justify-center rounded-3xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary-600">Error de carga</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-gray-900">{this.props.message}</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              El micro frontend no pudo inicializarse correctamente. Puedes intentar recargar la vista.
            </p>
            <button
              type="button"
              onClick={this.handleRetry}
              className="mt-6 rounded-lg bg-gradient-brand px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Intentar nuevamente
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}