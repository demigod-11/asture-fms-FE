import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown } from 'lucide-react';

interface AddChartOfAccountDrawerProps {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

const ACCOUNT_TYPES = ['Assets', 'Liability', 'Equity', 'Revenue', 'Expenses'];
const PARENT_ACCOUNTS = [
  'None',
  '1000 - Cash & Bank Accounts',
  '1100 - Accounts Receivable',
  '2000 - Accounts Payable',
];

const AddChartOfAccountDrawer: React.FC<AddChartOfAccountDrawerProps> = ({
  open,
  onClose,
  onSaved,
}) => {
  const [accountType, setAccountType] = useState('');
  const [accountTypeOpen, setAccountTypeOpen] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [parentAccount, setParentAccount] = useState('None');
  const [parentOpen, setParentOpen] = useState(false);
  const [accountNumber, setAccountNumber] = useState('#1000');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaved?.();
    onClose();
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
        className='fixed top-0 right-0 bottom-0 z-[101] w-full max-w-md bg-white shadow-xl flex flex-col overflow-hidden'
        role='dialog'
        aria-modal='true'
        aria-labelledby='create-account-title'
      >
        <div className='flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0'>
          <h2
            id='create-account-title'
            className='text-lg font-semibold text-gray-900'
          >
            Create New Account
          </h2>
          <button
            type='button'
            onClick={onClose}
            className='p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors'
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
            <label htmlFor='account-type' className='form-label text-gray-900'>
              Account Type <span className='text-error-500'>*</span>
            </label>
            <div className='relative'>
              <button
                type='button'
                id='account-type'
                onClick={() => {
                  setAccountTypeOpen(!accountTypeOpen);
                  setParentOpen(false);
                }}
                className='input-field w-full pl-3 pr-10 py-3 rounded-xl border border-gray-200 flex items-center justify-between text-left'
              >
                <span
                  className={accountType ? 'text-gray-900' : 'text-gray-500'}
                >
                  {accountType || 'Select account type'}
                </span>
                <ChevronDown className='h-4 w-4 text-gray-400 shrink-0' />
              </button>
              {accountTypeOpen && (
                <div className='absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1'>
                  {ACCOUNT_TYPES.map(opt => (
                    <button
                      key={opt}
                      type='button'
                      onClick={() => {
                        setAccountType(opt);
                        setAccountTypeOpen(false);
                      }}
                      className='w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50'
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor='account-name' className='form-label text-gray-900'>
              Account Name <span className='text-error-500'>*</span>
            </label>
            <input
              id='account-name'
              type='text'
              value={accountName}
              onChange={e => setAccountName(e.target.value)}
              placeholder='Enter account name'
              className='input-field w-full pl-3 py-3 rounded-xl border border-gray-200'
              required
            />
          </div>

          <div>
            <label
              htmlFor='parent-account'
              className='form-label text-gray-900'
            >
              Parent Account
            </label>
            <div className='relative'>
              <button
                type='button'
                id='parent-account'
                onClick={() => {
                  setParentOpen(!parentOpen);
                  setAccountTypeOpen(false);
                }}
                className='input-field w-full pl-3 pr-10 py-3 rounded-xl border border-gray-200 flex items-center justify-between text-left'
              >
                <span className='text-gray-900'>{parentAccount}</span>
                <ChevronDown className='h-4 w-4 text-gray-400 shrink-0' />
              </button>
              {parentOpen && (
                <div className='absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1'>
                  {PARENT_ACCOUNTS.map(opt => (
                    <button
                      key={opt}
                      type='button'
                      onClick={() => {
                        setParentAccount(opt);
                        setParentOpen(false);
                      }}
                      className='w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50'
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
              htmlFor='account-number'
              className='form-label text-gray-900'
            >
              Account Number <span className='text-error-500'>*</span>
            </label>
            <input
              id='account-number'
              type='text'
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              placeholder='#1000'
              className='input-field w-full pl-3 py-3 rounded-xl border border-gray-200'
              required
            />
          </div>

          <div>
            <label
              htmlFor='account-description'
              className='form-label text-gray-900'
            >
              Description
            </label>
            <textarea
              id='account-description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='Enter account description...'
              rows={3}
              className='input-field pl-3 py-3 rounded-xl border border-gray-200 resize-none'
            />
          </div>
        </form>

        <div className='px-4 py-3 pb-6 border-t border-gray-200 flex justify-end gap-3 shrink-0 bg-white'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors'
          >
            Cancel
          </button>
          <button
            type='submit'
            onClick={handleSubmit}
            className='px-4 py-2.5 text-sm font-medium text-white bg-[#073E60] hover:bg-[#052d47] rounded-xl transition-colors'
          >
            Create account
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
};

export default AddChartOfAccountDrawer;
