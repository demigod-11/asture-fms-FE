import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import logo from '@/assets/logo.svg';
import errorIcon from '@/assets/error-icon.svg';
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
        <div className='flex justify-center'>
          <img src={logo} alt='TeddyEd' className='w-16 h-16' />
        </div>
        <div className='text-center space-y-2'>
          <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>
            Login to your account
          </h1>
          <p className='text-sm text-gray-500'>
            Enter your details to continue
          </p>
        </div>
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                className={`input-field pl-10 pr-3 py-3.5 rounded-xl border focus:ring-2 focus:ring-[#073E60] focus:border-transparent ${
                  emailError ? 'border-error-300' : 'border-gray-200'
                }`}
                placeholder='hello@teddyed.com'
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
                name='password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
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
                {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
              </button>
            </div>
            {passwordError && (
              <p className='text-sm text-error-500 flex items-center gap-1'>
                <img src={errorIcon} alt='' className='h-4 w-4' />
                {passwordError}
              </p>
            )}
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
          <Link to='/signup' className='font-medium text-[#073E60] underline hover:text-[#052d47]'>
            Create one
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
