import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import logo from '@/assets/logo.svg';
import errorIcon from '@/assets/error-icon.svg';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Email cannot be blank';
    if (!value.includes('@')) return 'Email must contain @';
    if (!value.includes('.')) return 'Email must contain a domain';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    setError(err);
    if (err) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AuthLayout>
        <div className='w-full max-w-md space-y-8 text-center'>
          <div className='flex justify-center'>
            <img src={logo} alt='Asture FMS' className='w-16 h-16' />
          </div>
          <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>
            Check your email
          </h1>
          <p className='text-sm text-gray-500'>
            We&apos;ve sent a password reset link to <strong>{email}</strong>.
            Click the link in the email to set a new password.
          </p>
          <Link
            to='/login'
            className='inline-block text-center text-sm font-medium text-[#073E60] underline hover:text-[#052d47]'
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
          <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>
            Forgot password?
          </h1>
          <p className='text-sm text-gray-500'>
            Enter your email and we&apos;ll send you a link to reset your
            password.
          </p>
        </div>
        <form onSubmit={handleSubmit} className='space-y-5'>
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
                onChange={e => setEmail(e.target.value)}
                className={`input-field pl-10 py-3.5 rounded-xl border ${
                  error ? 'border-error-300' : 'border-gray-200'
                }`}
                placeholder='hello@teddyed.com'
              />
            </div>
            {error && (
              <p className='text-sm text-error-500 flex items-center gap-1'>
                <img src={errorIcon} alt='' className='h-4 w-4' />
                {error}
              </p>
            )}
          </div>
          <button
            type='submit'
            className='w-full bg-[#073E60] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#052d47] focus:outline-none focus:ring-2 focus:ring-[#073E60] focus:ring-offset-2 transition-colors'
          >
            Send reset link
          </button>
        </form>
        <p className='text-center text-sm text-gray-500'>
          <Link
            to='/login'
            className='font-medium text-[#073E60] underline hover:text-[#052d47]'
          >
            Back to login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
