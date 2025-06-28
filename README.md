# Asture Finance Management System (FMS)

A modern, scalable Finance Management System built with React, TypeScript, and Clean Architecture principles.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **Clean Architecture**: Separation of concerns with entities, use cases, presenters, and repositories
- **Type Safety**: Full TypeScript implementation with strict mode
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Testing**: Comprehensive test coverage with Jest and React Testing Library
- **CI/CD**: Automated deployment to staging and production via GitHub Actions
- **Code Quality**: ESLint, Prettier, and pre-commit hooks
- **Semantic Versioning**: Automated releases with semantic-release

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd asture-fms-FE
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:

   ```env
   VITE_API_URL=http://localhost:8000/api
   VITE_APP_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── entities/          # Core business logic and data models
├── presenters/        # Data formatting for UI
├── components/        # React UI components
├── interfaces/        # Type definitions and contracts
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
├── services/         # External service integrations
├── assets/           # Static assets (images, icons)
└── styles/           # Global styles and CSS
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- Tests are co-located with components or in `__tests__` folders
- Use `.test.tsx` or `.spec.tsx` extensions
- Follow the pattern: `ComponentName.test.tsx`

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run type-check       # Run TypeScript type checking

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
```

### Code Quality Standards

#### Commit Messages

Use semantic commit messages:

```bash
feat: add new transaction feature
fix: resolve budget calculation issue
docs: update README with new instructions
style: format code according to style guide
refactor: restructure user authentication
test: add tests for transaction validation
chore: update dependencies
```

#### Pre-commit Hooks

The following checks run automatically before each commit:

- ESLint linting
- Prettier formatting
- TypeScript type checking

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS with custom configuration:

```typescript
// Custom component classes
.btn-primary {
  @apply px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700;
}

.card {
  @apply bg-white rounded-lg shadow-soft border border-gray-200 p-6;
}
```

### Design System

- **Colors**: Primary brand color `#073E60`
- **Typography**: Inter font family with consistent sizing
- **Spacing**: Tailwind's spacing scale
- **Shadows**: Custom shadow variants for depth

## 🔒 Security

### Best Practices

- Environment variables for sensitive data
- Input validation with Zod
- XSS protection with React
- HTTPS enforcement in production
- Regular dependency updates

### Authentication

- JWT token-based authentication
- Token refresh mechanism
- Secure token storage
- Automatic logout on token expiration

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run test
   npm run lint
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Pull Request Guidelines

- Include tests for new features
- Update documentation if needed
- Follow the existing code style
- Ensure all CI checks pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

---

**Built with ❤️ by the Asture Team**
