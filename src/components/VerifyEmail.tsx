import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';

const CODE_LENGTH = 5;
const RESEND_COOLDOWN_SEC = 30;

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeVerification, emailForVerification } = useAuth();
  const email = (location.state as { email?: string })?.email ?? emailForVerification ?? 'johndoe@example.com';

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [resendSeconds, setResendSeconds] = useState(0);

  const focusInput = useCallback((index: number) => {
    const id = `verify-${index}`;
    document.getElementById(id)?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, CODE_LENGTH).split('');
      const next = [...code];
      digits.forEach((d, i) => {
        if (index + i < CODE_LENGTH) next[index + i] = d;
      });
      setCode(next);
      const nextEmpty = next.findIndex((c) => !c);
      if (nextEmpty !== -1) focusInput(nextEmpty);
      else focusInput(CODE_LENGTH - 1);
      return;
    }
    const next = [...code];
    next[index] = value.replace(/\D/g, '').slice(-1);
    setCode(next);
    if (value && index < CODE_LENGTH - 1) focusInput(index + 1);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      focusInput(index - 1);
      setCode((prev) => {
        const n = [...prev];
        n[index - 1] = '';
        return n;
      });
    }
  };

  const handleContinue = () => {
    const fullCode = code.join('');
    if (fullCode.length !== CODE_LENGTH) return;
    completeVerification();
    navigate('/home', { replace: true });
  };

  const handleResend = () => {
    if (resendSeconds > 0) return;
    setResendSeconds(RESEND_COOLDOWN_SEC);
  };

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const t = setInterval(() => setResendSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendSeconds]);

  const fullCode = code.join('');
  const canContinue = fullCode.length === CODE_LENGTH;

  return (
    <AuthLayout>
      <div className='w-full max-w-md space-y-8'>
        <div className='flex justify-center'>
          <span className='flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary-200 bg-primary-50'>
            <ShieldCheck className='h-8 w-8 text-primary-600' />
          </span>
        </div>
        <div className='text-center space-y-2'>
          <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>
            Enter your verification code
          </h1>
          <p className='text-sm text-gray-500'>
            We have sent a code to {email}
          </p>
        </div>
        <div className='flex justify-center gap-2'>
          {code.map((digit, index) => (
            <input
              key={index}
              id={`verify-${index}`}
              type='text'
              inputMode='numeric'
              maxLength={CODE_LENGTH}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className='w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073E60] focus:border-[#073E60]'
            />
          ))}
        </div>
        <button
          type='button'
          onClick={handleContinue}
          disabled={!canContinue}
          className='w-full bg-[#073E60] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#052d47] focus:outline-none focus:ring-2 focus:ring-[#073E60] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        >
          Continue
        </button>
        <button
          type='button'
          onClick={handleResend}
          disabled={resendSeconds > 0}
          className='w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        >
          <Mail className='h-4 w-4' />
          Resend code {resendSeconds > 0 ? `(${String(Math.floor(resendSeconds / 60)).padStart(1, '0')}:${String(resendSeconds % 60).padStart(2, '0')})` : ''}
        </button>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
