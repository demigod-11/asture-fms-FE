import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className='text-center'>
      <h1 className='text-4xl font-bold text-gray-900 mb-4'>404</h1>
      <p className='text-xl text-gray-600 mb-6'>Page Not Found</p>
      <p className='text-gray-500 mb-8'>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        to='/'
        className='text-primary-600 hover:text-primary-800 underline'
      >
        Go back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
