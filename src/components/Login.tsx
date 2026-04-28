import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import AuthPageHeader from '@/components/auth/AuthPageHeader';
import FieldError from '@/components/auth/FieldError';
import FormAlert from '@/components/auth/FormAlert';
import { signIn } from '@/services/authApi';
import { getApiErrorMessage } from '@/utils/apiError';
import { consumeSessionExpiredFlag } from '@/services/authStorage';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (consumeSessionExpiredFlag()) {
      setFormError('Your session expired. Please sign in again.');
    }
  }, []);

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setEmailError('');
    setPasswordError('');
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    if (!isEmailValid || !isPasswordValid) return;
    setSubmitting(true);
    try {
      await signIn({ email: email.trim(), password });
      const from = (
        location.state as {
          from?: { pathname?: string; search?: string; hash?: string };
        } | null
      )?.from;
      const redirectTo = from?.pathname
        ? `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`
        : '/home';
      // 2FA: no token yet; go to OTP page. Token is issued only after verify-otp.
      navigate('/otp', {
        replace: true,
        state: { email: email.trim(), flow: 'login', redirectTo },
      });
    } catch (err: unknown) {
      setFormError(
        getApiErrorMessage(err, 'Sign in failed. Please try again.')
      );
    } finally {
      setSubmitting(false);
    }
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
                className={`input-field pl-10 pr-3 py-3.5 rounded-xl ${
                  emailError ? '!border-error-300' : ''
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
                className={`input-field pl-10 pr-12 py-3.5 rounded-xl ${
                  passwordError ? '!border-error-300' : ''
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
          {formError && (
            <FormAlert message={formError} onClose={() => setFormError('')} />
          )}
          <div className='flex justify-end'>
            <Link to='/forgot-password' className='auth-link text-sm'>
              Forgot Password?
            </Link>
          </div>
          <button
            type='submit'
            disabled={submitting}
            className='w-full bg-[#073E60] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#052d47] focus:outline-none focus:ring-2 focus:ring-[#073E60] focus:ring-offset-2 disabled:opacity-70 transition-colors'
          >
            {submitting ? 'Signing in…' : 'Login'}
          </button>
        </form>
        <p className='text-center text-sm text-gray-500 dark:text-gray-400'>
          Don&apos;t have an account?{' '}
          <Link to='/signup' className='auth-link'>
            Create one
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
