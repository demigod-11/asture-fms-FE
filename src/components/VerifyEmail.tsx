import React, { useState, useCallback, useEffect, useRef, useId } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import AuthPageHeader from '@/components/auth/AuthPageHeader';
import FormAlert from '@/components/auth/FormAlert';
import { useAuth } from '@/contexts/AuthContext';
import { verifyOtp, sendOtp } from '@/services/authApi';
import { setAccessToken } from '@/services/authStorage';

const RESEND_COOLDOWN_SEC = 60;
const DIGIT_COUNT = 6;

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeVerification, login, emailForVerification } = useAuth();
  const locationState = location.state as {
    email?: string;
    flow?: 'login' | 'signup';
    redirectTo?: string;
  } | null;
  const email = locationState?.email ?? emailForVerification ?? '';
  const isLoginFlow = locationState?.flow === 'login';
  const redirectTo = locationState?.redirectTo || '/home';

  const [error, setError] = useState('');
  const [resendSeconds, setResendSeconds] = useState(0);
  const [resending, setResending] = useState(false);
  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: DIGIT_COUNT }, () => '')
  );
  const [verifyingCode, setVerifyingCode] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const labelId = useId();
  const cooldownStarted = useRef(false);

  // Start resend cooldown when landing on page with email (so timer is visible)
  useEffect(() => {
    if (email && !cooldownStarted.current) {
      cooldownStarted.current = true;
      setResendSeconds(RESEND_COOLDOWN_SEC);
    }
  }, [email]);

  const handleResend = useCallback(async () => {
    if (!email) return;
    if (resendSeconds > 0 || resending) return;
    setResending(true);
    setError('');
    try {
      await sendOtp(email);
      setResendSeconds(RESEND_COOLDOWN_SEC);
    } catch {
      setError('Failed to resend. Try again later.');
    } finally {
      setResending(false);
    }
  }, [email, resendSeconds, resending]);

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const t = setInterval(() => setResendSeconds(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendSeconds]);

  const code = digits.join('');

  const setDigit = useCallback((index: number, value: string) => {
    const num = value.replace(/\D/g, '').slice(-1);
    setDigits(prev => {
      const next = [...prev];
      next[index] = num;
      return next;
    });
    if (num && index < DIGIT_COUNT - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleDigitKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        setDigits(prev => {
          const next = [...prev];
          next[index - 1] = '';
          return next;
        });
      }
    },
    [digits]
  );

  const handleDigitPaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, DIGIT_COUNT);
    if (!pasted) return;
    const arr = pasted.split('');
    const next = Array.from({ length: DIGIT_COUNT }, (_, i) => arr[i] ?? '');
    setDigits(next);
    const focusIndex = Math.min(pasted.length, DIGIT_COUNT - 1);
    inputRefs.current[focusIndex]?.focus();
  }, []);

  const handleVerifyByCode = useCallback(async () => {
    if (code.length !== DIGIT_COUNT || !email || verifyingCode) return;
    setVerifyingCode(true);
    setError('');
    verifyOtp(email, code)
      .then(res => {
        if (res?.data?.access_token) {
          setAccessToken(res.data.access_token);
          if (isLoginFlow) {
            login();
            navigate(redirectTo, { replace: true, state: { fromLogin: true } });
          } else {
            completeVerification();
            navigate('/onboarding/business', { replace: true });
          }
        } else {
          setError('Invalid or expired code. Request a new one below.');
          setVerifyingCode(false);
        }
      })
      .catch(() => {
        setError('Invalid or expired code. Request a new one below.');
        setVerifyingCode(false);
      });
  }, [
    code,
    email,
    verifyingCode,
    isLoginFlow,
    login,
    completeVerification,
    navigate,
  ]);

  return (
    <AuthLayout>
      <div className='w-full max-w-md space-y-8'>
        <AuthPageHeader
          title='Check your email'
          subtitle={
            email
              ? `We've sent a code to ${email}. Enter the 6-digit code below to verify.`
              : "We've sent a code to your email. Enter the 6-digit code to verify."
          }
          variant='icon'
          icon={
            <ShieldCheck className='h-8 w-8 text-primary-600 dark:text-primary-400' />
          }
        />
        {error && <FormAlert message={error} onClose={() => setError('')} />}
        {email && (
          <>
            <div className='space-y-3 text-center'>
              <label
                id={labelId}
                className='block text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight'
              >
                Enter your OTP
              </label>
              <div
                className='flex justify-center gap-2'
                role='group'
                aria-labelledby={labelId}
              >
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={el => {
                      inputRefs.current[i] = el;
                    }}
                    type='text'
                    inputMode='numeric'
                    autoComplete={i === 0 ? 'one-time-code' : 'off'}
                    maxLength={6}
                    value={d}
                    onChange={e => setDigit(i, e.target.value)}
                    onKeyDown={e => handleDigitKeyDown(i, e)}
                    onPaste={i === 0 ? handleDigitPaste : undefined}
                    className='w-11 h-12 text-center text-xl font-mono rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </div>
            </div>
            <button
              type='button'
              onClick={handleVerifyByCode}
              disabled={code.length !== DIGIT_COUNT || verifyingCode}
              className={
                code.length === DIGIT_COUNT && !verifyingCode
                  ? 'w-full btn-primary py-3 px-4 rounded-xl transition-colors'
                  : 'w-full flex items-center justify-center py-3 px-4 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 font-medium bg-white dark:bg-gray-800 transition-colors disabled:cursor-not-allowed disabled:opacity-70'
              }
            >
              {verifyingCode ? 'Verifying…' : 'Verify code'}
            </button>
          </>
        )}
        {email && (
          <div className='space-y-1'>
            <button
              type='button'
              onClick={handleResend}
              disabled={resending || resendSeconds > 0}
              className={
                resendSeconds === 0 && !resending
                  ? 'w-full flex items-center justify-center gap-2 py-2.5 btn-primary rounded-xl transition-colors'
                  : 'w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 font-medium bg-white dark:bg-gray-800 cursor-not-allowed transition-colors'
              }
            >
              <Mail className='h-4 w-4' />
              {resending ? 'Sending…' : 'Resend code'}
            </button>
            {resendSeconds > 0 && (
              <p className='text-center text-sm text-gray-500 dark:text-gray-400 mt-1'>
                You can request a new code in {resendSeconds} second
                {resendSeconds !== 1 ? 's' : ''}.
              </p>
            )}
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
