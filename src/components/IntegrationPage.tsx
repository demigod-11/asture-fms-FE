import React, { useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { ExternalLink, KeyRound, Search, ShieldCheck, X } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import Alert from '@/components/Alert';
import {
  getPaystackIntegration,
  upsertPaystackIntegration,
} from '@/services/paystackApi';
import { listBankAccounts } from '@/services/bankAccountsApi';
import { listCoas } from '@/services/coaApi';

type IntegrationCategory =
  | 'Payments'
  | 'Accounting'
  | 'Banking'
  | 'CRM'
  | 'Other';

type IntegrationId =
  | 'paystack'
  | 'stripe'
  | 'paypal'
  | 'bank_transfer'
  | 'quickbooks';

type IntegrationDef = {
  id: IntegrationId;
  name: string;
  category: IntegrationCategory;
  description: string;
  comingSoon?: boolean;
};

const INTEGRATIONS: IntegrationDef[] = [
  {
    id: 'paystack',
    name: 'Paystack',
    category: 'Payments',
    description: 'Accept card and bank payments for invoices.',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'Payments',
    description: 'Accept card payments globally.',
    comingSoon: true,
  },
  {
    id: 'paypal',
    name: 'PayPal',
    category: 'Payments',
    description: 'Accept PayPal payments for invoices.',
    comingSoon: true,
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    category: 'Payments',
    description: 'Record offline transfers and reconcile payments.',
    comingSoon: true,
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    category: 'Accounting',
    description: 'Sync transactions and accounting data.',
    comingSoon: true,
  },
];

const IntegrationPage: React.FC = () => {
  const { profiles } = useProfile();
  const organisationId = profiles[0]?.organisation_id ?? '';
  const [activeCategory, setActiveCategory] =
    useState<IntegrationCategory>('Payments');
  const [activeIntegration, setActiveIntegration] =
    useState<IntegrationId | null>(null);
  const [query, setQuery] = useState('');

  const { data, isLoading, error, refetch } = useQuery(
    ['paystack-integration', organisationId],
    () => getPaystackIntegration(organisationId),
    { enabled: Boolean(organisationId) }
  );

  const [secretKey, setSecretKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [bankAccountId, setBankAccountId] = useState<string>('');
  const [coaId, setCoaId] = useState<string>('');

  const hasExistingSecret = data?.has_secret_key === true;

  const canSave = useMemo(() => {
    if (!organisationId) return false;
    return secretKey.trim().length >= 10;
  }, [organisationId, hasExistingSecret, secretKey]);

  const saveMutation = useMutation(
    async () => {
      const body = {
        secret_key: secretKey.trim(),
        public_key: publicKey.trim() || null,
        bank_account_id: bankAccountId || null,
        coa_id: coaId || null,
        enabled,
      };
      return upsertPaystackIntegration(organisationId, body);
    },
    {
      onSuccess: async () => {
        setSecretKey('');
        await refetch();
      },
    }
  );

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='mb-5'>
        <h1 className='text-2xl font-semibold text-gray-900 dark:text-gray-100'>
          Integrations
        </h1>
        <p className='mt-1 text-sm text-gray-600 dark:text-gray-300'>
          Connect third‑party services to extend your workflow.
        </p>
      </div>

      <div className='card'>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-3 justify-between'>
            <div className='relative w-full sm:max-w-md'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none' />
              <input
                type='search'
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder='Search integrations…'
                className='input-field pl-9 pr-3 py-2.5 text-sm rounded-xl w-full'
                aria-label='Search integrations'
              />
            </div>

            <div className='flex gap-2 overflow-x-auto'>
              {(
                ['Payments', 'Accounting', 'Banking', 'CRM', 'Other'] as const
              ).map(c => (
                <button
                  key={c}
                  type='button'
                  onClick={() => setActiveCategory(c)}
                  className={`px-3 py-2 rounded-xl text-sm whitespace-nowrap border ${
                    activeCategory === c
                      ? 'border-[#073E60] text-[#073E60] dark:border-primary-500 dark:text-primary-300 bg-white dark:bg-gray-800'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredIntegrations(activeCategory, query).length === 0 ? (
              <div className='col-span-full text-sm text-gray-500 dark:text-gray-400'>
                No integrations match your search.
              </div>
            ) : (
              filteredIntegrations(activeCategory, query).map(integration => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  onConnect={() => {
                    if (integration.comingSoon) return;
                    setActiveIntegration(integration.id);
                  }}
                  onViewDetails={() => {
                    if (integration.comingSoon) return;
                    setActiveIntegration(integration.id);
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {activeIntegration === 'paystack' && (
        <div className='fixed inset-0 z-[100]'>
          <div
            className='absolute inset-0 bg-black/50'
            onClick={() => setActiveIntegration(null)}
            aria-hidden
          />
          <div className='absolute right-0 top-0 bottom-0 w-full max-w-xl bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl overflow-y-auto'>
            <div className='p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Payments
                </p>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                  Paystack setup
                </h3>
              </div>
              <button
                type='button'
                onClick={() => setActiveIntegration(null)}
                className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
                aria-label='Close'
              >
                <X className='h-5 w-5 text-gray-500 dark:text-gray-400' />
              </button>
            </div>

            <div className='p-4 space-y-4'>
              <div className='flex items-start justify-between gap-4'>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  Accept card and bank payments for invoices via Paystack
                  Checkout.
                </p>
                <a
                  href='https://dashboard.paystack.com/#/settings/developer'
                  target='_blank'
                  rel='noreferrer'
                  className='inline-flex items-center gap-2 text-sm font-medium text-[#073E60] dark:text-primary-400 hover:underline shrink-0'
                >
                  Get keys
                  <ExternalLink className='h-4 w-4' />
                </a>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='form-label text-gray-900 dark:text-gray-100 block mb-1'>
                    Secret key
                  </label>
                  <div className='relative'>
                    <KeyRound className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none' />
                    <input
                      type='password'
                      value={secretKey}
                      onChange={e => setSecretKey(e.target.value)}
                      className='input-field pl-9 py-3 rounded-xl'
                      placeholder={
                        hasExistingSecret
                          ? '•••••••••• (stored)'
                          : 'sk_live_... or sk_test_...'
                      }
                    />
                  </div>
                  <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                    Stored encrypted and never shown again.
                  </p>
                </div>

                <div>
                  <label className='form-label text-gray-900 dark:text-gray-100 block mb-1'>
                    Public key (optional)
                  </label>
                  <input
                    type='text'
                    value={publicKey}
                    onChange={e => setPublicKey(e.target.value)}
                    className='input-field pl-3 py-3 rounded-xl'
                    placeholder='pk_live_... or pk_test_...'
                  />
                </div>
              </div>

              <IntegrationPostingSettings
                organisationId={organisationId}
                bankAccountId={bankAccountId}
                setBankAccountId={setBankAccountId}
                coaId={coaId}
                setCoaId={setCoaId}
              />

              <div className='flex items-center justify-between gap-3 flex-wrap'>
                <label className='inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200'>
                  <input
                    type='checkbox'
                    checked={enabled}
                    onChange={e => setEnabled(e.target.checked)}
                  />
                  Enable Paystack for invoice payments
                </label>

                <button
                  type='button'
                  disabled={!canSave || saveMutation.isLoading}
                  onClick={() => saveMutation.mutate()}
                  className='inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#073E60] text-white hover:bg-[#052d47] disabled:opacity-70'
                >
                  <ShieldCheck className='h-4 w-4' />
                  {saveMutation.isLoading ? 'Saving…' : 'Save'}
                </button>
              </div>

              {isLoading && (
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Loading Paystack settings…
                </p>
              )}

              {Boolean(error) && (
                <Alert
                  variant='error'
                  message='Failed to load integration settings.'
                />
              )}

              {saveMutation.isError && (
                <Alert
                  variant='error'
                  message='Failed to save Paystack settings. Check the key format and try again.'
                />
              )}

              {saveMutation.isSuccess && (
                <Alert variant='success' message='Paystack settings saved.' />
              )}

              <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/30 p-4 text-sm text-gray-700 dark:text-gray-200'>
                <p className='font-semibold mb-2'>How it works</p>
                <ol className='list-decimal pl-5 space-y-1'>
                  <li>Paste your Paystack keys and enable the integration.</li>
                  <li>
                    Choose the <b>bank account</b> and <b>COA</b> to post
                    Paystack payments into.
                  </li>
                  <li>
                    Invoices show <b>Pay now</b> which opens Paystack Checkout.
                  </li>
                  <li>
                    Payment confirmation comes via webhook and is recorded as a{' '}
                    <b>bank transaction</b>.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function filteredIntegrations(
  category: IntegrationCategory,
  query: string
): IntegrationDef[] {
  const q = query.trim().toLowerCase();
  return INTEGRATIONS.filter(i => {
    if (i.category !== category) return false;
    if (!q) return true;
    return (
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q)
    );
  });
}

function IntegrationCard({
  integration,
  onConnect,
  onViewDetails,
}: {
  integration: IntegrationDef;
  onConnect: () => void;
  onViewDetails: () => void;
}) {
  const disabled = integration.comingSoon === true;
  return (
    <div className='rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex flex-col'>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-center gap-3 min-w-0'>
          <div className='h-10 w-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-700 dark:text-gray-200 shrink-0'>
            {integration.name.slice(0, 2).toUpperCase()}
          </div>
          <div className='min-w-0'>
            <p className='text-sm font-semibold text-gray-900 dark:text-gray-100 truncate'>
              {integration.name}
            </p>
            <p className='text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5'>
              {integration.description}
            </p>
          </div>
        </div>
        {disabled ? (
          <span className='badge bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'>
            Coming soon
          </span>
        ) : (
          <span className='badge badge-info'>{integration.category}</span>
        )}
      </div>

      <div className='mt-4 flex gap-2'>
        <button
          type='button'
          disabled={disabled}
          onClick={onConnect}
          className={`px-3 py-2 rounded-xl text-sm font-medium ${
            disabled
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-[#073E60] text-white hover:bg-[#052d47]'
          }`}
        >
          Connect now
        </button>
        <button
          type='button'
          disabled={disabled}
          onClick={onViewDetails}
          className={`px-3 py-2 rounded-xl text-sm font-medium border ${
            disabled
              ? 'border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed'
              : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          View details
        </button>
      </div>
    </div>
  );
}

function IntegrationPostingSettings({
  organisationId,
  bankAccountId,
  setBankAccountId,
  coaId,
  setCoaId,
}: {
  organisationId: string;
  bankAccountId: string;
  setBankAccountId: (v: string) => void;
  coaId: string;
  setCoaId: (v: string) => void;
}) {
  const { data: bankAccounts } = useQuery(
    ['bank-accounts', organisationId],
    () => listBankAccounts(organisationId, { page_size: 100 }),
    { enabled: Boolean(organisationId) }
  );
  const { data: coas } = useQuery(
    ['coas', organisationId],
    () => listCoas(organisationId, { page_size: 100 }),
    { enabled: Boolean(organisationId) }
  );

  return (
    <div className='mt-5 grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div>
        <label className='form-label text-gray-900 dark:text-gray-100 block mb-1'>
          Post payments to bank account
        </label>
        <select
          value={bankAccountId}
          onChange={e => setBankAccountId(e.target.value)}
          className='input-field pl-3 py-3 rounded-xl'
        >
          <option value=''>Select bank account…</option>
          {(bankAccounts?.items ?? []).map(a => (
            <option key={a.id} value={a.id}>
              {a.name} ({a.currency})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className='form-label text-gray-900 dark:text-gray-100 block mb-1'>
          Post payments to COA
        </label>
        <select
          value={coaId}
          onChange={e => setCoaId(e.target.value)}
          className='input-field pl-3 py-3 rounded-xl'
        >
          <option value=''>Select COA…</option>
          {(coas?.items ?? []).map(c => (
            <option key={c.id} value={c.id}>
              {c.code} — {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default IntegrationPage;
