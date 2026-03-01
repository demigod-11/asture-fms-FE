import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown } from 'lucide-react';

interface AddProductDrawerProps {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

const PRODUCT_TYPES = ['Recurring Fee', 'One-Off Fee'];

const AddProductDrawer: React.FC<AddProductDrawerProps> = ({
  open,
  onClose,
  onSaved,
}) => {
  const [name, setName] = useState('');
  const [productType, setProductType] = useState('');
  const [description, setDescription] = useState('');
  const [basePriceUsd, setBasePriceUsd] = useState('');
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);

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
        aria-labelledby='add-product-title'
      >
        <div className='flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0'>
          <h2
            id='add-product-title'
            className='text-lg font-semibold text-gray-900'
          >
            Add product
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
            <label htmlFor='product-name' className='form-label text-gray-900'>
              Name <span className='text-error-500'>*</span>
            </label>
            <input
              id='product-name'
              type='text'
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='e.g. Consulting Fee'
              className='input-field pl-3 py-3 rounded-xl border border-gray-200'
              required
            />
          </div>

          <div>
            <label htmlFor='product-type' className='form-label text-gray-900'>
              Product Type
            </label>
            <div className='relative'>
              <button
                type='button'
                id='product-type'
                onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                className='input-field w-full pl-3 pr-10 py-3 rounded-xl border border-gray-200 flex items-center justify-between text-left'
              >
                <span
                  className={productType ? 'text-gray-900' : 'text-gray-500'}
                >
                  {productType || 'Select type'}
                </span>
                <ChevronDown className='h-4 w-4 text-gray-400 shrink-0' />
              </button>
              {typeDropdownOpen && (
                <div className='absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1'>
                  {PRODUCT_TYPES.map(type => (
                    <button
                      key={type}
                      type='button'
                      onClick={() => {
                        setProductType(type);
                        setTypeDropdownOpen(false);
                      }}
                      className='w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50'
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
              htmlFor='product-description'
              className='form-label text-gray-900'
            >
              Product Description
            </label>
            <textarea
              id='product-description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='Enter product description...'
              rows={3}
              className='input-field pl-3 py-3 rounded-xl border border-gray-200 resize-none'
            />
          </div>

          <div>
            <label htmlFor='base-price' className='form-label text-gray-900'>
              Base Price (₦) <span className='text-error-500'>*</span>
            </label>
            <input
              id='base-price'
              type='number'
              min='0'
              step='0.01'
              value={basePriceUsd}
              onChange={e => setBasePriceUsd(e.target.value)}
              placeholder='0.00'
              className='input-field pl-3 py-3 rounded-xl border border-gray-200'
              required
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
            Add product
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
};

export default AddProductDrawer;
