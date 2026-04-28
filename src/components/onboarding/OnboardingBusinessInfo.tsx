import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Briefcase,
  ChevronDown,
  Search,
  Check,
} from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import AuthPageHeader from '@/components/auth/AuthPageHeader';
import FieldError from '@/components/auth/FieldError';
import FormAlert from '@/components/auth/FormAlert';
import { useCountries } from '@/hooks/useCountries';
import { createOrganisation, getCurrentUserProfiles } from '@/services/authApi';
import { getApiErrorMessage } from '@/utils/apiError';
import { readProfileCache } from '@/contexts/ProfileContext';

const BUSINESS_TYPES = [
  'Sole proprietorship',
  'Partnership',
  'Limited liability company (LLC)',
  'Private limited company',
  'Other',
];

function slugFromName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

const OnboardingBusinessInfo: React.FC = () => {
  const navigate = useNavigate();
  const { countries } = useCountries();
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [country, setCountry] = useState('');
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countrySearchInputRef = useRef<HTMLInputElement>(null);
  const [address, setAddress] = useState('');
  const [industry, setIndustry] = useState('');
  const [businessNameError, setBusinessNameError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // If user already has a profile (organisation), go to dashboard; use cache first to avoid duplicate request after login
  useEffect(() => {
    const cached = readProfileCache();
    if (cached) {
      if (cached.profiles.length > 0) {
        navigate('/', { replace: true });
      }
      return;
    }
    getCurrentUserProfiles()
      .then(res => {
        const list = res?.data;
        if (Array.isArray(list) && list.length > 0) {
          navigate('/', { replace: true });
        }
      })
      .catch(() => {});
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = !businessName.trim() ? 'Business name is required' : '';
    setBusinessNameError(err);
    setFormError('');
    if (err) return;
    const name = businessName.trim();
    const slug = slugFromName(name) || 'my-organisation';
    setSubmitting(true);
    try {
      await createOrganisation({
        name,
        slug,
        ...(address.trim() && { description: address.trim() }),
        ...(country && { country: country }),
      });
      navigate('/onboarding/start-trial', { replace: true });
    } catch (err: unknown) {
      setFormError(
        getApiErrorMessage(
          err,
          'Could not create organisation. Please try again.'
        )
      );
    } finally {
      setSubmitting(false);
    }
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
          {formError && (
            <FormAlert message={formError} onClose={() => setFormError('')} />
          )}
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
            <label htmlFor='country' className='form-label text-gray-900'>
              Country
            </label>
            <div className='relative'>
              <button
                type='button'
                id='country'
                onClick={() => {
                  setCountryDropdownOpen(prev => {
                    if (!prev) {
                      setCountrySearch('');
                      setTimeout(
                        () => countrySearchInputRef.current?.focus(),
                        0
                      );
                    }
                    return !prev;
                  });
                }}
                className='input-field w-full pl-3 pr-10 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 flex items-center justify-between text-left bg-white dark:bg-gray-800'
              >
                <span
                  className={
                    country
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-500 dark:text-gray-400'
                  }
                >
                  {country
                    ? `${countries.find(c => c.code === country)?.flag ?? ''} ${countries.find(c => c.code === country)?.name ?? country}`
                    : 'Select country'}
                </span>
                <ChevronDown className='h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0' />
              </button>
              {countryDropdownOpen && (
                <div className='absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg py-1 max-h-60 overflow-hidden flex flex-col'>
                  <div className='p-2 border-b border-gray-100 dark:border-gray-700 shrink-0'>
                    <div className='relative'>
                      <Search
                        className='absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none'
                        aria-hidden
                      />
                      <input
                        ref={countrySearchInputRef}
                        type='text'
                        value={countrySearch}
                        onChange={e => setCountrySearch(e.target.value)}
                        onKeyDown={e => e.stopPropagation()}
                        placeholder='Search country...'
                        aria-label='Search country'
                        className='input-field w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400'
                      />
                    </div>
                  </div>
                  <div className='overflow-y-auto py-1 min-h-0'>
                    <button
                      type='button'
                      onClick={() => {
                        setCountry('');
                        setCountryDropdownOpen(false);
                        setCountrySearch('');
                      }}
                      className='w-full px-3 py-2 text-left text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2'
                    >
                      Select country
                    </button>
                    {(() => {
                      const q = countrySearch.trim().toLowerCase();
                      const filtered = q
                        ? countries.filter(
                            c =>
                              c.name.toLowerCase().includes(q) ||
                              c.code.toLowerCase().includes(q)
                          )
                        : countries;
                      return filtered.length > 0 ? (
                        filtered.map(c => {
                          const isSelected = country === c.code;
                          return (
                            <button
                              key={c.code}
                              type='button'
                              onClick={() => {
                                setCountry(c.code);
                                setCountryDropdownOpen(false);
                                setCountrySearch('');
                              }}
                              className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${
                                isSelected
                                  ? 'bg-brand-50 dark:bg-brand-900/40 text-brand-800 dark:text-brand-200'
                                  : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              <span
                                className='text-lg leading-none'
                                aria-hidden
                              >
                                {c.flag}
                              </span>
                              <span>{c.name}</span>
                              {isSelected && (
                                <Check
                                  className='ml-auto h-4 w-4'
                                  aria-hidden
                                />
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <p className='px-3 py-2 text-sm text-gray-500 dark:text-gray-400'>
                          No country matching “{countrySearch}”
                        </p>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
            <p className='text-xs text-gray-500'>
              Currency in the app will match this country.
            </p>
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
            disabled={submitting}
            className='w-full btn-primary py-3 px-4 rounded-xl disabled:opacity-70'
          >
            {submitting ? 'Creating…' : 'Continue'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default OnboardingBusinessInfo;
