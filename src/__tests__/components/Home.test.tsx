/// <reference types="jest" />
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Home from '../../components/Home';

// Wrapper component for testing with router context
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Home Component', () => {
  test('renders home component with all required elements', () => {
    renderWithRouter(<Home />);

    // Check main heading
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Welcome to Asture FMS/i)).toBeInTheDocument();

    // Check subtitle
    expect(
      screen.getByText(/Your Finance Management System/i)
    ).toBeInTheDocument();

    // Check description
    expect(
      screen.getByText(/Manage your finances with ease and efficiency/i)
    ).toBeInTheDocument();
  });

  test('has proper semantic structure', () => {
    renderWithRouter(<Home />);

    // Check that the main container is a div
    const container = screen.getByText(/Welcome to Asture FMS/i).closest('div');
    expect(container).toHaveClass('text-center');
  });

  test('renders all text content correctly', () => {
    renderWithRouter(<Home />);

    const expectedTexts = [
      'Welcome to Asture FMS',
      'Your Finance Management System',
      'Manage your finances with ease and efficiency.',
    ];

    expectedTexts.forEach(text => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  test('has proper CSS classes for styling', () => {
    renderWithRouter(<Home />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass(
      'text-4xl',
      'font-bold',
      'text-gray-900',
      'mb-4'
    );

    const subtitle = screen.getByText(/Your Finance Management System/i);
    expect(subtitle).toHaveClass('text-xl', 'text-gray-600', 'mb-6');

    const description = screen.getByText(
      /Manage your finances with ease and efficiency/i
    );
    expect(description).toHaveClass('text-gray-500');
  });

  test('component is accessible', () => {
    renderWithRouter(<Home />);

    // Check for proper heading hierarchy
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();

    // Check that text is readable (no empty content)
    expect(heading.textContent).toBeTruthy();
  });

  test('renders consistently across multiple renders', () => {
    const { rerender } = renderWithRouter(<Home />);

    // First render
    expect(screen.getByText(/Welcome to Asture FMS/i)).toBeInTheDocument();

    // Re-render
    rerender(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Should still render the same content
    expect(screen.getByText(/Welcome to Asture FMS/i)).toBeInTheDocument();
  });

  test('handles component unmounting gracefully', () => {
    const { unmount } = renderWithRouter(<Home />);

    expect(screen.getByText(/Welcome to Asture FMS/i)).toBeInTheDocument();

    // Unmount should not throw errors
    expect(() => unmount()).not.toThrow();
  });
});
