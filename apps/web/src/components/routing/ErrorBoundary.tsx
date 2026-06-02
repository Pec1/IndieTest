import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { hasError: boolean; error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-it-page flex items-center justify-center p-8">
          <div className="max-w-lg w-full border-2 border-red-500 bg-it-surface p-8">
            <div className="font-mono text-[10px] text-red-500 uppercase mb-2">SYSTEM_ERROR // UNHANDLED_EXCEPTION</div>
            <h1 className="font-display font-black text-4xl text-it-text uppercase tracking-tight mb-4">Algo quebrou</h1>
            <pre className="font-mono text-xs text-it-muted bg-it-page p-4 border border-it-border overflow-auto mb-6 whitespace-pre-wrap">{this.state.error?.message}</pre>
            <button onClick={() => window.location.reload()} className="font-display font-bold uppercase tracking-widest px-6 py-3 bg-[#D4FF00] text-black hover:bg-[#e2ff4d] w-full">REINICIAR_SISTEMA</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
