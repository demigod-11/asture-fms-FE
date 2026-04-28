import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import FormAlert from '@/components/auth/FormAlert';
import FieldError from '@/components/auth/FieldError';
import { useNotification } from '@/contexts/NotificationContext';
import logo from '@/assets/logo.svg';
import { resetPassword } from '@/services/authApi';
import { getApiErrorMessage } from '@/utils/apiError';

function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password))
    return 'Password must contain at least 1 uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least 1 number';
  return null;
}

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notify } = useNotification();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setToken(params.get('token') ?? '');
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
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
    setFormError('');
    if (pErr || cErr) return;
    if (!token.trim()) {
      setFormError('Invalid or missing reset link. Request a new one.');
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword({ token, new_password: password });
      notify({ variant: 'success', message: 'Password reset successfully.' });
      navigate('/login', { replace: true });
    } catch (err: unknown) {
      setFormError(
        getApiErrorMessage(err, 'Reset failed. The link may have expired.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className='w-full max-w-md space-y-8'>
        <div className='flex justify-center'>
          <img src={logo} alt='Asture FMS' className='w-16 h-16' />
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
                onChange={e => {
                  setPassword(e.target.value);
                  setPasswordError(validatePassword(e.target.value) ?? '');
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
          <div className='space-y-2'>
            <label
              htmlFor='confirmPassword'
              className='form-label text-gray-900'
            >
              Confirm password *
            </label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
              <input
                id='confirmPassword'
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  setConfirmError(
                    e.target.value && e.target.value !== password
                      ? 'Passwords do not match'
                      : ''
                  );
                }}
                className={`input-field pl-10 pr-12 py-3.5 rounded-xl ${
                  confirmError ? '!border-error-300' : ''
                }`}
                placeholder='Confirm password'
              />
              <button
                type='button'
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? (
                  <EyeOff className='h-5 w-5' />
                ) : (
                  <Eye className='h-5 w-5' />
                )}
              </button>
            </div>
            {confirmError && <FieldError message={confirmError} />}
            {formError && (
              <FormAlert message={formError} onClose={() => setFormError('')} />
            )}
          </div>
          <button
            type='submit'
            disabled={submitting || !token}
            className='w-full bg-[#073E60] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#052d47] focus:outline-none focus:ring-2 focus:ring-[#073E60] focus:ring-offset-2 disabled:opacity-70 transition-colors'
          >
            {submitting ? 'Resetting…' : 'Reset password'}
          </button>
        </form>
        <p className='text-center text-sm text-gray-500 dark:text-gray-400'>
          <Link to='/login' className='auth-link'>
            Back to login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
