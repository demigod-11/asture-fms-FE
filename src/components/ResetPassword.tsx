import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import logo from '@/assets/logo.svg';
import errorIcon from '@/assets/error-icon.svg';

function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least 1 uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least 1 number';
  return null;
}

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pErr = validatePassword(password);
    const cErr =
      password !== confirmPassword
        ? 'Passwords do not match'
        : !confirmPassword
          ? 'Please confirm your password'
          : '';

    setPasswordError(pErr ?? '');
    setConfirmError(cErr);
    if (pErr || cErr) return;

    navigate('/login', { replace: true });
  };

  return (
    <AuthLayout>
      <div className='w-full max-w-md space-y-8'>
        <div className='flex justify-center'>
          <img src={logo} alt='TeddyEd' className='w-16 h-16' />
        </div>
        <div className='text-center space-y-2'>
          <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>
            Set new password
          </h1>
          <p className='text-sm text-gray-500'>
            {(location.state as { email?: string })?.email
              ? `Enter a new password for your account.`
              : 'Enter your new password below.'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='space-y-2'>
            <label htmlFor='password' className='form-label text-gray-900'>
              New password *
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
            {passwordError && (
              <p className='text-sm text-error-500 flex items-center gap-1'>
                <img src={errorIcon} alt='' className='h-4 w-4' />
                {passwordError}
              </p>
            )}
          </div>
          <div className='space-y-2'>
            <label htmlFor='confirmPassword' className='form-label text-gray-900'>
              Confirm password *
            </label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
              <input
                id='confirmPassword'
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmError(
                    e.target.value && e.target.value !== password ? 'Passwords do not match' : ''
                  );
                }}
                className={`input-field pl-10 pr-12 py-3.5 rounded-xl border ${
                  confirmError ? 'border-error-300' : 'border-gray-200'
                }`}
                placeholder='Confirm password'
              />
              <button
                type='button'
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
              </button>
            </div>
            {confirmError && (
              <p className='text-sm text-error-500 flex items-center gap-1'>
                <img src={errorIcon} alt='' className='h-4 w-4' />
                {confirmError}
              </p>
            )}
          </div>
          <button
            type='submit'
            className='w-full bg-[#073E60] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#052d47] focus:outline-none focus:ring-2 focus:ring-[#073E60] focus:ring-offset-2 transition-colors'
          >
            Reset password
          </button>
        </form>
        <p className='text-center text-sm text-gray-500'>
          <Link to='/login' className='font-medium text-[#073E60] underline hover:text-[#052d47]'>
            Back to login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
