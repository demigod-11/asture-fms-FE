import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import logo from '@/assets/logo.svg';
import shape38 from '@/assets/shape-38.svg';
import shape84 from '@/assets/shape-84.svg';
import shape76 from '@/assets/shape-76.svg';
import errorIcon from '@/assets/error-icon.svg';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Auto-scrolling text content from Figma design
  const slides = [
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
        'We provide platform for individuals and businesses to manage their international currency needs efficiently and effectively.',
    },
  ];

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 8000); // Change slide every 8 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      setEmailError('Email cannot be blank');
      return false;
    }
    if (!email.includes('@')) {
      setEmailError('Email must contain @');
      return false;
    }
    if (!email.includes('.')) {
      setEmailError('Email must contain a domain');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password.trim()) {
      setPasswordError('Password cannot be blank');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value.trim()) {
      validateEmail(value);
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value.trim()) {
      validatePassword(value);
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = () => {
    // Clear previous errors
    setEmailError('');
    setPasswordError('');

    // Validate both fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return; // Stop if validation fails
    }

    // Simple login success method
    const isSuccessful = true; // This will be replaced with actual API call later

    if (isSuccessful) {
      navigate('/home');
    }
  };

  return (
    <div className='min-h-screen bg-white flex flex-col lg:flex-row'>
      {/* Login Form Section - Full width on mobile, half on desktop */}
      <div className='flex-1 flex flex-col lg:w-1/2'>
        {/* Form Container - Centered */}
        <div className='flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8'>
          <div className='w-full max-w-md space-y-8'>
            {/* Logo */}
            <div className='flex justify-center mb-8'>
              <img src={logo} alt='AstureFMS Logo' className='w-16 h-16' />
            </div>

            {/* Header */}
            <div className='text-center space-y-2'>
              <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>
                Login to your account
              </h1>
              <p className='text-sm text-gray-500'>
                Enter your details to continue
              </p>
            </div>

            {/* Divider */}
            <div className='border-t border-gray-200'></div>

            {/* Login Form */}
            <div className='space-y-6'>
              {/* Email Field */}
              <div className='space-y-2'>
                <div className='flex items-center space-x-1'>
                  <label
                    htmlFor='email'
                    className='text-sm font-medium text-gray-900'
                  >
                    Email
                  </label>
                </div>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Mail className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    value={email}
                    onChange={handleEmailChange}
                    className={`block w-full pl-10 pr-3 py-3.5 border rounded-xl bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#073E60] focus:border-transparent shadow-sm transition-all duration-200 ${
                      emailError
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-200'
                    }`}
                    placeholder='hello@asturefms.com'
                  />
                </div>
                {emailError && (
                  <p className='text-sm text-red-500 mt-1 flex items-center'>
                    <img
                      src={errorIcon}
                      alt=''
                      className='h-4 w-4 mr-1 flex-shrink-0'
                    />
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className='space-y-2'>
                <div className='flex items-center space-x-1'>
                  <label
                    htmlFor='password'
                    className='text-sm font-medium text-gray-900'
                  >
                    Password
                  </label>
                </div>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Lock className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    className={`block w-full pl-10 pr-12 py-3.5 border rounded-xl bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#073E60] focus:border-transparent shadow-sm transition-all duration-200 ${
                      passwordError
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-200'
                    }`}
                    placeholder='Enter password'
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className='h-5 w-5' />
                    ) : (
                      <Eye className='h-5 w-5' />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className='text-sm text-red-500 mt-1 flex items-center'>
                    <img
                      src={errorIcon}
                      alt=''
                      className='h-4 w-4 mr-1 flex-shrink-0'
                    />
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Forgot Password */}
              <div className='flex justify-end'>
                <Link
                  to='/forgot-password'
                  className='text-sm font-medium text-gray-500 underline hover:text-gray-700 transition-colors duration-200'
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type='button'
                onClick={handleLogin}
                className='w-full bg-[#073E60] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#052d47] focus:outline-none focus:ring-2 focus:ring-[#073E60] focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              >
                Login
              </button>

              {/* Sign Up Link */}
              <div className='text-center'>
                <span className='text-sm text-gray-500'>
                  Don&apos;t have an account?{' '}
                </span>
                <Link
                  to='/signup'
                  className='text-sm font-medium text-[#073E60] underline hover:text-[#052d47] transition-colors duration-200'
                >
                  Create one
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Desktop and Mobile */}
        <div className='py-4 px-6 border-t border-gray-200 bg-gray-50'>
          <div className='flex justify-between items-center text-sm text-gray-500'>
            <span>AstureFMS © 2025 All Rights Reserved.</span>
            <Link
              to='/terms'
              className='hover:text-gray-700 transition-colors duration-200'
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Auto-scrolling Text Section - Web Only */}
      <div className='hidden lg:flex lg:w-[640px] lg:h-screen relative overflow-hidden'>
        {/* Background Gradient */}
        <div className='absolute inset-0 bg-gradient-to-b from-[#007DFC] via-[#0692FF] to-[#D6F3FF]'></div>

        {/* Decorative Shapes - Exact Figma positioning */}
        {/* Shape 38 - Top left gradient shape */}
        <div className='absolute top-0 left-0'>
          <img
            src={shape38}
            alt=''
            className='w-[218px] h-[335px] opacity-40'
          />
        </div>

        {/* Shape 84 - Top right gradient shape */}
        <div className='absolute top-0 right-0'>
          <img
            src={shape84}
            alt=''
            className='w-[257px] h-[213px] opacity-40'
          />
        </div>

        {/* Shape 76 - Beside text content */}
        <div className='absolute top-1/3 right-8'>
          <img
            src={shape76}
            alt=''
            className='w-[327px] h-[210px] opacity-40'
          />
        </div>

        {/* Scrolling Content */}
        <div className='relative z-10 flex items-center justify-center w-full h-full px-8'>
          <div className='w-full max-w-[404px]'>
            {/* Slides Container */}
            <div className='relative h-[128px] overflow-hidden'>
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex flex-col items-center transition-all duration-500 ease-in-out ${
                    index === currentSlide
                      ? 'opacity-100 translate-x-0'
                      : index < currentSlide
                        ? 'opacity-0 -translate-x-full'
                        : 'opacity-0 translate-x-full'
                  }`}
                >
                  {/* Title */}
                  <h2 className='text-3xl font-semibold text-white text-center mb-1 leading-[40px] tracking-[-0.32px]'>
                    {slide.title}
                  </h2>

                  {/* Description */}
                  <p className='text-sm text-white text-center leading-[20px] tracking-[-0.084px] opacity-90 max-w-[404px]'>
                    {slide.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Navigation Dots */}
            <div className='flex justify-center items-center space-x-1.5 mt-10'>
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-1 h-1 rounded-full transition-all duration-200 ${
                    index === currentSlide ? 'w-4 bg-[#073E60]' : 'bg-white'
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

export default Login;
