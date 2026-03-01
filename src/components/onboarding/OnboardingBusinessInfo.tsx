import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Briefcase } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import AuthPageHeader from '@/components/auth/AuthPageHeader';
import FieldError from '@/components/auth/FieldError';

const BUSINESS_TYPES = [
  'Sole proprietorship',
  'Partnership',
  'Limited liability company (LLC)',
  'Private limited company',
  'Other',
];

const OnboardingBusinessInfo: React.FC = () => {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [address, setAddress] = useState('');
  const [industry, setIndustry] = useState('');
  const [businessNameError, setBusinessNameError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = !businessName.trim() ? 'Business name is required' : '';
    setBusinessNameError(err);
    if (err) return;
    navigate('/onboarding/start-trial', { replace: true });
  };

  return (
    <AuthLayout>
      <div className='w-full max-w-md space-y-8'>
        <AuthPageHeader
          title='Tell us about your business'
          subtitle='We use this to personalize your experience.'
          variant='logo'
        />
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='space-y-2'>
            <label htmlFor='business-name' className='form-label text-gray-900'>
              Business name <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <Building2 className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
              <input
                id='business-name'
                type='text'
                value={businessName}
                onChange={e => {
                  setBusinessName(e.target.value);
                  if (businessNameError) setBusinessNameError('');
                }}
                className={`input-field pl-10 py-3.5 rounded-xl border ${
                  businessNameError ? 'border-error-300' : 'border-gray-200'
                }`}
                placeholder='e.g. Acme Ltd'
              />
            </div>
            {businessNameError && <FieldError message={businessNameError} />}
          </div>
          <div className='space-y-2'>
            <label htmlFor='business-type' className='form-label text-gray-900'>
              Business type
            </label>
            <div className='relative'>
              <Briefcase className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none' />
              <select
                id='business-type'
                value={businessType}
                onChange={e => setBusinessType(e.target.value)}
                className='input-field pl-10 py-3.5 rounded-xl border border-gray-200 w-full appearance-none bg-white'
              >
                <option value=''>Select type</option>
                {BUSINESS_TYPES.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className='space-y-2'>
            <label htmlFor='industry' className='form-label text-gray-900'>
              Industry
            </label>
            <input
              id='industry'
              type='text'
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              className='input-field pl-3 py-3.5 rounded-xl border border-gray-200'
              placeholder='e.g. Retail, Consulting'
            />
          </div>
          <div className='space-y-2'>
            <label htmlFor='address' className='form-label text-gray-900'>
              Business address
            </label>
            <div className='relative'>
              <MapPin className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
              <textarea
                id='address'
                value={address}
                onChange={e => setAddress(e.target.value)}
                rows={2}
                className='input-field pl-10 py-3.5 rounded-xl border border-gray-200 w-full resize-none'
                placeholder='Street, city, country'
              />
            </div>
          </div>
          <button
            type='submit'
            className='w-full btn-primary py-3 px-4 rounded-xl'
          >
            Continue
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default OnboardingBusinessInfo;
