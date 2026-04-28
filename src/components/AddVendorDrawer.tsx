import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown } from 'lucide-react';

export interface AddVendorPayload {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

interface AddVendorDrawerProps {
  open: boolean;
  onClose: () => void;
  onSaved?: (payload: AddVendorPayload) => void;
  initialVendor?: AddVendorPayload | null;
  isSaving?: boolean;
  saveError?: string | undefined;
}

const CATEGORY_OPTIONS = ['Stationery', 'Services', 'Equipment', 'Consulting'];
const PAYMENT_TERMS_OPTIONS = ['Net 15', 'Net 30', 'Net 45', 'Due on receipt'];

const AddVendorDrawer: React.FC<AddVendorDrawerProps> = ({
  open,
  onClose,
  onSaved,
  initialVendor = null,
  isSaving = false,
  saveError,
}) => {
  const [fullName, setFullName] = useState('');
  const [category, setCategory] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [taxVatNumber, setTaxVatNumber] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [paymentTermsOpen, setPaymentTermsOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (initialVendor) {
      setFullName(initialVendor.name ?? '');
      setContactEmail(initialVendor.email ?? '');
      setPhoneNumber(initialVendor.phone ?? '');
      setAddress(initialVendor.address ?? '');
      return;
    }
    setFullName('');
    setCategory('');
    setContactEmail('');
    setPhoneNumber('');
    setPaymentTerms('');
    setTaxVatNumber('');
    setAddress('');
    setDescription('');
    setCategoryOpen(false);
    setPaymentTermsOpen(false);
  }, [open, initialVendor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaved?.({
      name: fullName.trim(),
      email: contactEmail.trim(),
      phone: phoneNumber.trim(),
      address: address.trim() || undefined,
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
        aria-labelledby='add-vendor-title'
      >
        <div className='flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0'>
          <h2
            id='add-vendor-title'
            className='text-lg font-semibold text-gray-900 dark:text-gray-100'
          >
            {initialVendor ? 'Edit Vendor' : 'Add Vendor'}
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
              htmlFor='vendor-full-name'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Full Name <span className='text-error-500'>*</span>
            </label>
            <input
              id='vendor-full-name'
              type='text'
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder='ABC Stationery Ltd.'
              className='input-field w-full pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
              required
            />
          </div>

          <div>
            <label
              htmlFor='vendor-category'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Category <span className='text-error-500'>*</span>
            </label>
            <div className='relative'>
              <button
                type='button'
                id='vendor-category'
                onClick={() => {
                  setCategoryOpen(!categoryOpen);
                  setPaymentTermsOpen(false);
                }}
                className='input-field w-full pl-3 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-600 flex items-center justify-between text-left'
              >
                <span
                  className={
                    category
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-500 dark:text-gray-400'
                  }
                >
                  {category || 'Select category'}
                </span>
                <ChevronDown className='h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0 absolute right-3 top-1/2 -translate-y-1/2' />
              </button>
              {categoryOpen && (
                <div className='absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg py-1'>
                  {CATEGORY_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      type='button'
                      onClick={() => {
                        setCategory(opt);
                        setCategoryOpen(false);
                      }}
                      className='w-full px-3 py-2 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='vendor-contact-email'
                className='form-label text-gray-900 dark:text-gray-100'
              >
                Contact Email <span className='text-error-500'>*</span>
              </label>
              <input
                id='vendor-contact-email'
                type='email'
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                placeholder='marydoe@example.com'
                className='input-field w-full pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
                required
              />
            </div>
            <div>
              <label
                htmlFor='vendor-phone'
                className='form-label text-gray-900 dark:text-gray-100'
              >
                Phone Number <span className='text-error-500'>*</span>
              </label>
              <input
                id='vendor-phone'
                type='tel'
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder='+234 801 234 5678'
                className='input-field w-full pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
                required
              />
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='vendor-payment-terms'
                className='form-label text-gray-900 dark:text-gray-100'
              >
                Payment Terms <span className='text-error-500'>*</span>
              </label>
              <div className='relative'>
                <button
                  type='button'
                  id='vendor-payment-terms'
                  onClick={() => {
                    setPaymentTermsOpen(!paymentTermsOpen);
                    setCategoryOpen(false);
                  }}
                  className='input-field w-full pl-3 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-600 flex items-center justify-between text-left'
                >
                  <span
                    className={
                      paymentTerms
                        ? 'text-gray-900 dark:text-gray-100'
                        : 'text-gray-500 dark:text-gray-400'
                    }
                  >
                    {paymentTerms || 'Net 30'}
                  </span>
                  <ChevronDown className='h-4 w-4 text-gray-400 shrink-0 absolute right-3 top-1/2 -translate-y-1/2' />
                </button>
                {paymentTermsOpen && (
                  <div className='absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg py-1'>
                    {PAYMENT_TERMS_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        type='button'
                        onClick={() => {
                          setPaymentTerms(opt);
                          setPaymentTermsOpen(false);
                        }}
                        className='w-full px-3 py-2 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor='vendor-tax-vat'
                className='form-label text-gray-900 dark:text-gray-100'
              >
                Tax/VAT Number <span className='text-error-500'>*</span>
              </label>
              <input
                id='vendor-tax-vat'
                type='text'
                value={taxVatNumber}
                onChange={e => setTaxVatNumber(e.target.value)}
                placeholder='TIN12345678'
                className='input-field w-full pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='vendor-address'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Address
            </label>
            <input
              id='vendor-address'
              type='text'
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder='Enter home address...'
              className='input-field w-full pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
            />
          </div>

          <div>
            <label
              htmlFor='vendor-description'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Description
            </label>
            <textarea
              id='vendor-description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='Enter account description...'
              rows={3}
              className='input-field w-full pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 resize-none placeholder-gray-500 dark:placeholder-gray-400'
            />
          </div>
        </form>

        <div className='px-4 py-3 pb-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 shrink-0 bg-white dark:bg-gray-800'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors'
          >
            Cancel
          </button>
          {saveError && (
            <p className='self-center text-sm text-red-600 dark:text-red-400'>
              {saveError}
            </p>
          )}
          <button
            type='button'
            disabled={isSaving}
            onClick={() =>
              onSaved?.({
                name: fullName.trim(),
                email: contactEmail.trim(),
                phone: phoneNumber.trim(),
                address: address.trim() || '',
              })
            }
            className='px-4 py-2.5 text-sm font-medium text-white bg-[#073E60] hover:bg-[#052d47] rounded-xl transition-colors disabled:opacity-50'
          >
            {isSaving
              ? 'Saving…'
              : initialVendor
                ? 'Save changes'
                : 'Add vendor'}
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
};

export default AddVendorDrawer;
