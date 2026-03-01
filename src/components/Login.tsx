import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import AuthPageHeader from '@/components/auth/AuthPageHeader';
import FieldError from '@/components/auth/FieldError';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      setEmailError('Email cannot be blank');
      return false;
    }
    if (!value.includes('@')) {
      setEmailError('Email must contain @');
      return false;
    }
    if (!value.includes('.')) {
      setEmailError('Email must contain a domain');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value.trim()) {
      setPasswordError('Password cannot be blank');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    if (!isEmailValid || !isPasswordValid) return;
    login();
    navigate('/home', { replace: true });
  };

  return (
    <AuthLayout>
      <div className='w-full max-w-md space-y-8'>
        <AuthPageHeader
          title='Login to your account'
          subtitle='Enter your details to continue'
          variant='logo'
        />
        <form onSubmit={handleLogin} className='space-y-6'>
          <div className='space-y-2'>
            <label htmlFor='email' className='form-label text-gray-900'>
              Email *
            </label>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
              <input
                id='email'
                name='email'
                type='email'
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                className={`input-field pl-10 pr-3 py-3.5 rounded-xl border focus:ring-2 focus:ring-[#073E60] focus:border-transparent ${
                  emailError ? 'border-error-300' : 'border-gray-200'
                }`}
                placeholder='hello@teddyed.com'
              />
            </div>
            {emailError && <FieldError message={emailError} />}
          </div>
          <div className='space-y-2'>
            <label htmlFor='password' className='form-label text-gray-900'>
              Password *
            </label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
              <input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (passwordError) validatePassword(e.target.value);
                }}
                className={`input-field pl-10 pr-12 py-3.5 rounded-xl border focus:ring-2 focus:ring-[#073E60] focus:border-transparent ${
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
                {showPassword ? (
                  <EyeOff className='h-5 w-5' />
                ) : (
                  <Eye className='h-5 w-5' />
                )}
              </button>
            </div>
            {passwordError && <FieldError message={passwordError} />}
          </div>
          <div className='flex justify-end'>
            <Link
              to='/forgot-password'
              className='text-sm font-medium text-[#073E60] underline hover:text-[#052d47]'
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type='submit'
            className='w-full bg-[#073E60] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#052d47] focus:outline-none focus:ring-2 focus:ring-[#073E60] focus:ring-offset-2 transition-colors'
          >
            Login
          </button>
        </form>
        <p className='text-center text-sm text-gray-500'>
          Don&apos;t have an account?{' '}
          <Link
            to='/signup'
            className='font-medium text-[#073E60] underline hover:text-[#052d47]'
          >
            Create one
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
