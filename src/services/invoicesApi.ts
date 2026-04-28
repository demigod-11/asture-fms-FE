/**
 * Invoices API. All requests require X-Organisation-Id.
 *
 * These interfaces mirror the backend Pydantic models in
 * `app/api/v1/dtos/invoice.py` but are defined locally instead of relying
 * on generated OpenAPI types (which may lag behind).
 */
import { apiClient } from './apiClient';

export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'partially_paid'
  | 'paid'
  | 'overdue'
  | 'cancelled';

export interface InvoiceLineItemResponse {
  id: string;
  invoice_id: string;
  product_id?: string | null;
  coa_id?: string | null;
  description?: string | null;
  quantity: string;
  unit_price: string;
  amount: string;
  tax: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface InvoiceResponse {
  id: string;
  public_id: string;
  organisation_id: string;
  customer_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  status: InvoiceStatus;
  currency: string;
  subtotal: string;
  tax_total: string;
  discount_total: string;
  total: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
  is_deleted: boolean;
  line_items: InvoiceLineItemResponse[];
}

export interface InvoiceListResponse {
  items: InvoiceResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface InvoiceLineItemRequest {
  product_id?: string | null;
  coa_id?: string | null;
  description?: string | null;
  quantity: string;
  unit_price: string;
  amount: string;
  tax: string;
  sort_order?: number;
}

export interface InvoiceCreateRequest {
  customer_id: string;
  invoice_number?: string | null;
  issue_date?: string | null;
  due_date?: string | null;
  status?: InvoiceStatus;
  currency?: string;
  notes?: string | null;
  discount_total?: string;
  line_items?: InvoiceLineItemRequest[];
}

export interface InvoiceUpdateRequest {
  customer_id?: string;
  issue_date?: string | null;
  due_date?: string | null;
  status?: InvoiceStatus;
  currency?: string | null;
  notes?: string | null;
  discount_total?: string | null;
  line_items?: InvoiceLineItemRequest[] | null;
}

export interface InvoiceEmailPreviewResponse {
  to: string;
  subject: string;
  text_body: string;
  html_body: string;
}

const INVOICES = '/invoices';

export interface ListInvoicesParams {
  page?: number;
  page_size?: number;
  status?: InvoiceStatus | null;
  customer_id?: string | null;
  from_date?: string | null;
  to_date?: string | null;
}

export async function listInvoices(
  organisationId: string,
  params: ListInvoicesParams = {}
): Promise<InvoiceListResponse> {
  const { data } = await apiClient.get<InvoiceListResponse>(INVOICES, {
    params: {
      page: params.page ?? 1,
      page_size: params.page_size ?? 20,
      status: params.status ?? undefined,
      customer_id: params.customer_id ?? undefined,
      from_date: params.from_date ?? undefined,
      to_date: params.to_date ?? undefined,
    },
    headers: { 'X-Organisation-Id': organisationId },
  });
  return data;
}

export async function getInvoice(
  organisationId: string,
  invoiceId: string
): Promise<InvoiceResponse> {
  const { data } = await apiClient.get<{ data?: InvoiceResponse | null }>(
    `${INVOICES}/${invoiceId}`,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Invoice not found');
  return data.data;
}

export async function createInvoice(
  organisationId: string,
  body: InvoiceCreateRequest
): Promise<InvoiceResponse> {
  const { data } = await apiClient.post<{ data?: InvoiceResponse | null }>(
    INVOICES,
    body,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Create invoice failed');
  return data.data;
}

export async function updateInvoice(
  organisationId: string,
  invoiceId: string,
  body: InvoiceUpdateRequest
): Promise<InvoiceResponse> {
  const { data } = await apiClient.patch<{ data?: InvoiceResponse | null }>(
    `${INVOICES}/${invoiceId}`,
    body,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Update invoice failed');
  return data.data;
}

export async function deleteInvoice(
  organisationId: string,
  invoiceId: string
): Promise<void> {
  await apiClient.delete(`${INVOICES}/${invoiceId}`, {
    headers: { 'X-Organisation-Id': organisationId },
  });
}

export async function getInvoiceEmailPreview(
  organisationId: string,
  invoiceId: string
): Promise<InvoiceEmailPreviewResponse> {
  const { data } = await apiClient.get<{
    data?: InvoiceEmailPreviewResponse | null;
  }>(`${INVOICES}/${invoiceId}/email-preview`, {
    headers: { 'X-Organisation-Id': organisationId },
  });
  if (data?.data == null)
    throw new Error('Invoice email preview not available');
  return data.data;
}

export async function sendInvoiceEmail(
  organisationId: string,
  invoiceId: string,
  to?: string
): Promise<void> {
  await apiClient.post(
    `${INVOICES}/${invoiceId}/send-email`,
    { to: to || null },
    { headers: { 'X-Organisation-Id': organisationId } }
  );
}
