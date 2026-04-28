import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { acceptInvitation } from '@/services/invitationsApi';

const AcceptInvitationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing invitation link.');
      return;
    }
    setStatus('loading');
    acceptInvitation(token)
      .then(() => {
        setStatus('success');
        setMessage('Invitation accepted. Redirecting…');
        setTimeout(() => navigate('/', { replace: true }), 2000);
      })
      .catch(() => {
        setStatus('error');
        setMessage('Failed to accept invitation. The link may have expired.');
      });
  }, [token, navigate]);

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 p-8 text-center'>
        {status === 'loading' && (
          <p className='text-gray-700 dark:text-gray-300'>
            Accepting invitation…
          </p>
        )}
        {status === 'success' && (
          <p className='text-green-600 dark:text-green-400'>{message}</p>
        )}
        {status === 'error' && (
          <>
            <p className='text-red-600 dark:text-red-400 mb-4'>{message}</p>
            <button
              type='button'
              onClick={() => navigate('/login', { replace: true })}
              className='px-4 py-2 text-sm font-medium text-white bg-[#073E60] rounded-xl'
            >
              Go to login
            </button>
          </>
        )}
        {status === 'idle' && !token && (
          <p className='text-gray-600 dark:text-gray-400'>
            No invitation token provided.
          </p>
        )}
      </div>
    </div>
  );
};

export default AcceptInvitationPage;
