import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import FormAlert from '@/components/auth/FormAlert';
import FieldError from '@/components/auth/FieldError';
import logo from '@/assets/logo.svg';
import { forgotPassword } from '@/services/authApi';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Email cannot be blank';
    if (!value.includes('@')) return 'Email must contain @';
    if (!value.includes('.')) return 'Email must contain a domain';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    setError(err);
    setFormError('');
    if (err) return;
    setSubmitting(true);
    try {
      await forgotPassword(email.trim());
      setSubmitted(true);
    } catch {
      setFormError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <AuthLayout>
        <div className='w-full max-w-md space-y-8 text-center'>
          <div className='flex justify-center'>
            <img src={logo} alt='Asture FMS' className='w-16 h-16' />
          </div>
          <h1 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight'>
            Check your email
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-300'>
            We&apos;ve sent a password reset link to{' '}
            <strong className='text-gray-700 dark:text-gray-200'>
              {email}
            </strong>
            . Click the link in the email to set a new password.
          </p>
          <Link
            to='/login'
            className='auth-link inline-block text-center text-sm'
          >
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className='w-full max-w-md space-y-8'>
        <div className='flex justify-center'>
          <img src={logo} alt='Asture FMS' className='w-16 h-16' />
        </div>
        <div className='text-center space-y-2'>
          <h1 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight'>
            Forgot password?
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-300'>
            Enter your email and we&apos;ll send you a link to reset your
            password.
          </p>
        </div>
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='space-y-2'>
            <label
              htmlFor='email'
              className='form-label text-gray-900 dark:text-gray-200'
            >
              Email *
            </label>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
              <input
                id='email'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`input-field pl-10 py-3.5 rounded-xl ${
                  error ? '!border-error-300' : ''
                }`}
                placeholder='hello@teddyed.com'
              />
            </div>
            {error && <FieldError message={error} />}
            {formError && (
              <FormAlert message={formError} onClose={() => setFormError('')} />
            )}
          </div>
          <button
            type='submit'
            disabled={submitting}
            className='w-full bg-[#073E60] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#052d47] focus:outline-none focus:ring-2 focus:ring-[#073E60] focus:ring-offset-2 disabled:opacity-70 transition-colors'
          >
            {submitting ? 'Sending…' : 'Send reset link'}
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

export default ForgotPassword;
