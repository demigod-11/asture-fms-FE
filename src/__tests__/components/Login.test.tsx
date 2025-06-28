import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../components/Login';

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
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Render', () => {
    test('renders login form with all required elements', () => {
      renderWithRouter(<Login />);

      // Check main elements
      expect(screen.getByText(/Login to your account/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Enter your details to continue/i)
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Login/i })
      ).toBeInTheDocument();
    });

    test('renders logo and branding elements', () => {
      renderWithRouter(<Login />);

      expect(screen.getByAltText(/AstureFMS Logo/i)).toBeInTheDocument();
      expect(
        screen.getByText(/AstureFMS © 2025 All Rights Reserved/i)
      ).toBeInTheDocument();
    });

    test('renders navigation links', () => {
      renderWithRouter(<Login />);

      expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
      expect(screen.getByText(/Don't have an account/i)).toBeInTheDocument();
      expect(screen.getByText(/Create one/i)).toBeInTheDocument();
      expect(screen.getByText(/Terms of Service/i)).toBeInTheDocument();
    });

    test('password field is initially hidden', () => {
      renderWithRouter(<Login />);

      const passwordInput = screen.getByLabelText(/Password/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('form fields are initially empty', () => {
      renderWithRouter(<Login />);

      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);

      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
    });
  });

  describe('Form Validation', () => {
    test('shows error for invalid email format', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      const emailInput = screen.getByLabelText(/Email/i);
      await user.type(emailInput, 'invalid-email');

      expect(screen.getByText(/Email must contain @/i)).toBeInTheDocument();
    });

    test('shows error for email without domain', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      const emailInput = screen.getByLabelText(/Email/i);
      await user.type(emailInput, 'test@');

      expect(
        screen.getByText(/Email must contain a domain/i)
      ).toBeInTheDocument();
    });

    test('does not show error for empty email on clear, only after submit', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);
      const emailInput = screen.getByLabelText(/Email/i);
      const loginButton = screen.getByRole('button', { name: /Login/i });
      await user.type(emailInput, 'test');
      await user.clear(emailInput);
      // Should not show error yet
      expect(
        screen.queryByText(/Email cannot be blank/i)
      ).not.toBeInTheDocument();
      // Now submit
      await user.click(loginButton);
      expect(screen.getByText(/Email cannot be blank/i)).toBeInTheDocument();
    });

    test('does not show error for empty password on clear, only after submit', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);
      const passwordInput = screen.getByLabelText(/Password/i);
      const loginButton = screen.getByRole('button', { name: /Login/i });
      await user.type(passwordInput, 'test');
      await user.clear(passwordInput);
      // Should not show error yet
      expect(
        screen.queryByText(/Password cannot be blank/i)
      ).not.toBeInTheDocument();
      // Now submit
      await user.click(loginButton);
      expect(screen.getByText(/Password cannot be blank/i)).toBeInTheDocument();
    });
  });

  describe('Password Visibility Toggle', () => {
    test('toggles password visibility when eye icon is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      const passwordInput = screen.getByLabelText(/Password/i);
      // Find the toggle button by its position (last button before login button)
      const buttons = screen.getAllByRole('button');
      const toggleButton = buttons.find(button =>
        button.className.includes('absolute inset-y-0 right-0')
      );

      expect(toggleButton).toBeInTheDocument();

      // Initially password is hidden
      expect(passwordInput).toHaveAttribute('type', 'password');

      // Click to show password
      await user.click(toggleButton!);
      expect(passwordInput).toHaveAttribute('type', 'text');

      // Click to hide password again
      await user.click(toggleButton!);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Submission', () => {
    test('successful login navigates to home page', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const loginButton = screen.getByRole('button', { name: /Login/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(loginButton);

      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });

    test('login fails with invalid email', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const loginButton = screen.getByRole('button', { name: /Login/i });

      await user.type(emailInput, 'invalid-email');
      await user.type(passwordInput, 'password123');
      await user.click(loginButton);

      expect(screen.getByText(/Email must contain @/i)).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('login fails with empty password', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      const emailInput = screen.getByLabelText(/Email/i);
      const loginButton = screen.getByRole('button', { name: /Login/i });

      await user.type(emailInput, 'test@example.com');
      await user.click(loginButton);

      expect(screen.getByText(/Password cannot be blank/i)).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Auto-scrolling Content', () => {
    test('renders auto-scrolling slides on desktop', () => {
      renderWithRouter(<Login />);

      // Check for slide content
      expect(screen.getByText(/Comprehensive Dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/Add and manage your team/i)).toBeInTheDocument();
      expect(screen.getByText(/Simple payment solutions/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles very long email input', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      const emailInput = screen.getByLabelText(/Email/i);
      const longEmail = 'a'.repeat(100) + '@example.com';

      await user.type(emailInput, longEmail);
      expect(emailInput).toHaveValue(longEmail);
    });

    test('handles special characters in password', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      const passwordInput = screen.getByLabelText(/Password/i);
      const specialPassword = 'p@ssw0rd!@#$%^&*()';

      await user.type(passwordInput, specialPassword);
      expect(passwordInput).toHaveValue(specialPassword);
    });
  });

  describe('Accessibility', () => {
    test('has proper form labels and associations', () => {
      renderWithRouter(<Login />);

      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);

      expect(emailInput).toHaveAttribute('id', 'email');
      expect(passwordInput).toHaveAttribute('id', 'password');
    });

    test('has proper button roles and labels', () => {
      renderWithRouter(<Login />);

      const loginButton = screen.getByRole('button', { name: /Login/i });
      expect(loginButton).toBeInTheDocument();
    });

    test('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const loginButton = screen.getByRole('button', { name: /Login/i });

      // Tab through form elements
      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();

      // Password toggle button
      await user.tab();
      // Forgot Password link
      await user.tab();
      // Now Login button
      await user.tab();
      expect(loginButton).toHaveFocus();
    });
  });
});
