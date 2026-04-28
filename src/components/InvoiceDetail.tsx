import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { ArrowLeft, Calendar, Mail, Printer } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getOrganisation } from '@/services/authApi';
import {
  getPaystackIntegration,
  initPaystackInvoicePayment,
} from '@/services/paystackApi';
import {
  getInvoice,
  getInvoiceEmailPreview,
  sendInvoiceEmail,
  type InvoiceResponse,
  type InvoiceLineItemResponse,
} from '@/services/invoicesApi';

type ActiveView = 'view' | 'pdf' | 'email';

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function useInvoiceDetail(): {
  organisationId: string;
  invoice?: InvoiceResponse;
  isLoading: boolean;
  error: unknown;
} {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const { profiles } = useProfile();
  const organisationId = profiles[0]?.organisation_id ?? '';

  const { data, isLoading, error } = useQuery(
    ['invoice', organisationId, invoiceId],
    () =>
      getInvoice(organisationId, invoiceId ?? '').then(inv => {
        return inv;
      }),
    {
      enabled: Boolean(organisationId && invoiceId),
    }
  );

  return { organisationId, invoice: data, isLoading, error };
}

function InvoiceLineItemsTable({
  items,
  currencyFormatter,
}: {
  items: InvoiceLineItemResponse[];
  currencyFormatter: (n: number) => string;
}) {
  return (
    <section className='card overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full min-w-[600px] text-sm'>
          <thead>
            <tr className='text-left text-gray-600 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700'>
              <th className='py-3 px-2'>Item</th>
              <th className='py-3 px-2'>Description</th>
              <th className='py-3 px-2 text-right'>Qty</th>
              <th className='py-3 px-2 text-right'>Unit price</th>
              <th className='py-3 px-2 text-right'>Tax</th>
              <th className='py-3 px-2 text-right'>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const qty = Number.parseFloat(item.quantity || '0');
              const unit = Number.parseFloat(item.unit_price || '0');
              const tax = Number.parseFloat(item.tax || '0');
              const amount = Number.parseFloat(item.amount || '0');
              return (
                <tr
                  key={item.id}
                  className='border-b border-gray-100 dark:border-gray-700'
                >
                  <td className='py-2 px-2 text-gray-900 dark:text-gray-100'>
                    {item.product_id ?? item.coa_id ?? '—'}
                  </td>
                  <td className='py-2 px-2 text-gray-700 dark:text-gray-300'>
                    {item.description ?? '—'}
                  </td>
                  <td className='py-2 px-2 text-right tabular-nums text-gray-700 dark:text-gray-300'>
                    {Number.isFinite(qty) ? qty : '—'}
                  </td>
                  <td className='py-2 px-2 text-right tabular-nums text-gray-700 dark:text-gray-300'>
                    {Number.isFinite(unit) ? currencyFormatter(unit) : '—'}
                  </td>
                  <td className='py-2 px-2 text-right tabular-nums text-gray-700 dark:text-gray-300'>
                    {Number.isFinite(tax) ? currencyFormatter(tax) : '—'}
                  </td>
                  <td className='py-2 px-2 text-right tabular-nums text-gray-900 dark:text-gray-100'>
                    {currencyFormatter(Number.isFinite(amount) ? amount : 0)}
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className='py-4 px-2 text-center text-sm text-gray-500 dark:text-gray-400'
                >
                  No line items on this invoice.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const InvoiceDetail: React.FC = () => {
  const navigate = useNavigate();
  const { organisationId, invoice, isLoading, error } = useInvoiceDetail();
  const { formatCurrency } = useCurrency();

  const { data: organisation } = useQuery(
    ['organisation', organisationId],
    () => getOrganisation(organisationId),
    { enabled: Boolean(organisationId) }
  );

  const { data: paystackIntegration } = useQuery(
    ['paystack-integration', organisationId],
    () => getPaystackIntegration(organisationId),
    { enabled: Boolean(organisationId) }
  );

  const [activeView, setActiveView] = useState<ActiveView>('view');

  const totals = useMemo(() => {
    if (!invoice) {
      return {
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
      };
    }
    const toNumber = (v: unknown): number => {
      const n = typeof v === 'string' ? Number.parseFloat(v) : Number(v ?? 0);
      return Number.isFinite(n) ? n : 0;
    };
    return {
      subtotal: toNumber(invoice.subtotal),
      tax: toNumber(invoice.tax_total),
      discount: toNumber(invoice.discount_total),
      total: toNumber(invoice.total),
    };
  }, [invoice]);

  const organisationName = organisation?.name ?? 'Your organisation';
  const organisationEmail = '';
  const organisationAddress = '';

  const customerId = invoice?.customer_id;

  const { data: emailPreview, isLoading: isEmailPreviewLoading } = useQuery(
    ['invoice-email-preview', organisationId, invoice?.id],
    () => getInvoiceEmailPreview(organisationId, invoice?.id ?? ''),
    {
      enabled: Boolean(organisationId && invoice?.id && activeView === 'email'),
    }
  );

  const sendEmailMutation = useMutation(() =>
    sendInvoiceEmail(organisationId, invoice?.id ?? '', emailPreview?.to)
  );

  const payNowMutation = useMutation(async () => {
    const res = await initPaystackInvoicePayment(
      organisationId,
      invoice?.id ?? ''
    );
    window.location.assign(res.authorization_url);
  });

  const handlePrint = () => {
    window.print();
  };

  if (!organisationId) {
    return (
      <div className='max-w-4xl mx-auto py-8'>
        <p className='text-sm text-gray-600 dark:text-gray-300'>
          No organisation in context. Complete onboarding to view invoices.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='max-w-5xl mx-auto py-8 space-y-4'>
        <div className='h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
        <div className='h-32 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse' />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className='max-w-4xl mx-auto py-8 space-y-4'>
        <button
          type='button'
          onClick={() => navigate(-1)}
          className='inline-flex items-center gap-2 text-sm text-[#073E60] dark:text-primary-400 hover:underline'
        >
          <ArrowLeft className='h-4 w-4' />
          Back
        </button>
        <p className='text-sm text-red-600 dark:text-red-400'>
          Failed to load invoice details.
        </p>
      </div>
    );
  }

  const createdAt = formatDateTime(invoice.created_at);
  const dueDate = formatDate(invoice.due_date);
  const canPayNow =
    paystackIntegration?.enabled === true &&
    paystackIntegration?.has_secret_key === true &&
    !['paid', 'cancelled'].includes(invoice.status);

  return (
    <div className='max-w-5xl mx-auto'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 print:hidden'>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={() => navigate('/sales/invoice')}
            className='p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'
          >
            <ArrowLeft className='h-5 w-5' />
          </button>
          <div>
            <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
              Invoice {invoice.invoice_number || invoice.id}
            </h1>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Created {createdAt}
              {dueDate && ` · Due ${dueDate}`}
            </p>
          </div>
        </div>
        <div className='flex flex-wrap gap-2'>
          {canPayNow && (
            <button
              type='button'
              disabled={payNowMutation.isLoading}
              onClick={() => payNowMutation.mutate()}
              className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-[#073E60] text-white hover:bg-[#052d47] disabled:opacity-70'
            >
              {payNowMutation.isLoading ? 'Opening checkout…' : 'Pay now'}
            </button>
          )}
          <button
            type='button'
            onClick={() => navigate(`/sales/invoice/${invoice.id}/edit`)}
            className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-[#073E60] dark:border-primary-500 text-[#073E60] dark:text-primary-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
          >
            Edit invoice
          </button>
          <button
            type='button'
            onClick={handlePrint}
            className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
          >
            <Printer className='h-4 w-4' />
            Print
          </button>
        </div>
      </div>

      <div className='flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit mb-6 print:hidden'>
        {(['view', 'pdf', 'email'] as const).map(view => (
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
            {view === 'view'
              ? 'Invoice view'
              : view === 'pdf'
                ? 'PDF view'
                : 'Email view'}
          </button>
        ))}
      </div>

      <div
        className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6 ${
          activeView === 'pdf'
            ? 'print:bg-white print:text-black'
            : 'print:bg-white print:text-black'
        }`}
      >
        {activeView === 'email' ? (
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1'>
                To
              </label>
              <div className='flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100'>
                <Mail className='h-4 w-4 text-gray-400' />
                <span>
                  {/* Customer email is not projected yet; fall back to ID */}
                  {customerId ?? 'Customer'}
                </span>
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1'>
                Subject
              </label>
              <input
                type='text'
                readOnly
                value={emailPreview?.subject ?? 'Loading subject...'}
                className='input-field w-full'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1'>
                Message preview
              </label>
              <textarea
                readOnly
                value={
                  isEmailPreviewLoading
                    ? 'Loading email preview...'
                    : (emailPreview?.text_body ?? 'No preview available')
                }
                rows={8}
                className='input-field w-full resize-none'
              />
            </div>
            <div className='flex justify-end'>
              <button
                type='button'
                onClick={() => sendEmailMutation.mutate()}
                disabled={
                  sendEmailMutation.isLoading ||
                  isEmailPreviewLoading ||
                  !emailPreview?.to
                }
                className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-[#073E60] text-white hover:bg-[#052d47] disabled:opacity-60'
              >
                {sendEmailMutation.isLoading
                  ? 'Sending…'
                  : 'Send invoice email'}
              </button>
            </div>
            {sendEmailMutation.isSuccess ? (
              <p className='text-sm text-green-700 dark:text-green-400'>
                Invoice email queued successfully.
              </p>
            ) : null}
            {sendEmailMutation.isError ? (
              <p className='text-sm text-red-600 dark:text-red-400'>
                Failed to send invoice email.
              </p>
            ) : null}
          </div>
        ) : (
          <>
            <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-6'>
              <div className='space-y-1'>
                <p className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
                  {organisationName}
                </p>
                {organisationEmail && (
                  <a
                    href={`mailto:${organisationEmail}`}
                    className='text-sm text-[#073E60] dark:text-primary-400 hover:underline'
                  >
                    {organisationEmail}
                  </a>
                )}
                {organisationAddress && (
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    {organisationAddress}
                  </p>
                )}
              </div>
              <div className='space-y-1 text-sm'>
                <div className='flex items-center gap-2 text-gray-700 dark:text-gray-200'>
                  <Calendar className='h-4 w-4 text-gray-400' />
                  <span>
                    Issue date:{' '}
                    <span className='font-medium'>
                      {formatDate(invoice.issue_date)}
                    </span>
                  </span>
                </div>
                <div className='flex items-center gap-2 text-gray-700 dark:text-gray-200'>
                  <Calendar className='h-4 w-4 text-gray-400' />
                  <span>
                    Due date:{' '}
                    <span className='font-medium'>
                      {formatDate(invoice.due_date)}
                    </span>
                  </span>
                </div>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  Status:{' '}
                  <span className='font-medium capitalize'>
                    {invoice.status.replace('_', ' ')}
                  </span>
                </p>
              </div>
            </div>

            <InvoiceLineItemsTable
              items={invoice.line_items}
              currencyFormatter={formatCurrency}
            />

            <div className='flex flex-col md:flex-row md:justify-between gap-6'>
              <div className='space-y-2 text-sm text-gray-600 dark:text-gray-300'>
                <p className='font-medium text-gray-900 dark:text-gray-100'>
                  Notes
                </p>
                <p>{invoice.notes || 'No additional notes.'}</p>
                {customerId && (
                  <p className='text-sm'>
                    Customer:{' '}
                    <Link
                      to={`/sales/customers`}
                      className='text-[#073E60] dark:text-primary-400 hover:underline'
                    >
                      {customerId}
                    </Link>
                  </p>
                )}
              </div>
              <div className='w-full max-w-xs ml-auto'>
                <dl className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <dt className='text-gray-600 dark:text-gray-300'>
                      Subtotal
                    </dt>
                    <dd className='font-medium text-gray-900 dark:text-gray-100 tabular-nums'>
                      {formatCurrency(totals.subtotal)}
                    </dd>
                  </div>
                  <div className='flex justify-between'>
                    <dt className='text-gray-600 dark:text-gray-300'>Tax</dt>
                    <dd className='font-medium text-gray-900 dark:text-gray-100 tabular-nums'>
                      {formatCurrency(totals.tax)}
                    </dd>
                  </div>
                  <div className='flex justify-between'>
                    <dt className='text-gray-600 dark:text-gray-300'>
                      Discount
                    </dt>
                    <dd className='font-medium text-gray-900 dark:text-gray-100 tabular-nums'>
                      −{formatCurrency(totals.discount)}
                    </dd>
                  </div>
                  <div className='border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 flex justify-between items-center'>
                    <dt className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
                      Total
                    </dt>
                    <dd className='text-lg font-semibold text-gray-900 dark:text-gray-100 tabular-nums'>
                      {formatCurrency(totals.total)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetail;
