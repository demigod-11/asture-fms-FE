import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Info } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import logo from '@/assets/logo.svg';
import errorIcon from '@/assets/error-icon.svg';
import { useAuth } from '@/contexts/AuthContext';

const PASSWORD_HINT =
  'Must contain 1 Uppercase, 1 number, mini. of 8 characters.';

function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least 1 uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least 1 number';
  return null;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { setEmailForVerification } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Email cannot be blank';
    if (!value.includes('@')) return 'Email must contain @';
    if (!value.includes('.')) return 'Email must contain a domain';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');

    const firstErr = !firstName.trim() ? 'First name is required' : '';
    const lastErr = !lastName.trim() ? 'Last name is required' : '';
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setFirstNameError(firstErr);
    setLastNameError(lastErr);
    setEmailError(emailErr);
    setPasswordError(passwordErr ?? '');

    if (firstErr || lastErr || emailErr || passwordErr) return;

    setEmailForVerification(email);
    navigate('/verify-email', { state: { email } });
  };

  return (
    <AuthLayout>
      <div className='w-full max-w-md space-y-8'>
        <div className='flex justify-center'>
          <img src={logo} alt='TeddyEd' className='w-16 h-16' />
        </div>
        <div className='text-center space-y-2'>
          <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>
            Create a new account
          </h1>
          <p className='text-sm text-gray-500'>
            Enter your details to register with Asture.
          </p>
        </div>
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <label htmlFor='firstName' className='form-label text-gray-900'>
                First name *
              </label>
              <div className='relative'>
                <User className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                <input
                  id='firstName'
                  type='text'
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (firstNameError) setFirstNameError('');
                  }}
                  className={`input-field pl-10 py-3.5 rounded-xl border ${
                    firstNameError ? 'border-error-300' : 'border-gray-200'
                  }`}
                  placeholder='John'
                />
              </div>
              {firstNameError && (
                <p className='text-sm text-error-500 flex items-center gap-1'>
                  <img src={errorIcon} alt='' className='h-4 w-4' />
                  {firstNameError}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <label htmlFor='lastName' className='form-label text-gray-900'>
                Last name *
              </label>
              <div className='relative'>
                <User className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                <input
                  id='lastName'
                  type='text'
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (lastNameError) setLastNameError('');
                  }}
                  className={`input-field pl-10 py-3.5 rounded-xl border ${
                    lastNameError ? 'border-error-300' : 'border-gray-200'
                  }`}
                  placeholder='Doe'
                />
              </div>
              {lastNameError && (
                <p className='text-sm text-error-500 flex items-center gap-1'>
                  <img src={errorIcon} alt='' className='h-4 w-4' />
                  {lastNameError}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <label htmlFor='email' className='form-label text-gray-900'>
              Email *
            </label>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
              <input
                id='email'
                type='email'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(validateEmail(e.target.value));
                }}
                className={`input-field pl-10 py-3.5 rounded-xl border ${
                  emailError ? 'border-error-300' : 'border-gray-200'
                }`}
                placeholder='hello@johndoe.com'
              />
            </div>
            {emailError && (
              <p className='text-sm text-error-500 flex items-center gap-1'>
                <img src={errorIcon} alt='' className='h-4 w-4' />
                {emailError}
              </p>
            )}
          </div>
          <div className='space-y-2'>
            <label htmlFor='password' className='form-label text-gray-900'>
              Password *
            </label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(validatePassword(e.target.value) ?? '');
                }}
                className={`input-field pl-10 pr-12 py-3.5 rounded-xl border ${
                  passwordError ? 'border-error-300' : 'border-gray-200'
                }`}
                placeholder='Enter password (mini. of 8 characters)'
              />
              <button
                type='button'
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
              </button>
            </div>
            <p className='text-xs text-gray-500 flex items-center gap-1'>
              <Info className='h-3.5 w-3.5 shrink-0' />
              {PASSWORD_HINT}
            </p>
            {passwordError && (
              <p className='text-sm text-error-500 flex items-center gap-1'>
                <img src={errorIcon} alt='' className='h-4 w-4' />
                {passwordError}
              </p>
            )}
          </div>
          <button
            type='submit'
            className='w-full bg-[#073E60] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#052d47] focus:outline-none focus:ring-2 focus:ring-[#073E60] focus:ring-offset-2 transition-colors'
          >
            Register
          </button>
        </form>
        <p className='text-center text-sm text-gray-500'>
          Already have an account?{' '}
          <Link to='/login' className='font-medium text-[#073E60] underline hover:text-[#052d47]'>
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
