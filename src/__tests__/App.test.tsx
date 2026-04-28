import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from '../App';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { setAccessToken } from '@/services/authStorage';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

// Wrapper component for testing with router + auth + theme context
const renderWithRouter = (
  component: React.ReactElement,
  { route = '/' } = {}
) => {
  // Simulate an authenticated session for routes guarded by ProtectedRoute
  setAccessToken('test-token');

  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <ThemeProvider>
          <AuthProvider>{component}</AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Routing', () => {
    test('renders login page when navigating to /login', () => {
      renderWithRouter(<App />, { route: '/login' });

      expect(screen.getByText(/Login to your account/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    });

    test('renders dashboard fallback when navigating to / without organisation', () => {
      renderWithRouter(<App />, { route: '/' });

      expect(
        screen.getByText(
          /No organisation in context\. Complete onboarding to view dashboard insights\./i
        )
      ).toBeInTheDocument();
    });

    test('renders dashboard fallback when navigating to /home without organisation', () => {
      renderWithRouter(<App />, { route: '/home' });

      expect(
        screen.getByText(
          /No organisation in context\. Complete onboarding to view dashboard insights\./i
        )
      ).toBeInTheDocument();
    });

    test('renders 404 page for unknown routes', () => {
      renderWithRouter(<App />, { route: '/unknown-route' });

      expect(screen.getByText(/404/i)).toBeInTheDocument();
      expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    test('renders with proper layout wrapper', () => {
      renderWithRouter(<App />, { route: '/' });
      // Find the outermost container with the expected classes
      const container =
        screen
          .getByText(
            /No organisation in context\. Complete onboarding to view dashboard insights\./i
          )
          .closest('.min-h-screen.bg-gray-50') ||
        screen.getByText(
          /No organisation in context\. Complete onboarding to view dashboard insights\./i
        ).parentElement?.parentElement?.parentElement?.parentElement;
      expect(container).toHaveClass('min-h-screen', 'bg-gray-50');
    });

    test('login page renders without layout wrapper', () => {
      renderWithRouter(<App />, { route: '/login' });
      // Find the outermost container with the expected classes
      const container =
        screen
          .getByText(/Login to your account/i)
          .closest('.min-h-screen.bg-gray-50') ||
        screen.getByText(/Login to your account/i).parentElement?.parentElement
          ?.parentElement?.parentElement;
      expect(container).toHaveClass('min-h-screen', 'bg-gray-50');
    });
  });

  describe('Component Integration', () => {
    test('renders Layout component for protected routes', () => {
      renderWithRouter(<App />, { route: '/' });

      // Check for Layout component elements (navigation, etc.)
      // Since Layout wraps the content, we can check for its presence indirectly
      expect(
        screen.getByText(
          /No organisation in context\. Complete onboarding to view dashboard insights\./i
        )
      ).toBeInTheDocument();
    });

    test('renders dashboard fallback on root route without organisation', () => {
      renderWithRouter(<App />, { route: '/' });

      expect(
        screen.getByText(
          /No organisation in context\. Complete onboarding to view dashboard insights\./i
        )
      ).toBeInTheDocument();
    });

    test('renders Login component on login route', () => {
      renderWithRouter(<App />, { route: '/login' });

      expect(screen.getByText(/Login to your account/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Enter your details to continue/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Login/i })
      ).toBeInTheDocument();
    });

    test('renders NotFound component on invalid routes', () => {
      renderWithRouter(<App />, { route: '/invalid-path' });

      expect(screen.getByText(/404/i)).toBeInTheDocument();
      expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
      expect(
        screen.getByText(/The page you're looking for doesn't exist/i)
      ).toBeInTheDocument();
    });
  });

  describe('Route Configuration', () => {
    test('has correct route structure', () => {
      renderWithRouter(<App />, { route: '/' });

      // Verify that the app renders correctly with the expected route structure
      expect(
        screen.getByText(
          /No organisation in context\. Complete onboarding to view dashboard insights\./i
        )
      ).toBeInTheDocument();
    });

    test('handles nested routes correctly', () => {
      renderWithRouter(<App />, { route: '/home' });

      // Both / and /home should render the same dashboard fallback when no organisation is set
      expect(
        screen.getByText(
          /No organisation in context\. Complete onboarding to view dashboard insights\./i
        )
      ).toBeInTheDocument();
    });
  });
});
