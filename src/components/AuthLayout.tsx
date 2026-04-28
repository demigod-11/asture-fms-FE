import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import shape38 from '@/assets/shape-38.svg';
import shape84 from '@/assets/shape-84.svg';
import shape76 from '@/assets/shape-76.svg';
import { useTheme } from '@/contexts/ThemeContext';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const SLIDES = [
  {
    title: 'Comprehensive Dashboard',
    description:
      'Easily monitor overall financial status, track recent transactions, and access important alerts all in one place.',
  },
  {
    title: 'Add and manage your team',
    description:
      'Share the workload. Invite teammates and manage their permissions with just a few clicks.',
  },
  {
    title: 'Simple payment solutions',
    description:
      'We provide a platform for individuals and businesses to manage their international currency needs efficiently and effectively.',
  },
];

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 flex flex-col lg:flex-row'>
      <div className='flex-1 flex flex-col lg:w-1/2'>
        <div className='flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8'>
          <div className='w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-8 sm:p-10 shadow-card border border-gray-200/60 dark:border-gray-700'>
            {children}
          </div>
        </div>
        <footer className='py-4 px-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80'>
          <div className='flex justify-between items-center text-sm text-gray-500 dark:text-gray-300'>
            <span>Asture FMS © 2026 All Rights Reserved.</span>
            <div className='flex items-center gap-3'>
              <button
                type='button'
                onClick={toggleTheme}
                className='p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors'
                aria-label={
                  theme === 'dark'
                    ? 'Switch to light mode'
                    : 'Switch to dark mode'
                }
              >
                {theme === 'dark' ? (
                  <Sun className='h-4 w-4' />
                ) : (
                  <Moon className='h-4 w-4' />
                )}
              </button>
              <a
                href='/terms'
                className='hover:text-gray-700 dark:hover:text-gray-100 transition-colors duration-200'
              >
                Terms of Service
              </a>
            </div>
          </div>
        </footer>
      </div>
      <div className='hidden lg:flex lg:w-[640px] lg:h-screen relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-[#007DFC] via-[#0692FF] to-[#D6F3FF]' />
        <div className='absolute top-0 left-0'>
          <img
            src={shape38}
            alt=''
            className='w-[218px] h-[335px] opacity-40'
          />
        </div>
        <div className='absolute top-0 right-0'>
          <img
            src={shape84}
            alt=''
            className='w-[257px] h-[213px] opacity-40'
          />
        </div>
        <div className='absolute top-1/3 right-8'>
          <img
            src={shape76}
            alt=''
            className='w-[327px] h-[210px] opacity-40'
          />
        </div>
        <div className='relative z-10 flex items-center justify-center w-full h-full px-8'>
          <div className='w-full max-w-[404px]'>
            <div className='relative h-[128px] overflow-hidden'>
              {SLIDES.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-500 ease-in-out ${
                    index === currentSlide
                      ? 'opacity-100 translate-x-0'
                      : index < currentSlide
                        ? 'opacity-0 -translate-x-full'
                        : 'opacity-0 translate-x-full'
                  }`}
                >
                  <h2 className='text-3xl font-semibold text-white mb-1 leading-[40px] tracking-[-0.32px]'>
                    {slide.title}
                  </h2>
                  <p className='text-sm text-white leading-[20px] tracking-[-0.084px] opacity-90 max-w-[404px]'>
                    {slide.description}
                  </p>
                </div>
              ))}
            </div>
            <div
              className='flex justify-center items-center gap-1.5 mt-10'
              role='tablist'
              aria-label='Promo slides'
            >
              {SLIDES.map((_, index) => (
                <button
                  key={index}
                  type='button'
                  onClick={() => setCurrentSlide(index)}
                  role='tab'
                  aria-selected={index === currentSlide}
                  aria-label={`Slide ${index + 1} of ${SLIDES.length}`}
                  className={`rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                    index === currentSlide
                      ? 'w-4 h-1 bg-[#073E60]'
                      : 'w-1 h-1 bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
