import { apiClient } from './apiClient';

export interface PaystackIntegrationResponse {
  enabled: boolean;
  public_key?: string | null;
  bank_account_id?: string | null;
  coa_id?: string | null;
  has_secret_key: boolean;
}

export interface PaystackIntegrationUpsertRequest {
  secret_key: string;
  public_key?: string | null;
  bank_account_id?: string | null;
  coa_id?: string | null;
  enabled: boolean;
}

export interface PaystackInitPaymentResponse {
  authorization_url: string;
  reference: string;
}

const PAYSTACK = '/integrations/paystack';

export async function getPaystackIntegration(
  organisationId: string
): Promise<PaystackIntegrationResponse> {
  const { data } = await apiClient.get<PaystackIntegrationResponse>(PAYSTACK, {
    headers: { 'X-Organisation-Id': organisationId },
  });
  return data;
}

export async function upsertPaystackIntegration(
  organisationId: string,
  body: PaystackIntegrationUpsertRequest
): Promise<PaystackIntegrationResponse> {
  const { data } = await apiClient.put<PaystackIntegrationResponse>(
    PAYSTACK,
    body,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  return data;
}

export async function initPaystackInvoicePayment(
  organisationId: string,
  invoiceId: string
): Promise<PaystackInitPaymentResponse> {
  const { data } = await apiClient.post<PaystackInitPaymentResponse>(
    `${PAYSTACK}/invoices/${invoiceId}/init`,
    {},
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  return data;
}
