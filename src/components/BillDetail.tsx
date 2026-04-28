import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ArrowLeft, Calendar, Mail, Printer } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getOrganisation } from '@/services/authApi';
import { getBill, type BillResponse } from '@/services/billsApi';
import type { components } from '@/generated/api';

type BillLineItemResponse = components['schemas']['BillLineItemResponse'];

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

function useBillDetail(): {
  organisationId: string;
  bill?: BillResponse;
  isLoading: boolean;
  error: unknown;
} {
  const { billId } = useParams<{ billId: string }>();
  const { profiles } = useProfile();
  const organisationId = profiles[0]?.organisation_id ?? '';

  const { data, isLoading, error } = useQuery(
    ['bill', organisationId, billId],
    () => getBill(organisationId, billId ?? ''),
    {
      enabled: Boolean(organisationId && billId),
    }
  );

  return { organisationId, bill: data, isLoading, error };
}

function BillLineItemsTable({
  items,
  currencyFormatter,
}: {
  items: BillLineItemResponse[];
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
                  No line items on this bill.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const BillDetail: React.FC = () => {
  const navigate = useNavigate();
  const { organisationId, bill, isLoading, error } = useBillDetail();
  const { formatCurrency } = useCurrency();

  const { data: organisation } = useQuery(
    ['organisation', organisationId],
    () => getOrganisation(organisationId),
    { enabled: Boolean(organisationId) }
  );

  const [activeView, setActiveView] = useState<ActiveView>('view');

  const totals = useMemo(() => {
    if (!bill) {
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
      subtotal: toNumber(bill.subtotal),
      tax: toNumber(bill.tax_total),
      discount: toNumber(bill.discount_total),
      total: toNumber(bill.total),
    };
  }, [bill]);

  const organisationName = organisation?.name ?? 'Your organisation';
  const organisationEmail = '';
  const organisationAddress = '';

  const vendorId = bill?.vendor_id;

  const emailSubject = bill
    ? `Bill ${bill.bill_number || bill.id} from ${organisationName}`
    : 'Bill';

  const emailBody = bill
    ? `Hello,\n\nPlease find your bill ${
        bill.bill_number || bill.id
      } dated ${formatDate(bill.bill_date)} for ${formatCurrency(
        totals.total
      )}.\n\nBest regards,\n${organisationName}`
    : '';

  const handlePrint = () => {
    window.print();
  };

  if (!organisationId) {
    return (
      <div className='max-w-4xl mx-auto py-8'>
        <p className='text-sm text-gray-600 dark:text-gray-300'>
          No organisation in context. Complete onboarding to view bills.
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

  if (error || !bill) {
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
          Failed to load bill details.
        </p>
      </div>
    );
  }

  const createdAt = formatDateTime(bill.created_at);
  const dueDate = formatDate(bill.due_date);

  return (
    <div className='max-w-5xl mx-auto'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 print:hidden'>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={() => navigate('/purchase/bills')}
            className='p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'
          >
            <ArrowLeft className='h-5 w-5' />
          </button>
          <div>
            <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
              Bill {bill.bill_number || bill.id}
            </h1>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Created {createdAt}
              {dueDate && ` · Due ${dueDate}`}
            </p>
          </div>
        </div>
        <div className='flex flex-wrap gap-2'>
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
              ? 'Bill view'
              : view === 'pdf'
                ? 'PDF view'
                : 'Email view'}
          </button>
        ))}
      </div>

      <div className='bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6 print:bg-white print:text-black'>
        {activeView === 'email' ? (
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1'>
                To
              </label>
              <div className='flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100'>
                <Mail className='h-4 w-4 text-gray-400' />
                <span>{vendorId ?? 'Vendor'}</span>
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1'>
                Subject
              </label>
              <input
                type='text'
                readOnly
                value={emailSubject}
                className='input-field w-full'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1'>
                Message preview
              </label>
              <textarea
                readOnly
                value={emailBody}
                rows={8}
                className='input-field w-full resize-none'
              />
            </div>
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
                    Bill date:{' '}
                    <span className='font-medium'>
                      {formatDate(bill.bill_date)}
                    </span>
                  </span>
                </div>
                <div className='flex items-center gap-2 text-gray-700 dark:text-gray-200'>
                  <Calendar className='h-4 w-4 text-gray-400' />
                  <span>
                    Due date:{' '}
                    <span className='font-medium'>
                      {formatDate(bill.due_date)}
                    </span>
                  </span>
                </div>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  Status:{' '}
                  <span className='font-medium capitalize'>
                    {String(bill.status)}
                  </span>
                </p>
              </div>
            </div>

            <BillLineItemsTable
              items={bill.line_items ?? []}
              currencyFormatter={formatCurrency}
            />

            <div className='flex flex-col md:flex-row md:justify-between gap-6'>
              <div className='space-y-2 text-sm text-gray-600 dark:text-gray-300'>
                <p className='font-medium text-gray-900 dark:text-gray-100'>
                  Notes
                </p>
                <p>{bill.notes || 'No additional notes.'}</p>
                {vendorId && (
                  <p className='text-sm'>
                    Vendor:{' '}
                    <Link
                      to='/purchase/vendor'
                      className='text-[#073E60] dark:text-primary-400 hover:underline'
                    >
                      {vendorId}
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

export default BillDetail;
