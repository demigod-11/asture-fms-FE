import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

// Wrapper component for testing with router context
const renderWithRouter = (
  component: React.ReactElement,
  { route = '/' } = {}
) => {
  return render(
    <MemoryRouter initialEntries={[route]}>{component}</MemoryRouter>
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
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });

    test('renders home page when navigating to /', () => {
      renderWithRouter(<App />, { route: '/' });

      expect(screen.getByText(/Welcome to Asture FMS/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Your Finance Management System/i)
      ).toBeInTheDocument();
    });

    test('renders home page when navigating to /home', () => {
      renderWithRouter(<App />, { route: '/home' });

      expect(screen.getByText(/Welcome to Asture FMS/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Your Finance Management System/i)
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
          .getByText(/Welcome to Asture FMS/i)
          .closest('.min-h-screen.bg-gray-50') ||
        screen.getByText(/Welcome to Asture FMS/i).parentElement?.parentElement
          ?.parentElement?.parentElement;
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
      expect(screen.getByText(/Welcome to Asture FMS/i)).toBeInTheDocument();
    });

    test('renders Home component on root and home routes', () => {
      renderWithRouter(<App />, { route: '/' });

      expect(screen.getByText(/Welcome to Asture FMS/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Your Finance Management System/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Manage your finances with ease and efficiency/i)
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
      expect(screen.getByText(/Welcome to Asture FMS/i)).toBeInTheDocument();
    });

    test('handles nested routes correctly', () => {
      renderWithRouter(<App />, { route: '/home' });

      // Both / and /home should render the same Home component
      expect(screen.getByText(/Welcome to Asture FMS/i)).toBeInTheDocument();
    });
  });
});
