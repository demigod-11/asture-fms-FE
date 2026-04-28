import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown } from 'lucide-react';

export interface AddProductPayload {
  name: string;
  code?: string | undefined;
  description?: string | undefined;
  price?: string | undefined;
  status?: 'active' | 'inactive' | undefined;
}

export interface EditProductInitial {
  id: string;
  name: string;
  code: string;
  description: string;
  price: string;
  status: 'active' | 'inactive';
}

interface AddProductDrawerProps {
  open: boolean;
  onClose: () => void;
  /** When set, drawer is in edit mode (prefilled, title "Edit product"). */
  initialProduct?: EditProductInitial | null;
  onSaved?: (payload: AddProductPayload, editId?: string) => void;
  isSaving?: boolean;
  saveError?: string | undefined;
}

const AddProductDrawer: React.FC<AddProductDrawerProps> = ({
  open,
  onClose,
  initialProduct,
  onSaved,
  isSaving = false,
  saveError,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const isEdit = Boolean(initialProduct?.id);
  React.useEffect(() => {
    if (open && initialProduct) {
      setName(initialProduct.name);
      setCode(initialProduct.code);
      setDescription(initialProduct.description);
      setPrice(initialProduct.price);
      setStatus(initialProduct.status);
    } else if (open && !initialProduct) {
      setName('');
      setCode('');
      setDescription('');
      setPrice('0');
      setStatus('active');
    }
  }, [open, initialProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaved?.(
      {
        name,
        code: code.trim() || undefined,
        description: description.trim() || undefined,
        price: price.trim() || '0',
        status,
      },
      isEdit ? initialProduct!.id : undefined
    );
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
        aria-labelledby='add-product-title'
      >
        <div className='flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0'>
          <h2
            id='add-product-title'
            className='text-lg font-semibold text-gray-900 dark:text-gray-100'
          >
            {isEdit ? 'Edit product' : 'Add product'}
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
              htmlFor='product-name'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Name <span className='text-error-500'>*</span>
            </label>
            <input
              id='product-name'
              type='text'
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='e.g. Consulting Fee'
              className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
              required
            />
          </div>

          <div>
            <label
              htmlFor='product-code'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Code
            </label>
            <input
              id='product-code'
              type='text'
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder='e.g. CONSULT-001'
              className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
            />
          </div>

          <div>
            <label
              htmlFor='product-description'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Description
            </label>
            <textarea
              id='product-description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='Enter product description...'
              rows={3}
              className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 resize-none placeholder-gray-500 dark:placeholder-gray-400'
            />
          </div>

          <div>
            <label
              htmlFor='product-price'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Price
            </label>
            <input
              id='product-price'
              type='number'
              min='0'
              step='0.01'
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder='0.00'
              className='input-field pl-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
            />
          </div>

          <div>
            <label
              htmlFor='product-status'
              className='form-label text-gray-900 dark:text-gray-100'
            >
              Status
            </label>
            <div className='relative'>
              <button
                type='button'
                id='product-status'
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                className='input-field w-full pl-3 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-600 flex items-center justify-between text-left'
              >
                <span className='text-gray-900 dark:text-gray-100 capitalize'>
                  {status}
                </span>
                <ChevronDown className='h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0' />
              </button>
              {statusDropdownOpen && (
                <div className='absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1'>
                  {(['active', 'inactive'] as const).map(s => (
                    <button
                      key={s}
                      type='button'
                      onClick={() => {
                        setStatus(s);
                        setStatusDropdownOpen(false);
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
            {isSaving ? 'Saving…' : isEdit ? 'Save changes' : 'Add product'}
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
};

export default AddProductDrawer;
