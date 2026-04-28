import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Info } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import AuthPageHeader from '@/components/auth/AuthPageHeader';
import FieldError from '@/components/auth/FieldError';
import FormAlert from '@/components/auth/FormAlert';
import { useAuth } from '@/contexts/AuthContext';
import { signUp, sendOtp } from '@/services/authApi';
import { getApiErrorMessage } from '@/utils/apiError';

const PASSWORD_HINT =
  'Must contain 1 Uppercase, 1 number, mini. of 8 characters.';

function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password))
    return 'Password must contain at least 1 uppercase letter';
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
    setFormError('');
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

    setSubmitting(true);
    try {
      // 1. Create user (POST /users/). Only on successful 201 Created do we send OTP.
      const { data: createData, status } = await signUp({
        email: email.trim(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        timezone: 'UTC',
      });
      if (status !== 201 || !createData?.success || !createData?.data) {
        setFormError(
          getApiErrorMessage(null, 'Registration failed. Please try again.')
        );
        return;
      }
      // 2. User created (201); send OTP for verification.
      setEmailForVerification(email.trim());
      await sendOtp(email.trim());
      navigate('/otp', { state: { email: email.trim(), flow: 'signup' } });
    } catch (err: unknown) {
      setFormError(
        getApiErrorMessage(err, 'Registration failed. Please try again.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className='w-full max-w-md space-y-8'>
        <AuthPageHeader
          title='Create a new account'
          subtitle='Enter your details to register with Asture.'
          variant='logo'
        />
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
                  onChange={e => {
                    setFirstName(e.target.value);
                    if (firstNameError) setFirstNameError('');
                  }}
                  className={`input-field pl-10 py-3.5 rounded-xl ${
                    firstNameError ? '!border-error-300' : ''
                  }`}
                  placeholder='John'
                />
              </div>
              {firstNameError && <FieldError message={firstNameError} />}
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
                  onChange={e => {
                    setLastName(e.target.value);
                    if (lastNameError) setLastNameError('');
                  }}
                  className={`input-field pl-10 py-3.5 rounded-xl ${
                    lastNameError ? '!border-error-300' : ''
                  }`}
                  placeholder='Doe'
                />
              </div>
              {lastNameError && <FieldError message={lastNameError} />}
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
                onChange={e => {
                  setEmail(e.target.value);
                  setEmailError(validateEmail(e.target.value));
                }}
                className={`input-field pl-10 py-3.5 rounded-xl ${
                  emailError ? '!border-error-300' : ''
                }`}
                placeholder='hello@johndoe.com'
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
            <p className='text-xs text-gray-500 flex items-center gap-1'>
              <Info className='h-3.5 w-3.5 shrink-0' />
              {PASSWORD_HINT}
            </p>
            {passwordError && <FieldError message={passwordError} />}
          </div>
          {formError && (
            <FormAlert message={formError} onClose={() => setFormError('')} />
          )}
          <button
            type='submit'
            disabled={submitting}
            className='w-full bg-[#073E60] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#052d47] focus:outline-none focus:ring-2 focus:ring-[#073E60] focus:ring-offset-2 disabled:opacity-70 transition-colors'
          >
            {submitting ? 'Creating account…' : 'Register'}
          </button>
        </form>
        <p className='text-center text-sm text-gray-500 dark:text-gray-400'>
          Already have an account?{' '}
          <Link to='/login' className='auth-link'>
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
