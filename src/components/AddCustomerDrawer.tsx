import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown } from 'lucide-react';

export interface AddCustomerPayload {
  name: string;
  email: string;
  phone: string;
  billing_address?: string | undefined;
}

interface AddCustomerDrawerProps {
  open: boolean;
  onClose: () => void;
  onSaved?: (payload: AddCustomerPayload) => void;
  initialCustomer?: AddCustomerPayload | null;
  isSaving?: boolean;
  saveError?: string | undefined;
}

const CUSTOMER_TYPES = ['Individual', 'Business', 'Other'];

const AddCustomerDrawer: React.FC<AddCustomerDrawerProps> = ({
  open,
  onClose,
  onSaved,
  initialCustomer = null,
  isSaving = false,
  saveError,
}) => {
  const [customerType, setCustomerType] = useState('');
  const [fullName, setFullName] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (initialCustomer) {
      setFullName(initialCustomer.name ?? '');
      setGuardianEmail(initialCustomer.email ?? '');
      setPhoneNumber(initialCustomer.phone ?? '');
      setAddress(initialCustomer.billing_address ?? '');
      return;
    }
    setCustomerType('');
    setFullName('');
    setClassLevel('');
    setGuardianName('');
    setGuardianEmail('');
    setPhoneNumber('');
    setAddress('');
    setDescription('');
    setTypeDropdownOpen(false);
  }, [open, initialCustomer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaved?.({
      name: fullName.trim(),
      email: guardianEmail.trim(),
      phone: phoneNumber.trim(),
      billing_address: address.trim() || undefined,
    });
  };

  if (!open) return null;

  const content = (
    <>
      <div
        className='fixed inset-0 z-[100] bg-black/50 transition-opacity'
        onClick={onClose}
        aria-hidden
      />
      <div
        className='fixed top-0 right-0 bottom-0 z-[101] w-full max-w-md bg-white dark:bg-gray-800 shadow-xl flex flex-col overflow-hidden'
        role='dialog'
        aria-modal='true'
        aria-labelledby='add-customer-title'
      >
        <div className='flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0'>
          <h2
            id='add-customer-title'
            className='text-lg font-semibold text-gray-900 dark:text-gray-100'
          >
            {initialCustomer ? 'Edit customer' : 'Add customer'}
          </h2>
          <button
            type='button'
            onClick={onClose}
            className='p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
            aria-label='Close'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className='flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 space-y-4'
        >
          <div>
            <label
              htmlFor='customer-type'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Customer Type
            </label>
            <div className='relative'>
              <button
                type='button'
                id='customer-type'
                onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                className='input-field w-full pl-3 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-600 flex items-center justify-between text-left'
              >
                <span
                  className={
                    customerType
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-500 dark:text-gray-400'
                  }
                >
                  {customerType || 'Select type'}
                </span>
                <ChevronDown className='h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0' />
              </button>
              {typeDropdownOpen && (
                <div className='absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1'>
                  {CUSTOMER_TYPES.map(type => (
                    <button
                      key={type}
                      type='button'
                      onClick={() => {
                        setCustomerType(type);
                        setTypeDropdownOpen(false);
                      }}
                      className='w-full px-3 py-2 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor='full-name'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Full Name <span className='text-error-500'>*</span>
            </label>
            <input
              id='full-name'
              type='text'
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder='John Doe'
              className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
              required
            />
          </div>

          <div>
            <label
              htmlFor='class-level'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Segment
            </label>
            <input
              id='class-level'
              type='text'
              value={classLevel}
              onChange={e => setClassLevel(e.target.value)}
              placeholder='e.g. Retail, Corporate'
              className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
            />
          </div>

          <div>
            <label
              htmlFor='guardian-name'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Primary Contact <span className='text-error-500'>*</span>
            </label>
            <input
              id='guardian-name'
              type='text'
              value={guardianName}
              onChange={e => setGuardianName(e.target.value)}
              placeholder='Mary Doe'
              className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
              required
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='guardian-email'
                className='form-label text-gray-900 dark:text-gray-100'
              >
                Contact Email <span className='text-error-500'>*</span>
              </label>
              <input
                id='guardian-email'
                type='email'
                value={guardianEmail}
                onChange={e => setGuardianEmail(e.target.value)}
                placeholder='Marydoe@example.com'
                className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
                required
              />
            </div>
            <div>
              <label
                htmlFor='phone'
                className='form-label text-gray-900 dark:text-gray-100'
              >
                Phone Number <span className='text-error-500'>*</span>
              </label>
              <input
                id='phone'
                type='tel'
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder='+234 801 234 5678'
                className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='address'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Address
            </label>
            <input
              id='address'
              type='text'
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder='Enter home address...'
              className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
            />
          </div>

          <div>
            <label
              htmlFor='description'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Description
            </label>
            <textarea
              id='description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='Enter account description...'
              rows={3}
              className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 resize-none placeholder-gray-500 dark:placeholder-gray-400'
            />
          </div>
          {saveError && (
            <p className='text-sm text-red-600 dark:text-red-400'>
              {saveError}
            </p>
          )}
        </form>

        <div className='px-4 py-3 pb-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 shrink-0 bg-white dark:bg-gray-800'>
          <button
            type='button'
            onClick={onClose}
            disabled={isSaving}
            className='px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors disabled:opacity-50'
          >
            Cancel
          </button>
          <button
            type='submit'
            onClick={handleSubmit}
            disabled={isSaving}
            className='px-4 py-2.5 text-sm font-medium text-white bg-[#073E60] hover:bg-[#052d47] rounded-xl transition-colors disabled:opacity-50'
          >
            {isSaving
              ? 'Saving…'
              : initialCustomer
                ? 'Save changes'
                : 'Add customer'}
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
};

export default AddCustomerDrawer;
