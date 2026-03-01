import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ChevronDown,
  GripVertical,
  Plus,
  Trash2,
  Calendar,
  Info,
} from 'lucide-react';

const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'edit' | 'pdf' | 'email'>(
    'edit'
  );
  const [invoiceNumber] = useState('1006');
  const [issueDate, setIssueDate] = useState('16/04/2025');
  const [dueDate, setDueDate] = useState('30/04/2025');
  const [poOrder, setPoOrder] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [paymentMemo, setPaymentMemo] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [items, setItems] = useState([
    {
      id: '1',
      product: '',
      account: '',
      description: '',
      qty: '',
      unitPrice: '',
      tax: '',
    },
  ]);

  const subtotal = 0;
  const taxTotal = 0;
  const discountAmount = 0;
  const total = subtotal + taxTotal - discountAmount;

  const addItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: String(Date.now()),
        product: '',
        account: '',
        description: '',
        qty: '',
        unitPrice: '',
        tax: '',
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className='max-w-6xl mx-auto'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={() => navigate('/sales/invoice')}
            className='p-2 text-gray-500 hover:bg-gray-100 rounded-lg'
            aria-label='Close'
          >
            <X className='h-5 w-5' />
          </button>
          <h1 className='text-xl font-semibold text-gray-900'>
            Create invoice
          </h1>
        </div>
        <div className='flex flex-wrap gap-2'>
          <button
            type='button'
            className='px-4 py-2 text-sm font-medium rounded-xl border border-[#073E60] text-[#073E60] bg-white hover:bg-gray-50'
          >
            Save
          </button>
          <button
            type='button'
            className='px-4 py-2 text-sm font-medium rounded-xl bg-[#073E60] text-white hover:bg-[#052d47]'
          >
            Save and send
          </button>
        </div>
      </div>

      {/* View tabs */}
      <div className='flex gap-1 p-1 bg-gray-100 rounded-lg w-fit mb-6'>
        {(['edit', 'pdf', 'email'] as const).map(view => (
          <button
            key={view}
            type='button'
            onClick={() => setActiveView(view)}
            className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
              activeView === view
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {view === 'edit'
              ? 'Edit invoice'
              : view === 'pdf'
                ? 'PDF view'
                : 'Email view'}
          </button>
        ))}
      </div>

      <div className='flex flex-col xl:flex-row gap-6 xl:gap-8'>
        {/* Main form column */}
        <div className='flex-1 min-w-0 space-y-6'>
          {/* Invoice Details */}
          <section className='card'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>
              Invoice Details
            </h2>
            <div className='space-y-4'>
              <div className='text-sm'>
                <p className='font-semibold text-gray-900'>TEDDYGo Academy</p>
                <a
                  href='mailto:info@teddygoacademy.com'
                  className='text-[#073E60] hover:underline'
                >
                  info@teddygoacademy.com
                </a>
                <p className='text-gray-600'>
                  123 Learning Lane, City, State, ZIP
                </p>
                <p className='text-gray-600'>(123) 456-7890</p>
                <button
                  type='button'
                  className='text-[#073E60] text-sm font-medium hover:underline mt-1'
                >
                  Edit business &gt;
                </button>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='form-label text-gray-900'>
                    Customer Name
                  </label>
                  <div className='relative'>
                    <input
                      type='text'
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder='Find or add a customer'
                      className='input-field pl-3 pr-10 py-2.5 rounded-xl border border-gray-200'
                    />
                    <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                  </div>
                </div>
                <div>
                  <label className='form-label text-gray-900'>
                    Customer Email
                  </label>
                  <input
                    type='text'
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    placeholder='Separate emails with comma'
                    className='input-field pl-3 py-2.5 rounded-xl border border-gray-200'
                  />
                </div>
              </div>

              <div>
                <label className='form-label text-gray-900'>
                  Billing Address
                </label>
                <textarea
                  value={billingAddress}
                  onChange={e => setBillingAddress(e.target.value)}
                  placeholder='Enter billing address'
                  rows={2}
                  className='input-field pl-3 py-2.5 rounded-xl border border-gray-200 w-full resize-none'
                />
              </div>

              <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                <div>
                  <label className='form-label text-gray-900'>
                    Invoice Number
                  </label>
                  <input
                    type='text'
                    value={invoiceNumber}
                    readOnly
                    className='input-field pl-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50'
                  />
                </div>
                <div>
                  <label className='form-label text-gray-900'>Issue Date</label>
                  <div className='relative'>
                    <input
                      type='text'
                      value={issueDate}
                      onChange={e => setIssueDate(e.target.value)}
                      className='input-field pl-3 pr-10 py-2.5 rounded-xl border border-gray-200'
                    />
                    <Calendar className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                  </div>
                </div>
                <div>
                  <label className='form-label text-gray-900'>Due Date</label>
                  <div className='relative'>
                    <input
                      type='text'
                      value={dueDate}
                      onChange={e => setDueDate(e.target.value)}
                      className='input-field pl-3 pr-10 py-2.5 rounded-xl border border-gray-200'
                    />
                    <Calendar className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                  </div>
                </div>
                <div>
                  <label className='form-label text-gray-900 flex items-center gap-1'>
                    PO Order
                    <Info className='h-3.5 w-3.5 text-gray-400' aria-hidden />
                  </label>
                  <input
                    type='text'
                    value={poOrder}
                    onChange={e => setPoOrder(e.target.value)}
                    className='input-field pl-3 py-2.5 rounded-xl border border-gray-200'
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Product/Item table */}
          <section className='card overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full min-w-[600px] text-sm'>
                <thead>
                  <tr className='text-left text-gray-600 font-medium border-b border-gray-200'>
                    <th className='py-3 w-8' aria-hidden />
                    <th className='py-3 px-2'>Product/Item</th>
                    <th className='py-3 px-2'>Account Number</th>
                    <th className='py-3 px-2'>Description</th>
                    <th className='py-3 px-2'>Qty</th>
                    <th className='py-3 px-2'>Unit price</th>
                    <th className='py-3 px-2'>Total</th>
                    <th className='py-3 px-2'>Tax</th>
                    <th className='py-3 w-10' aria-hidden />
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} className='border-b border-gray-100'>
                      <td className='py-2 pl-2 text-gray-400'>
                        <GripVertical className='h-4 w-4' aria-hidden />
                      </td>
                      <td className='py-2 px-2'>
                        <input
                          type='text'
                          placeholder='Select'
                          className='input-field py-2 px-2 rounded-lg border border-gray-200 text-sm w-full max-w-[120px]'
                        />
                      </td>
                      <td className='py-2 px-2'>
                        <input
                          type='text'
                          className='input-field py-2 px-2 rounded-lg border border-gray-200 text-sm w-full max-w-[100px]'
                        />
                      </td>
                      <td className='py-2 px-2'>
                        <input
                          type='text'
                          className='input-field py-2 px-2 rounded-lg border border-gray-200 text-sm w-full max-w-[100px]'
                        />
                      </td>
                      <td className='py-2 px-2'>
                        <input
                          type='text'
                          className='input-field py-2 px-2 rounded-lg border border-gray-200 text-sm w-14'
                        />
                      </td>
                      <td className='py-2 px-2'>
                        <input
                          type='text'
                          className='input-field py-2 px-2 rounded-lg border border-gray-200 text-sm w-20'
                        />
                      </td>
                      <td className='py-2 px-2 text-gray-500'>—</td>
                      <td className='py-2 px-2'>
                        <input
                          type='text'
                          placeholder='Select'
                          className='input-field py-2 px-2 rounded-lg border border-gray-200 text-sm w-full max-w-[80px]'
                        />
                      </td>
                      <td className='py-2 pr-2'>
                        <button
                          type='button'
                          onClick={() => removeItem(item.id)}
                          className='p-1.5 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded'
                          aria-label='Remove row'
                        >
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='p-3 border-t border-gray-100'>
              <button
                type='button'
                onClick={addItem}
                className='inline-flex items-center gap-2 text-sm font-medium text-[#073E60] hover:underline'
              >
                <Plus className='h-4 w-4' />
                Add product/item
              </button>
            </div>
          </section>

          {/* Payment */}
          <section className='card'>
            <h3 className='form-label text-gray-900 mb-2'>Payment option</h3>
            <a href='#' className='text-[#073E60] text-sm hover:underline'>
              www.teddygoacademy.com/pay
            </a>
            <div className='mt-2 text-sm text-gray-600'>
              <p className='font-semibold text-gray-900'>BANK TRANSFER</p>
              <p>Bank Name: XYZ Bank</p>
              <p>Account No: 98765432145678</p>
              <p>Account Name: TEDDYGo Academy</p>
            </div>
            <button
              type='button'
              className='text-[#073E60] text-sm font-medium hover:underline mt-1'
            >
              Edit payment option &gt;
            </button>
            <div className='mt-4'>
              <label className='form-label text-gray-900'>Payment Memo</label>
              <textarea
                value={paymentMemo}
                onChange={e => setPaymentMemo(e.target.value)}
                placeholder='This invoice covers all mandatory...'
                rows={2}
                className='input-field pl-3 py-2.5 rounded-xl border border-gray-200 w-full resize-none mt-1'
              />
            </div>
          </section>
        </div>

        {/* Right sidebar - Summary + Logo */}
        <div className='xl:w-80 shrink-0 space-y-4'>
          <div className='card border-2 border-dashed border-gray-200 flex flex-col items-center justify-center py-8 px-4 text-center'>
            <div className='w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-2'>
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                aria-hidden
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14'
                />
              </svg>
            </div>
            <p className='text-sm font-medium text-gray-600'>Add a logo</p>
            <p className='text-xs text-gray-500 mt-0.5'>Up to 5MB.</p>
          </div>
          <div className='card'>
            <h3 className='text-sm font-semibold text-gray-900 mb-3'>
              Invoice Summary
            </h3>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Subtotal</span>
                <span className='font-medium text-gray-900'>
                  ₦{subtotal.toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Tax</span>
                <span className='font-medium text-gray-900'>
                  {taxTotal.toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between items-center gap-2'>
                <span className='text-gray-600'>Discount percent</span>
                <div className='flex items-center gap-1'>
                  <input
                    type='number'
                    value={discountPercent}
                    onChange={e =>
                      setDiscountPercent(Number(e.target.value) || 0)
                    }
                    min={0}
                    max={100}
                    className='input-field w-14 py-1.5 px-2 text-right text-sm'
                  />
                  <ChevronDown className='h-3 w-3 text-gray-400' />
                </div>
              </div>
              <div className='flex justify-between text-xs text-gray-500'>
                <span>-₦{discountAmount.toFixed(2)}</span>
              </div>
              <div className='flex justify-between pt-2 border-t border-gray-200'>
                <span className='font-semibold text-gray-900'>
                  Total Amount Due
                </span>
                <span className='font-semibold text-gray-900'>
                  ₦{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
