import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

export interface AddExpensePayload {
  description: string;
  amount: string;
  expense_date: string;
  payment_status: string;
}

interface AddExpenseDrawerProps {
  open: boolean;
  onClose: () => void;
  onSaved?: (payload: AddExpensePayload) => void;
  isSaving?: boolean;
  saveError?: string | undefined;
}

const EXPENSE_CATEGORIES = [
  'Supplies',
  'Travel',
  'Software',
  'Utilities',
  'Other',
];
const EXPENSE_STATUSES = ['Pending', 'Paid', 'Reimbursed'];
const EXPENSE_FORM_ID = 'add-expense-form';

const AddExpenseDrawer: React.FC<AddExpenseDrawerProps> = ({
  open,
  onClose,
  onSaved,
  isSaving = false,
  saveError: _saveError,
}) => {
  const { symbol } = useCurrency();
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedStatus = (status || 'Pending').toLowerCase();
    onSaved?.({
      description: description.trim(),
      amount: amount.trim(),
      expense_date: date,
      payment_status:
        normalizedStatus === 'pending' ||
        normalizedStatus === 'paid' ||
        normalizedStatus === 'reimbursed'
          ? normalizedStatus
          : 'pending',
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
        aria-labelledby='add-expense-title'
      >
        <div className='flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0'>
          <h2
            id='add-expense-title'
            className='text-lg font-semibold text-gray-900 dark:text-gray-100'
          >
            Add expense
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
          id={EXPENSE_FORM_ID}
          onSubmit={handleSubmit}
          className='flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 space-y-4'
        >
          <div>
            <label
              htmlFor='expense-description'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Description <span className='text-error-500'>*</span>
            </label>
            <input
              id='expense-description'
              type='text'
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='e.g. Office supplies'
              className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
              required
            />
          </div>

          <div>
            <label
              htmlFor='expense-category'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Category
            </label>
            <div className='relative'>
              <button
                type='button'
                id='expense-category'
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
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
                <ChevronDown className='h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0' />
              </button>
              {categoryDropdownOpen && (
                <div className='absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1'>
                  {EXPENSE_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type='button'
                      onClick={() => {
                        setCategory(cat);
                        setCategoryDropdownOpen(false);
                      }}
                      className='w-full px-3 py-2 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor='expense-amount'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Amount <span className='text-error-500'>*</span>
            </label>
            <input
              id='expense-amount'
              type='text'
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder={`${symbol}0.00`}
              className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
              required
            />
          </div>

          <div>
            <label
              htmlFor='expense-date'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Date <span className='text-error-500'>*</span>
            </label>
            <input
              id='expense-date'
              type='date'
              value={date}
              onChange={e => setDate(e.target.value)}
              className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
              required
            />
          </div>

          <div>
            <label
              htmlFor='expense-status'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Status
            </label>
            <div className='relative'>
              <button
                type='button'
                id='expense-status'
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                className='input-field w-full pl-3 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-600 flex items-center justify-between text-left'
              >
                <span
                  className={
                    status
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-500 dark:text-gray-400'
                  }
                >
                  {status || 'Select status'}
                </span>
                <ChevronDown className='h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0' />
              </button>
              {statusDropdownOpen && (
                <div className='absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1'>
                  {EXPENSE_STATUSES.map(s => (
                    <button
                      key={s}
                      type='button'
                      onClick={() => {
                        setStatus(s);
                        setStatusDropdownOpen(false);
                      }}
                      className='w-full px-3 py-2 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
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
            form={EXPENSE_FORM_ID}
            disabled={isSaving}
            className='px-4 py-2.5 text-sm font-medium text-white bg-[#073E60] hover:bg-[#052d47] rounded-xl transition-colors disabled:opacity-50'
          >
            {isSaving ? 'Saving…' : 'Add expense'}
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
};

export default AddExpenseDrawer;
