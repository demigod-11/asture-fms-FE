import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FieldErrorProps {
  message: string;
}

/**
 * Inline field-level error shown under an input. Matches FormAlert styling
 * (light error background, icon) for a consistent auth flow feel.
 */
const FieldError: React.FC<FieldErrorProps> = ({ message }) => (
  <div
    role='alert'
    className='flex items-center gap-2 rounded-lg bg-error-50 px-2.5 py-2 text-sm text-error-700'
  >
    <AlertCircle className='h-4 w-4 shrink-0 text-error-500' aria-hidden />
    <span>{message}</span>
  </div>
);

export default FieldError;
