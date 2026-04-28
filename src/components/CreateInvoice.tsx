import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import {
  X,
  ChevronDown,
  GripVertical,
  Plus,
  Trash2,
  Calendar,
  Info,
  ImagePlus,
} from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { getOrganisation } from '@/services/authApi';
import { useCurrency } from '@/contexts/CurrencyContext';
import {
  createInvoice,
  getInvoice,
  sendInvoiceEmail,
  updateInvoice,
  type InvoiceCreateRequest,
  type InvoiceLineItemRequest,
} from '@/services/invoicesApi';
import { listCustomers, type CustomerResponse } from '@/services/customersApi';
import { listProducts, type ProductResponse } from '@/services/productsApi';
import { listCoas, type ChartOfAccountResponse } from '@/services/coaApi';

const MAX_LOGO_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const isEditMode = Boolean(invoiceId);
  const { formatCurrency, currencyCode } = useCurrency();
  const { profiles } = useProfile();
  const organisationId = profiles[0]?.organisation_id ?? '';

  const { data: organisation } = useQuery(
    ['organisation', organisationId],
    () => getOrganisation(organisationId),
    { enabled: Boolean(organisationId) }
  );

  const companyLogoUrl = organisation?.logo_url ?? null;
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const displayLogoUrl = uploadedLogoUrl ?? companyLogoUrl;

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_LOGO_SIZE_BYTES) {
      return; // TODO: optional toast "Max 5MB"
    }
    if (!file.type.startsWith('image/')) return;
    if (uploadedLogoUrl) URL.revokeObjectURL(uploadedLogoUrl);
    setUploadedLogoUrl(URL.createObjectURL(file));
    e.target.value = '';
  };

  const removeUploadedLogo = () => {
    if (uploadedLogoUrl) {
      URL.revokeObjectURL(uploadedLogoUrl);
      setUploadedLogoUrl(null);
    }
  };

  const [activeView, setActiveView] = useState<'edit' | 'pdf' | 'email'>(
    'edit'
  );
  const today = useMemo(() => new Date(), []);
  const initialIssue = today.toISOString().slice(0, 10);
  const initialDue = (() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  })();

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [issueDate, setIssueDate] = useState(initialIssue);
  const [dueDate, setDueDate] = useState(initialDue);
  const [poOrder, setPoOrder] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [paymentMemo, setPaymentMemo] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [items, setItems] = useState<
    {
      id: string;
      productId: string | null;
      accountId: string | null;
      description: string;
      qty: string;
      unitPrice: string;
      tax: string;
    }[]
  >([
    {
      id: '1',
      productId: null,
      accountId: null,
      description: '',
      qty: '1',
      unitPrice: '',
      tax: '',
    },
  ]);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const qty = parseFloat(item.qty || '0');
        const price = parseFloat(item.unitPrice || '0');
        if (!Number.isFinite(qty) || !Number.isFinite(price)) return sum;
        return sum + qty * price;
      }, 0),
    [items]
  );

  const taxTotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const tax = parseFloat(item.tax || '0');
        return sum + (Number.isFinite(tax) ? tax : 0);
      }, 0),
    [items]
  );

  const discountAmount = useMemo(
    () => (discountPercent > 0 ? (subtotal * discountPercent) / 100 : 0),
    [subtotal, discountPercent]
  );

  const total = subtotal + taxTotal - discountAmount;

  const addItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: String(Date.now()),
        productId: null,
        accountId: null,
        description: '',
        qty: '1',
        unitPrice: '',
        tax: '',
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(prev => prev.filter(i => i.id !== id));
  };

  const { data: customersData } = useQuery(
    ['customers', 'invoice-form', organisationId],
    () =>
      listCustomers(organisationId, {
        page: 1,
        page_size: 50,
      }),
    { enabled: Boolean(organisationId) }
  );

  const { data: productsData } = useQuery(
    ['products', 'invoice-form', organisationId],
    () =>
      listProducts(organisationId, {
        page: 1,
        page_size: 100,
        status: 'active' as never,
      }),
    { enabled: Boolean(organisationId) }
  );

  const productPriceById = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of productsData?.items ?? []) {
      const priceValue = (p as ProductResponse & { price?: string | number })
        .price;
      map.set(p.id, String(priceValue ?? '0'));
    }
    return map;
  }, [productsData]);

  const { data: coasData } = useQuery(
    ['coa', 'invoice-form', organisationId],
    () =>
      listCoas(organisationId, {
        page: 1,
        page_size: 100,
      }),
    { enabled: Boolean(organisationId) }
  );

  const { data: existingInvoice } = useQuery(
    ['invoice', organisationId, invoiceId, 'edit-form'],
    () => getInvoice(organisationId, invoiceId ?? ''),
    { enabled: Boolean(organisationId && invoiceId) }
  );

  const createMutation = useMutation((payload: InvoiceCreateRequest) =>
    createInvoice(organisationId, payload)
  );

  const updateMutation = useMutation(
    (payload: { invoiceId: string; body: InvoiceCreateRequest }) =>
      updateInvoice(organisationId, payload.invoiceId, payload.body)
  );

  useEffect(() => {
    if (!existingInvoice) return;
    setInvoiceNumber(existingInvoice.invoice_number ?? '');
    setIssueDate(existingInvoice.issue_date);
    setDueDate(existingInvoice.due_date);
    setCustomerId(existingInvoice.customer_id);
    setPaymentMemo(existingInvoice.notes ?? '');
    const subtotalAmount = Number.parseFloat(existingInvoice.subtotal || '0');
    const discountAmount = Number.parseFloat(
      existingInvoice.discount_total || '0'
    );
    if (
      Number.isFinite(subtotalAmount) &&
      subtotalAmount > 0 &&
      Number.isFinite(discountAmount)
    ) {
      setDiscountPercent((discountAmount / subtotalAmount) * 100);
    } else {
      setDiscountPercent(0);
    }
    setItems(
      existingInvoice.line_items.length > 0
        ? existingInvoice.line_items.map(li => ({
            id: li.id,
            productId: li.product_id ?? null,
            accountId: li.coa_id ?? null,
            description: li.description ?? '',
            qty: li.quantity ?? '',
            unitPrice: li.unit_price ?? '',
            tax: li.tax ?? '',
          }))
        : [
            {
              id: '1',
              productId: null,
              accountId: null,
              description: '',
              qty: '',
              unitPrice: '',
              tax: '',
            },
          ]
    );
  }, [existingInvoice]);

  useEffect(() => {
    if (!existingInvoice || !customersData?.items) return;
    const selected = customersData.items.find(
      c => c.id === existingInvoice.customer_id
    );
    if (!selected) return;
    setCustomerName(selected.name);
    setCustomerEmail(selected.email ?? '');
    setBillingAddress(selected.billing_address ?? '');
  }, [customersData, existingInvoice]);

  const buildLineItems = (): InvoiceLineItemRequest[] => {
    return items
      .map<InvoiceLineItemRequest | null>((item, index) => {
        const qty = parseFloat(item.qty || '0');
        const price = parseFloat(item.unitPrice || '0');
        const tax = parseFloat(item.tax || '0');
        const hasRef = item.productId || item.accountId;
        if (!hasRef) {
          return null;
        }
        if (!Number.isFinite(qty) || !Number.isFinite(price)) {
          return null;
        }
        const amount = qty * price;
        return {
          product_id: item.productId,
          coa_id: item.accountId,
          description: item.description || null,
          quantity: qty.toString(),
          unit_price: price.toString(),
          amount: amount.toString(),
          tax: Number.isFinite(tax) ? tax.toString() : '0',
          sort_order: index,
        };
      })
      .filter((li): li is InvoiceLineItemRequest => li !== null);
  };

  const handleSave = async (status: 'draft' | 'sent') => {
    if (!organisationId) return;
    if (!customerId) {
      // Basic guard; in a real app this would be a toast.
      // eslint-disable-next-line no-alert
      alert('Please select a customer before saving the invoice.');
      return;
    }
    const lineItems = buildLineItems();
    if (lineItems.length === 0) {
      // eslint-disable-next-line no-alert
      alert(
        'Please add at least one line item with a product or account, quantity, and unit price.'
      );
      return;
    }
    const payload: InvoiceCreateRequest = {
      customer_id: customerId,
      invoice_number: invoiceNumber || null,
      issue_date: issueDate,
      due_date: dueDate,
      status,
      currency: currencyCode,
      notes: paymentMemo || null,
      discount_total: discountAmount.toString(),
      line_items: lineItems,
    };
    try {
      const saved =
        isEditMode && invoiceId
          ? await updateMutation.mutateAsync({ invoiceId, body: payload })
          : await createMutation.mutateAsync(payload);
      if (status === 'sent') {
        await sendInvoiceEmail(
          organisationId,
          saved.id,
          customerEmail.trim() || undefined
        );
      }
      navigate(isEditMode ? `/sales/invoice/${saved.id}` : '/sales/invoice');
    } catch {
      // mutation error states already handled by react-query
    }
  };

  return (
    <div className='max-w-6xl mx-auto'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={() => navigate('/sales/invoice')}
            className='p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'
            aria-label='Close'
          >
            <X className='h-5 w-5' />
          </button>
          <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
            {isEditMode ? 'Edit invoice' : 'Create invoice'}
          </h1>
        </div>
        <div className='flex flex-wrap gap-2'>
          <button
            type='button'
            onClick={() => handleSave('draft')}
            className='px-4 py-2 text-sm font-medium rounded-xl border border-[#073E60] dark:border-primary-500 text-[#073E60] dark:text-primary-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
            disabled={createMutation.isLoading || updateMutation.isLoading}
          >
            {createMutation.isLoading || updateMutation.isLoading
              ? 'Saving…'
              : 'Save'}
          </button>
          <button
            type='button'
            onClick={() => handleSave('sent')}
            className='px-4 py-2 text-sm font-medium rounded-xl bg-[#073E60] text-white hover:bg-[#052d47]'
            disabled={createMutation.isLoading || updateMutation.isLoading}
          >
            {createMutation.isLoading || updateMutation.isLoading
              ? 'Saving…'
              : 'Save and send'}
          </button>
        </div>
      </div>

      {/* View tabs */}
      <div className='flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit mb-6'>
        {(['edit', 'pdf', 'email'] as const).map(view => (
          <button
            key={view}
            type='button'
            onClick={() => setActiveView(view)}
            className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
              activeView === view
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
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
            <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
              Invoice Details
            </h2>
            <div className='space-y-4'>
              <div className='text-sm'>
                <p className='font-semibold text-gray-900 dark:text-gray-100'>
                  {organisation?.name ?? 'Your business'}
                </p>
                {organisation?.website && (
                  <a
                    href={
                      organisation.website.startsWith('http')
                        ? organisation.website
                        : `https://${organisation.website}`
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[#073E60] dark:text-primary-400 hover:underline block'
                  >
                    {organisation.website}
                  </a>
                )}
                {organisation?.description && (
                  <p className='text-gray-600 dark:text-gray-300'>
                    {organisation.description}
                  </p>
                )}
                <Link
                  to='/settings/company'
                  className='text-[#073E60] dark:text-primary-400 text-sm font-medium hover:underline mt-1 inline-block'
                >
                  Edit business &gt;
                </Link>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='form-label text-gray-900 dark:text-gray-200'>
                    Customer Name
                  </label>
                  <div className='relative'>
                    <button
                      type='button'
                      onClick={() => setCustomerDropdownOpen(open => !open)}
                      className='input-field w-full pl-3 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 flex items-center justify-between text-left'
                    >
                      <span
                        className={
                          customerName
                            ? 'text-gray-900 dark:text-gray-100'
                            : 'text-gray-500 dark:text-gray-400'
                        }
                      >
                        {customerName || 'Select a customer'}
                      </span>
                      <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500' />
                    </button>
                    {customerDropdownOpen && (
                      <div className='absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg py-1 max-h-64 overflow-y-auto'>
                        {(customersData?.items ?? []).map(
                          (c: CustomerResponse) => (
                            <button
                              key={c.id}
                              type='button'
                              onClick={() => {
                                setCustomerId(c.id);
                                setCustomerName(c.name);
                                setCustomerEmail(c.email ?? '');
                                setBillingAddress(c.billing_address ?? '');
                                setCustomerDropdownOpen(false);
                              }}
                              className='w-full px-3 py-2 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                            >
                              <span className='block font-medium'>
                                {c.name}
                              </span>
                              {c.email && (
                                <span className='block text-xs text-gray-500'>
                                  {c.email}
                                </span>
                              )}
                            </button>
                          )
                        )}
                        {customersData?.items?.length === 0 && (
                          <div className='px-3 py-2 text-sm text-gray-500'>
                            No customers found.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className='form-label text-gray-900 dark:text-gray-200'>
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
                <label className='form-label text-gray-900 dark:text-gray-200'>
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
                  <label className='form-label text-gray-900 dark:text-gray-200'>
                    Invoice Number
                  </label>
                  <input
                    type='text'
                    value={invoiceNumber}
                    onChange={e => setInvoiceNumber(e.target.value)}
                    placeholder='Auto-generate or enter'
                    className='input-field pl-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600'
                  />
                </div>
                <div>
                  <label className='form-label text-gray-900 dark:text-gray-200'>
                    Issue Date
                  </label>
                  <div className='relative'>
                    <input
                      type='date'
                      value={issueDate}
                      onChange={e => setIssueDate(e.target.value)}
                      className='input-field pl-3 pr-10 py-2.5 rounded-xl border border-gray-200'
                    />
                    <Calendar className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                  </div>
                </div>
                <div>
                  <label className='form-label text-gray-900 dark:text-gray-200'>
                    Due Date
                  </label>
                  <div className='relative'>
                    <input
                      type='date'
                      value={dueDate}
                      onChange={e => setDueDate(e.target.value)}
                      className='input-field pl-3 pr-10 py-2.5 rounded-xl border border-gray-200'
                    />
                    <Calendar className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                  </div>
                </div>
                <div>
                  <label className='form-label text-gray-900 dark:text-gray-200 flex items-center gap-1'>
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
                  <tr className='text-left text-gray-600 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700'>
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
                    <tr
                      key={item.id}
                      className='border-b border-gray-100 dark:border-gray-700'
                    >
                      <td className='py-2 pl-2 text-gray-400 dark:text-gray-500'>
                        <GripVertical className='h-4 w-4' aria-hidden />
                      </td>
                      <td className='py-2 px-2'>
                        <select
                          value={item.productId ?? ''}
                          onChange={e =>
                            setItems(prev =>
                              prev.map(row =>
                                row.id === item.id
                                  ? {
                                      ...row,
                                      productId: e.target.value || null,
                                      unitPrice: e.target.value
                                        ? (productPriceById.get(
                                            e.target.value
                                          ) ?? '0')
                                        : row.unitPrice,
                                      qty: row.qty || '1',
                                    }
                                  : row
                              )
                            )
                          }
                          className='input-field py-2 px-2 rounded-lg border border-gray-200 text-sm w-full max-w-[160px]'
                        >
                          <option value=''>Select product</option>
                          {(productsData?.items ?? []).map(
                            (p: ProductResponse) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            )
                          )}
                        </select>
                      </td>
                      <td className='py-2 px-2'>
                        <select
                          value={item.accountId ?? ''}
                          onChange={e =>
                            setItems(prev =>
                              prev.map(row =>
                                row.id === item.id
                                  ? {
                                      ...row,
                                      accountId: e.target.value || null,
                                    }
                                  : row
                              )
                            )
                          }
                          className='input-field py-2 px-2 rounded-lg border border-gray-200 text-sm w-full max-w-[140px]'
                        >
                          <option value=''>Select account</option>
                          {(coasData?.items ?? []).map(
                            (c: ChartOfAccountResponse) => (
                              <option key={c.id} value={c.id}>
                                {c.code} — {c.name}
                              </option>
                            )
                          )}
                        </select>
                      </td>
                      <td className='py-2 px-2'>
                        <input
                          type='text'
                          value={item.description}
                          onChange={e =>
                            setItems(prev =>
                              prev.map(row =>
                                row.id === item.id
                                  ? { ...row, description: e.target.value }
                                  : row
                              )
                            )
                          }
                          className='input-field py-2 px-2 rounded-lg border border-gray-200 text-sm w-full max-w-[180px]'
                        />
                      </td>
                      <td className='py-2 px-2'>
                        <input
                          type='number'
                          min='0'
                          step='0.01'
                          value={item.qty}
                          onChange={e =>
                            setItems(prev =>
                              prev.map(row =>
                                row.id === item.id
                                  ? { ...row, qty: e.target.value }
                                  : row
                              )
                            )
                          }
                          className='input-field py-2 px-2 rounded-lg border border-gray-200 text-sm w-20'
                        />
                      </td>
                      <td className='py-2 px-2'>
                        <input
                          type='number'
                          min='0'
                          step='0.01'
                          value={item.unitPrice}
                          onChange={e =>
                            setItems(prev =>
                              prev.map(row =>
                                row.id === item.id
                                  ? { ...row, unitPrice: e.target.value }
                                  : row
                              )
                            )
                          }
                          className='input-field py-2 px-2 rounded-lg border border-gray-200 text-sm w-24'
                        />
                      </td>
                      <td className='py-2 px-2 text-gray-700 dark:text-gray-300'>
                        {(() => {
                          const qty = parseFloat(item.qty || '0');
                          const price = parseFloat(item.unitPrice || '0');
                          return formatCurrency(
                            Number.isFinite(qty * price) ? qty * price : 0
                          );
                        })()}
                      </td>
                      <td className='py-2 px-2'>
                        <input
                          type='number'
                          min='0'
                          step='0.01'
                          value={item.tax}
                          onChange={e =>
                            setItems(prev =>
                              prev.map(row =>
                                row.id === item.id
                                  ? { ...row, tax: e.target.value }
                                  : row
                              )
                            )
                          }
                          className='input-field py-2 px-2 rounded-lg border border-gray-200 text-sm w-full max-w-[100px]'
                        />
                      </td>
                      <td className='py-2 pr-2'>
                        <button
                          type='button'
                          onClick={() => removeItem(item.id)}
                          className='p-1.5 text-gray-400 dark:text-gray-500 hover:text-error-600 dark:hover:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 rounded'
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
            <div className='p-3 border-t border-gray-100 dark:border-gray-700'>
              <button
                type='button'
                onClick={addItem}
                className='inline-flex items-center gap-2 text-sm font-medium text-[#073E60] dark:text-primary-400 hover:underline'
              >
                <Plus className='h-4 w-4' />
                Add product/item
              </button>
            </div>
          </section>

          {/* Payment */}
          <section className='card'>
            <h3 className='form-label text-gray-900 dark:text-gray-200 mb-2'>
              Payment option
            </h3>
            <a
              href='#'
              className='text-[#073E60] dark:text-primary-400 text-sm hover:underline'
            >
              www.teddygoacademy.com/pay
            </a>
            <div className='mt-2 text-sm text-gray-600 dark:text-gray-300'>
              <p className='font-semibold text-gray-900 dark:text-gray-100'>
                BANK TRANSFER
              </p>
              <p className='text-gray-700 dark:text-gray-200'>
                Bank Name: XYZ Bank
              </p>
              <p className='text-gray-700 dark:text-gray-200'>
                Account No: 98765432145678
              </p>
              <p className='text-gray-700 dark:text-gray-200'>
                Account Name: {organisation?.name ?? 'Your business'}
              </p>
            </div>
            <button
              type='button'
              className='text-[#073E60] dark:text-primary-400 text-sm font-medium hover:underline dark:hover:text-primary-300 mt-1'
            >
              Edit payment option &gt;
            </button>
            <div className='mt-4'>
              <label className='form-label text-gray-900 dark:text-gray-200'>
                Payment Memo
              </label>
              <textarea
                value={paymentMemo}
                onChange={e => setPaymentMemo(e.target.value)}
                placeholder='This invoice covers all mandatory...'
                rows={2}
                className='input-field pl-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 w-full resize-none mt-1 placeholder-gray-500 dark:placeholder-gray-400'
              />
            </div>
          </section>
        </div>

        {/* Right sidebar - Summary + Logo */}
        <div className='xl:w-80 shrink-0 space-y-4'>
          <div className='card border-2 border-dashed border-gray-200 dark:border-gray-500 flex flex-col items-center justify-center py-8 px-4 text-center min-h-[140px]'>
            <input
              ref={logoInputRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleLogoFileChange}
            />
            {displayLogoUrl ? (
              <div className='relative w-full flex flex-col items-center'>
                <img
                  src={displayLogoUrl}
                  alt='Company logo'
                  className='max-h-20 w-auto object-contain'
                />
                <div className='flex gap-2 mt-2'>
                  <button
                    type='button'
                    onClick={() => logoInputRef.current?.click()}
                    className='text-xs font-medium text-[#073E60] dark:text-primary-400 hover:underline'
                  >
                    {uploadedLogoUrl ? 'Change logo' : 'Upload your own'}
                  </button>
                  {uploadedLogoUrl && (
                    <button
                      type='button'
                      onClick={removeUploadedLogo}
                      className='text-xs font-medium text-gray-500 dark:text-gray-400 hover:underline'
                    >
                      Use company logo
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <button
                type='button'
                onClick={() => logoInputRef.current?.click()}
                className='w-full flex flex-col items-center justify-center text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#073E60] dark:focus:ring-primary-500 rounded-lg'
              >
                <div className='w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-400 mb-2'>
                  <ImagePlus className='w-6 h-6' />
                </div>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-300'>
                  Add a logo
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                  Up to 5MB.
                </p>
              </button>
            )}
          </div>
          <div className='card'>
            <h3 className='text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3'>
              Invoice Summary
            </h3>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-600 dark:text-gray-300'>
                  Subtotal
                </span>
                <span className='font-medium text-gray-900 dark:text-gray-100'>
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600 dark:text-gray-300'>Tax</span>
                <span className='font-medium text-gray-900 dark:text-gray-100'>
                  {formatCurrency(taxTotal)}
                </span>
              </div>
              <div className='flex justify-between items-center gap-2'>
                <span className='text-gray-600 dark:text-gray-300'>
                  Discount percent
                </span>
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
                  <ChevronDown className='h-3 w-3 text-gray-400 dark:text-gray-500' />
                </div>
              </div>
              <div className='flex justify-between text-xs text-gray-500 dark:text-gray-400'>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
              <div className='flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600'>
                <span className='font-semibold text-gray-900 dark:text-gray-100'>
                  Total Amount Due
                </span>
                <span className='font-semibold text-gray-900 dark:text-gray-100'>
                  {formatCurrency(total)}
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
