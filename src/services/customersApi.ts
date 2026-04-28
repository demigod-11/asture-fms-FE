/**
 * Customers API. All requests require X-Organisation-Id.
 *
 * This module uses local TypeScript interfaces to avoid schema drift
 * when backend adds new fields (e.g. public_id).
 */
import { apiClient } from './apiClient';

export interface CustomerResponse {
  id: string;
  public_id: string;
  organisation_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  billing_address?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
  is_deleted: boolean;
}

export interface CustomerListResponse {
  items: CustomerResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface CustomerCreateRequest {
  name: string;
  email?: string | null;
  phone?: string | null;
  billing_address?: string | null;
}

export interface CustomerUpdateRequest {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  billing_address?: string | null;
}

const CUSTOMERS = '/customers';

export interface ListCustomersParams {
  page?: number;
  page_size?: number;
  search?: string | null | undefined;
}

export async function listCustomers(
  organisationId: string,
  params: ListCustomersParams = {}
): Promise<CustomerListResponse> {
  const { data } = await apiClient.get<CustomerListResponse>(CUSTOMERS, {
    params: {
      page: params.page ?? 1,
      page_size: params.page_size ?? 20,
      search: params.search || undefined,
    },
    headers: { 'X-Organisation-Id': organisationId },
  });
  return data;
}

export async function getCustomer(
  organisationId: string,
  customerId: string
): Promise<CustomerResponse> {
  const { data } = await apiClient.get<{ data?: CustomerResponse | null }>(
    `${CUSTOMERS}/${customerId}`,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Customer not found');
  return data.data;
}

export async function createCustomer(
  organisationId: string,
  body: CustomerCreateRequest
): Promise<CustomerResponse> {
  const { data } = await apiClient.post<{ data?: CustomerResponse | null }>(
    CUSTOMERS,
    body,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Create customer failed');
  return data.data;
}

export async function updateCustomer(
  organisationId: string,
  customerId: string,
  body: CustomerUpdateRequest
): Promise<CustomerResponse> {
  const { data } = await apiClient.patch<{ data?: CustomerResponse | null }>(
    `${CUSTOMERS}/${customerId}`,
    body,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Update customer failed');
  return data.data;
}

export async function deleteCustomer(
  organisationId: string,
  customerId: string
): Promise<void> {
  await apiClient.delete(`${CUSTOMERS}/${customerId}`, {
    headers: { 'X-Organisation-Id': organisationId },
  });
}
