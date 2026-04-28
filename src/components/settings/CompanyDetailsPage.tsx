import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Search, Check } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useCountries } from '@/hooks/useCountries';
import {
  getOrganisation,
  updateOrganisation,
  type OrganisationUpdateRequest,
} from '@/services/authApi';

const CompanyDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { profiles, ensureLoaded, refetch } = useProfile();
  const { refetch: refetchCurrency } = useCurrency();
  const { countries } = useCountries();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countrySearchInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<OrganisationUpdateRequest>({
    name: '',
    slug: '',
    description: '',
    website: '',
    logo_url: '',
    country: null,
  });

  const organisationId = profiles[0]?.organisation_id;

  useEffect(() => {
    ensureLoaded();
  }, [ensureLoaded]);

  useEffect(() => {
    if (!organisationId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getOrganisation(organisationId)
      .then(data => {
        if (!cancelled) {
          setForm({
            name: data.name ?? '',
            slug: data.slug ?? '',
            description: data.description ?? '',
            website: data.website ?? '',
            logo_url: data.logo_url ?? '',
            country: data.country ?? null,
          });
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load organisation'
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [organisationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organisationId) return;
    setError(null);
    setSaving(true);
    try {
      await updateOrganisation(organisationId, form);
      await refetch();
      await refetchCurrency();
      navigate('/settings');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update organisation'
      );
    } finally {
      setSaving(false);
    }
  };

  if (!organisationId) {
    return (
      <div className='max-w-2xl'>
        <p className='body-muted'>No organisation in context.</p>
        <button
          type='button'
          onClick={() => navigate('/settings')}
          className='mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Account and settings
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='max-w-2xl'>
        <p className='body-muted'>Loading company details…</p>
      </div>
    );
  }

  return (
    <div className='max-w-2xl space-y-8'>
      <button
        type='button'
        onClick={() => navigate('/settings')}
        className='inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
      >
        <ArrowLeft className='h-4 w-4' />
        Back to Account and settings
      </button>

      <h1 className='heading-1'>Company Details</h1>
      <p className='body-secondary'>
        Company info, company type, address, public info and more.
      </p>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {error && (
          <div
            className='rounded-xl bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 px-4 py-3 text-sm text-error-800 dark:text-error-200'
            role='alert'
          >
            {error}
          </div>
        )}

        <div className='card space-y-4'>
          <h2 className='heading-3'>Organisation</h2>

          <div>
            <label
              htmlFor='company-name'
              className='form-label text-gray-900 dark:text-gray-100 block mb-1'
            >
              Company name
            </label>
            <input
              id='company-name'
              type='text'
              value={form.name ?? ''}
              onChange={e =>
                setForm(f => ({ ...f, name: e.target.value || null }))
              }
              className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
              placeholder='Your company name'
            />
          </div>

          <div>
            <label
              htmlFor='company-slug'
              className='form-label text-gray-900 dark:text-gray-100 block mb-1'
            >
              Slug
            </label>
            <input
              id='company-slug'
              type='text'
              value={form.slug ?? ''}
              onChange={e =>
                setForm(f => ({ ...f, slug: e.target.value || null }))
              }
              className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
              placeholder='your-company'
            />
            <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
              URL-friendly identifier.
            </p>
          </div>

          <div>
            <label
              htmlFor='company-description'
              className='form-label text-gray-900 dark:text-gray-100 block mb-1'
            >
              Description
            </label>
            <textarea
              id='company-description'
              value={form.description ?? ''}
              onChange={e =>
                setForm(f => ({ ...f, description: e.target.value || null }))
              }
              rows={3}
              className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 resize-none placeholder-gray-500 dark:placeholder-gray-400'
              placeholder='Brief description of your organisation'
            />
          </div>

          <div>
            <label
              htmlFor='company-country'
              className='form-label text-gray-900 dark:text-gray-100 block mb-1'
            >
              Country
            </label>
            <div className='relative'>
              <button
                type='button'
                id='company-country'
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
                className='input-field w-full pl-3 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-600 flex items-center justify-between text-left'
              >
                <span
                  className={`flex items-center gap-2 ${form.country ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  {form.country ? (
                    <>
                      <span className='text-lg leading-none' aria-hidden>
                        {countries.find(c => c.code === form.country)?.flag ??
                          ''}
                      </span>
                      <span>
                        {countries.find(c => c.code === form.country)?.name ??
                          form.country}
                      </span>
                    </>
                  ) : (
                    'Select country'
                  )}
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
                        className='input-field w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 placeholder-gray-500 dark:placeholder-gray-400'
                      />
                    </div>
                  </div>
                  <div className='overflow-y-auto py-1 min-h-0'>
                    <button
                      type='button'
                      onClick={() => {
                        setForm(f => ({ ...f, country: null }));
                        setCountryDropdownOpen(false);
                        setCountrySearch('');
                      }}
                      className='w-full px-3 py-2 text-left text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2'
                    >
                      No country
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
                          const isSelected = form.country === c.code;
                          return (
                            <button
                              key={c.code}
                              type='button'
                              onClick={() => {
                                setForm(f => ({ ...f, country: c.code }));
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
            <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
              Currency across the app is set from this country.
            </p>
          </div>

          <div>
            <label
              htmlFor='company-website'
              className='form-label text-gray-900 dark:text-gray-100 block mb-1'
            >
              Website
            </label>
            <input
              id='company-website'
              type='url'
              value={form.website ?? ''}
              onChange={e =>
                setForm(f => ({ ...f, website: e.target.value || null }))
              }
              className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
              placeholder='https://example.com'
            />
          </div>

          <div>
            <label
              htmlFor='company-logo'
              className='form-label text-gray-900 dark:text-gray-100 block mb-1'
            >
              Logo URL
            </label>
            <input
              id='company-logo'
              type='url'
              value={form.logo_url ?? ''}
              onChange={e =>
                setForm(f => ({ ...f, logo_url: e.target.value || null }))
              }
              className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
              placeholder='https://example.com/logo.png'
            />
          </div>
        </div>

        <div className='flex justify-end gap-3'>
          <button
            type='button'
            onClick={() => navigate('/settings')}
            className='px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={saving}
            className='px-4 py-2.5 text-sm font-medium text-white bg-[#073E60] hover:bg-[#052d47] rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyDetailsPage;
