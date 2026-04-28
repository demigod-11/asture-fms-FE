import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import App from './App';
import './styles/index.css';

// Apply saved theme immediately to avoid flash (safe in SSR / missing APIs)
try {
  const key = 'asture-theme';
  const stored =
    typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  const theme =
    stored === 'dark' || stored === 'light'
      ? stored
      : typeof window !== 'undefined' &&
          window.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
  document.documentElement.classList.add(theme);
} catch {
  document.documentElement.classList.add('light');
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              <NotificationProvider>
                <App />
              </NotificationProvider>
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </AppErrorBoundary>
  </React.StrictMode>
);
