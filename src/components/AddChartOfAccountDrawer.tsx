import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown } from 'lucide-react';
import type { COACategoryResponse } from '@/services/coaCategoriesApi';

export interface AddChartOfAccountPayload {
  name: string;
  code: string;
  category_id: string;
  description?: string | null | undefined;
  status?: 'active' | 'inactive' | undefined;
}

export interface EditCoaInitial {
  id: string;
  name: string;
  code: string;
  category_id: string;
  description: string;
  status: 'active' | 'inactive';
}

interface AddChartOfAccountDrawerProps {
  open: boolean;
  onClose: () => void;
  /** When set, drawer is in edit mode. */
  initialCoa?: EditCoaInitial | null;
  onSaved?: (payload: AddChartOfAccountPayload, editId?: string) => void;
  categories: COACategoryResponse[];
  isSaving?: boolean;
  saveError?: string | undefined;
}

const AddChartOfAccountDrawer: React.FC<AddChartOfAccountDrawerProps> = ({
  open,
  onClose,
  initialCoa,
  onSaved,
  categories,
  isSaving = false,
  saveError,
}) => {
  const [categoryId, setCategoryId] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [statusOpen, setStatusOpen] = useState(false);

  const isEdit = Boolean(initialCoa?.id);
  React.useEffect(() => {
    if (open && initialCoa) {
      setCategoryId(initialCoa.category_id);
      setAccountName(initialCoa.name);
      setAccountNumber(initialCoa.code);
      setDescription(initialCoa.description);
      setStatus(initialCoa.status);
    } else if (open && !initialCoa) {
      setCategoryId('');
      setAccountName('');
      setAccountNumber('');
      setDescription('');
      setStatus('active');
    }
  }, [open, initialCoa]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaved?.(
      {
        name: accountName,
        code: accountNumber.trim(),
        category_id: categoryId,
        description: description.trim() || undefined,
        status,
      },
      isEdit ? initialCoa!.id : undefined
    );
  };

  const selectedCategoryName =
    categories.find(c => c.id === categoryId)?.name ?? 'Select category';

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
        aria-labelledby='create-account-title'
      >
        <div className='flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0'>
          <h2
            id='create-account-title'
            className='text-lg font-semibold text-gray-900 dark:text-gray-100'
          >
            {isEdit ? 'Edit account' : 'Create New Account'}
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
              htmlFor='account-category'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Category <span className='text-error-500'>*</span>
            </label>
            <div className='relative'>
              <button
                type='button'
                id='account-category'
                onClick={() => {
                  setCategoryOpen(!categoryOpen);
                  setStatusOpen(false);
                }}
                className='input-field w-full pl-3 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-600 flex items-center justify-between text-left'
              >
                <span
                  className={
                    categoryId
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-500 dark:text-gray-400'
                  }
                >
                  {selectedCategoryName}
                </span>
                <ChevronDown className='h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0' />
              </button>
              {categoryOpen && (
                <div className='absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1'>
                  {categories.length === 0 ? (
                    <p className='px-3 py-2 text-sm text-gray-500 dark:text-gray-400'>
                      No categories. Create categories first.
                    </p>
                  ) : (
                    categories.map(cat => (
                      <button
                        key={cat.id}
                        type='button'
                        onClick={() => {
                          setCategoryId(cat.id);
                          setCategoryOpen(false);
                        }}
                        className='w-full px-3 py-2 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                      >
                        {cat.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor='account-name'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Account Name <span className='text-error-500'>*</span>
            </label>
            <input
              id='account-name'
              type='text'
              value={accountName}
              onChange={e => setAccountName(e.target.value)}
              placeholder='Enter account name'
              className='input-field w-full pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
              required
            />
          </div>

          <div>
            <label
              htmlFor='account-number'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Account Number (Code) <span className='text-error-500'>*</span>
            </label>
            <input
              id='account-number'
              type='text'
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              placeholder='e.g. 1000'
              className='input-field w-full pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
              required
            />
          </div>

          <div>
            <label
              htmlFor='account-status'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Status
            </label>
            <div className='relative'>
              <button
                type='button'
                id='account-status'
                onClick={() => {
                  setStatusOpen(!statusOpen);
                  setCategoryOpen(false);
                }}
                className='input-field w-full pl-3 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-600 flex items-center justify-between text-left'
              >
                <span className='text-gray-900 dark:text-gray-100 capitalize'>
                  {status}
                </span>
                <ChevronDown className='h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0' />
              </button>
              {statusOpen && (
                <div className='absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1'>
                  {(['active', 'inactive'] as const).map(s => (
                    <button
                      key={s}
                      type='button'
                      onClick={() => {
                        setStatus(s);
                        setStatusOpen(false);
                      }}
                      className='w-full px-3 py-2 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 capitalize'
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor='account-description'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Description
            </label>
            <textarea
              id='account-description'
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
            disabled={isSaving || !categoryId}
            className='px-4 py-2.5 text-sm font-medium text-white bg-[#073E60] hover:bg-[#052d47] rounded-xl transition-colors disabled:opacity-50'
          >
            {isSaving ? 'Saving…' : isEdit ? 'Save changes' : 'Create account'}
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
};

export default AddChartOfAccountDrawer;
