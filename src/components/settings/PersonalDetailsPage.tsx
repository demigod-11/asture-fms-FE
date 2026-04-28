import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { updateCurrentUser, type UserUpdateRequest } from '@/services/authApi';

function getInitials(
  firstName: string,
  lastName: string,
  email: string
): string {
  const first = (firstName || '').trim();
  const last = (lastName || '').trim();
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
  if (first) return first.slice(0, 2).toUpperCase();
  if (email) return email.slice(0, 2).toUpperCase();
  return '?';
}

const PersonalDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profiles, ensureLoaded, refetch } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<UserUpdateRequest>({
    first_name: '',
    last_name: '',
    mobile: '',
    timezone: '',
    avatar_url: null,
  });

  useEffect(() => {
    ensureLoaded();
  }, [ensureLoaded]);

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        mobile: user.mobile ?? '',
        timezone: user.timezone ?? '',
        avatar_url: user.avatar_url ?? null,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await updateCurrentUser(form);
      await refetch();
      navigate('/settings');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setForm(f => ({ ...f, avatar_url: dataUrl }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveAvatar = () => {
    setForm(f => ({ ...f, avatar_url: null }));
  };

  const avatarUrl = form.avatar_url ?? user?.avatar_url ?? null;
  const initials = user
    ? getInitials(user.first_name ?? '', user.last_name ?? '', user.email ?? '')
    : '?';

  const currentProfile = profiles[0];

  if (!user) {
    return (
      <div className='max-w-2xl'>
        <p className='body-muted'>Loading your details…</p>
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

      <h1 className='heading-1'>Personal Details</h1>
      <p className='body-secondary'>
        Edit your user information. Your role and permissions are set by your
        organisation and cannot be changed here.
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
          <h2 className='heading-3'>Profile picture</h2>
          <div className='flex items-center gap-4'>
            <div className='relative shrink-0'>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt='Profile'
                  className='w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600'
                />
              ) : (
                <div
                  className='w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600 text-lg font-semibold text-gray-600 dark:text-gray-300'
                  aria-hidden
                >
                  {initials}
                </div>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleAvatarChange}
                aria-label='Upload profile picture'
              />
              <button
                type='button'
                onClick={() => fileInputRef.current?.click()}
                className='inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors'
              >
                <Camera className='h-4 w-4' />
                Change photo
              </button>
              {avatarUrl && (
                <button
                  type='button'
                  onClick={handleRemoveAvatar}
                  className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 underline'
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>
        </div>

        <div className='card space-y-4'>
          <h2 className='heading-3'>Your details</h2>

          <div>
            <label
              htmlFor='personal-email'
              className='form-label text-gray-900 dark:text-gray-100 block mb-1'
            >
              Email
            </label>
            <input
              id='personal-email'
              type='email'
              value={user.email}
              readOnly
              className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 cursor-not-allowed'
            />
            <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
              Email cannot be changed here.
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='personal-first-name'
                className='form-label text-gray-900 dark:text-gray-100 block mb-1'
              >
                First name
              </label>
              <input
                id='personal-first-name'
                type='text'
                value={form.first_name ?? ''}
                onChange={e =>
                  setForm(f => ({ ...f, first_name: e.target.value || null }))
                }
                className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
                placeholder='First name'
              />
            </div>
            <div>
              <label
                htmlFor='personal-last-name'
                className='form-label text-gray-900 dark:text-gray-100 block mb-1'
              >
                Last name
              </label>
              <input
                id='personal-last-name'
                type='text'
                value={form.last_name ?? ''}
                onChange={e =>
                  setForm(f => ({ ...f, last_name: e.target.value || null }))
                }
                className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
                placeholder='Last name'
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='personal-mobile'
              className='form-label text-gray-900 dark:text-gray-100 block mb-1'
            >
              Mobile
            </label>
            <input
              id='personal-mobile'
              type='tel'
              value={form.mobile ?? ''}
              onChange={e =>
                setForm(f => ({ ...f, mobile: e.target.value || null }))
              }
              className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
              placeholder='+234 801 234 5678'
            />
          </div>

          <div>
            <label
              htmlFor='personal-timezone'
              className='form-label text-gray-900 dark:text-gray-100 block mb-1'
            >
              Timezone
            </label>
            <input
              id='personal-timezone'
              type='text'
              value={form.timezone ?? ''}
              onChange={e =>
                setForm(f => ({ ...f, timezone: e.target.value || null }))
              }
              className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
              placeholder='e.g. Africa/Lagos'
            />
          </div>
        </div>

        <div className='card'>
          <h2 className='heading-3 mb-2'>Role and permissions</h2>
          <p className='body-muted mb-4'>
            Your role and permissions are managed by your organisation. You
            cannot edit them here.
          </p>
          {currentProfile && (
            <div className='rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/30 p-4'>
              <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                Role: {currentProfile.role_name}
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                Organisation: {currentProfile.organisation_name}
              </p>
            </div>
          )}
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

export default PersonalDetailsPage;
