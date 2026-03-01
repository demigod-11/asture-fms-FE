import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, Calendar, GripVertical, Trash2 } from 'lucide-react';

interface AddBillDrawerProps {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

interface LineItem {
  id: string;
  category: string;
  accountNumber: string;
  description: string;
  total: string;
}

const TERMS_OPTIONS = ['Net 15', 'Net 30', 'Net 45', 'Due on receipt'];

const AddBillDrawer: React.FC<AddBillDrawerProps> = ({
  open,
  onClose,
  onSaved,
}) => {
  const [vendorName, setVendorName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [billNumber, setBillNumber] = useState('1006');
  const [billDate, setBillDate] = useState('16/04/2025');
  const [dueDate, setDueDate] = useState('30/04/2025');
  const [terms, setTerms] = useState('');
  const [termsOpen, setTermsOpen] = useState(false);
  const [vendorOpen, setVendorOpen] = useState(false);
  const [paymentMemo, setPaymentMemo] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', category: '', accountNumber: '', description: '', total: '' },
    { id: '2', category: '', accountNumber: '', description: '', total: '' },
    { id: '3', category: '', accountNumber: '', description: '', total: '' },
  ]);

  const addLineItem = () => {
    setLineItems(prev => [
      ...prev,
      {
        id: String(Date.now()),
        category: '',
        accountNumber: '',
        description: '',
        total: '',
      },
    ]);
  };

  const removeLineItem = (id: string) => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string) => {
    setLineItems(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const totalAmountDue = lineItems.reduce<number>((sum, item) => {
    const n = parseFloat(String(item.total).replace(/[^0-9.-]/g, '')) || 0;
    return sum + n;
  }, 0);

  const formatNaira = (value: number) =>
    `₦${Number(value).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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
        className='fixed top-0 right-0 bottom-0 z-[101] w-full max-w-2xl bg-white shadow-xl flex flex-col overflow-hidden'
        role='dialog'
        aria-modal='true'
        aria-labelledby='create-bill-title'
      >
        {/* Header: Close + Title, then Cancel + Save */}
        <div className='flex items-center justify-between gap-4 px-4 py-3 border-b border-gray-200 shrink-0'>
          <div className='flex items-center gap-3 min-w-0'>
            <button
              type='button'
              onClick={onClose}
              className='p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors shrink-0'
              aria-label='Close'
            >
              <X className='h-5 w-5' />
            </button>
            <h2
              id='create-bill-title'
              className='text-lg font-semibold text-gray-900 truncate'
            >
              Create bill
            </h2>
          </div>
          <div className='flex items-center gap-2 shrink-0'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              form='create-bill-form'
              className='px-4 py-2.5 text-sm font-medium text-white bg-[#073E60] hover:bg-[#052d47] rounded-xl transition-colors'
            >
              Save
            </button>
          </div>
        </div>

        <form
          id='create-bill-form'
          onSubmit={handleSubmit}
          className='flex-1 overflow-y-auto p-4 sm:p-6 space-y-6'
        >
          {/* Bill Details: heading + Balance due */}
          <div className='flex items-start justify-between gap-4'>
            <h3 className='text-base font-semibold text-gray-900'>
              Bill Details
            </h3>
            <div className='text-right shrink-0'>
              <p className='text-sm text-gray-500'>Balance due</p>
              <p className='text-lg font-semibold text-gray-900'>
                {formatNaira(totalAmountDue)}
              </p>
            </div>
          </div>

          {/* Core fields: Vendor, Customer Email, Billing Address */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='relative'>
              <label
                htmlFor='bill-vendor'
                className='form-label text-gray-900 block mb-1'
              >
                Vendor Name
              </label>
              <button
                type='button'
                id='bill-vendor'
                onClick={() => {
                  setVendorOpen(!vendorOpen);
                  setTermsOpen(false);
                }}
                className='input-field w-full pl-3 pr-10 py-3 rounded-xl border border-gray-200 flex items-center justify-between text-left'
              >
                <span
                  className={vendorName ? 'text-gray-900' : 'text-gray-500'}
                >
                  {vendorName || 'Select a vendor'}
                </span>
                <ChevronDown className='h-4 w-4 text-gray-400 shrink-0 absolute right-3 top-1/2 -translate-y-1/2' />
              </button>
              {vendorOpen && (
                <div className='absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg py-1'>
                  <button
                    type='button'
                    onClick={() => {
                      setVendorName('ABC Supplies');
                      setVendorOpen(false);
                    }}
                    className='w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50'
                  >
                    ABC Supplies
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setVendorName('XYZ Services');
                      setVendorOpen(false);
                    }}
                    className='w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50'
                  >
                    XYZ Services
                  </button>
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor='bill-customer-email'
                className='form-label text-gray-900 block mb-1'
              >
                Customer Email
              </label>
              <input
                id='bill-customer-email'
                type='text'
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                placeholder='Separate emails with comma'
                className='input-field w-full pl-3 py-3 rounded-xl border border-gray-200'
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='bill-billing-address'
              className='form-label text-gray-900 block mb-1'
            >
              Billing Address
            </label>
            <textarea
              id='bill-billing-address'
              value={billingAddress}
              onChange={e => setBillingAddress(e.target.value)}
              rows={2}
              className='input-field w-full pl-3 py-3 rounded-xl border border-gray-200 resize-none'
            />
          </div>

          {/* Bill Number, Bill Date, Due Date, Terms */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label
                htmlFor='bill-number'
                className='form-label text-gray-900 block mb-1'
              >
                Bill Number
              </label>
              <input
                id='bill-number'
                type='text'
                value={billNumber}
                onChange={e => setBillNumber(e.target.value)}
                className='input-field w-full pl-3 py-3 rounded-xl border border-gray-200'
              />
            </div>
            <div>
              <label
                htmlFor='bill-date'
                className='form-label text-gray-900 block mb-1'
              >
                Bill Date
              </label>
              <div className='relative'>
                <input
                  id='bill-date'
                  type='text'
                  value={billDate}
                  onChange={e => setBillDate(e.target.value)}
                  className='input-field w-full pl-3 pr-10 py-3 rounded-xl border border-gray-200'
                />
                <Calendar className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
              </div>
            </div>
            <div>
              <label
                htmlFor='bill-due-date'
                className='form-label text-gray-900 block mb-1'
              >
                Due Date
              </label>
              <div className='relative'>
                <input
                  id='bill-due-date'
                  type='text'
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className='input-field w-full pl-3 pr-10 py-3 rounded-xl border border-gray-200'
                />
                <Calendar className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor='bill-terms'
              className='form-label text-gray-900 block mb-1'
            >
              Terms
            </label>
            <div className='relative'>
              <button
                type='button'
                id='bill-terms'
                onClick={() => {
                  setTermsOpen(!termsOpen);
                  setVendorOpen(false);
                }}
                className='input-field w-full pl-3 pr-10 py-3 rounded-xl border border-gray-200 flex items-center justify-between text-left'
              >
                <span className={terms ? 'text-gray-900' : 'text-gray-500'}>
                  {terms || 'Select'}
                </span>
                <ChevronDown className='h-4 w-4 text-gray-400 shrink-0 absolute right-3 top-1/2 -translate-y-1/2' />
              </button>
              {termsOpen && (
                <div className='absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg py-1'>
                  {TERMS_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      type='button'
                      onClick={() => {
                        setTerms(opt);
                        setTermsOpen(false);
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

          {/* Line items table */}
          <div>
            <div className='overflow-x-auto border border-gray-200 rounded-xl'>
              <table className='w-full min-w-[520px] text-sm'>
                <thead>
                  <tr className='bg-gray-50 text-left text-gray-600 font-medium border-b border-gray-200'>
                    <th className='w-9 py-3 pl-3' aria-label='Reorder' />
                    <th className='py-3 px-2'>Category</th>
                    <th className='py-3 px-2'>Account Number</th>
                    <th className='py-3 px-2'>Description</th>
                    <th className='py-3 px-2 text-right'>Total</th>
                    <th className='w-9 py-3 pr-3' aria-label='Remove' />
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map(item => (
                    <tr
                      key={item.id}
                      className='border-b border-gray-100 last:border-0'
                    >
                      <td className='py-2 pl-3'>
                        <button
                          type='button'
                          className='p-1 text-gray-400 hover:text-gray-600 cursor-grab'
                          aria-label='Drag to reorder'
                        >
                          <GripVertical className='h-4 w-4' />
                        </button>
                      </td>
                      <td className='py-2 px-2'>
                        <input
                          type='text'
                          value={item.category}
                          onChange={e =>
                            updateLineItem(item.id, 'category', e.target.value)
                          }
                          placeholder='Select'
                          className='input-field w-full min-w-[80px] py-2 rounded-lg border border-gray-200 text-sm'
                        />
                      </td>
                      <td className='py-2 px-2'>
                        <input
                          type='text'
                          value={item.accountNumber}
                          onChange={e =>
                            updateLineItem(
                              item.id,
                              'accountNumber',
                              e.target.value
                            )
                          }
                          placeholder=''
                          className='input-field w-full min-w-[80px] py-2 rounded-lg border border-gray-200 text-sm'
                        />
                      </td>
                      <td className='py-2 px-2'>
                        <input
                          type='text'
                          value={item.description}
                          onChange={e =>
                            updateLineItem(
                              item.id,
                              'description',
                              e.target.value
                            )
                          }
                          placeholder=''
                          className='input-field w-full min-w-[80px] py-2 rounded-lg border border-gray-200 text-sm'
                        />
                      </td>
                      <td className='py-2 px-2 text-right'>
                        <input
                          type='text'
                          value={item.total}
                          onChange={e =>
                            updateLineItem(item.id, 'total', e.target.value)
                          }
                          placeholder=''
                          className='input-field w-full min-w-[70px] py-2 rounded-lg border border-gray-200 text-sm text-right'
                        />
                      </td>
                      <td className='py-2 pr-3'>
                        <button
                          type='button'
                          onClick={() => removeLineItem(item.id)}
                          className='p-1 text-gray-400 hover:text-red-600'
                          aria-label='Remove line'
                        >
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type='button'
              onClick={addLineItem}
              className='mt-2 text-sm font-medium text-[#073E60] hover:underline flex items-center gap-1'
            >
              + Add product/item
            </button>
          </div>

          {/* Payment Memo + Total Amount Due */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-start'>
            <div>
              <label
                htmlFor='bill-payment-memo'
                className='form-label text-gray-900 block mb-1'
              >
                Payment Memo
              </label>
              <textarea
                id='bill-payment-memo'
                value={paymentMemo}
                onChange={e => setPaymentMemo(e.target.value)}
                placeholder='This invoice covers all mandatory...'
                rows={3}
                className='input-field w-full pl-3 py-3 rounded-xl border border-gray-200 resize-none'
              />
            </div>
            <div className='md:text-right'>
              <label className='form-label text-gray-900 block mb-1'>
                Total Amount Due
              </label>
              <p className='text-lg font-semibold text-gray-900'>
                {formatNaira(totalAmountDue)}
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );

  return createPortal(content, document.body);
};

export default AddBillDrawer;
