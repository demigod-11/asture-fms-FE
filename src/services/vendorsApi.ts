/**
 * Vendors API. All requests require X-Organisation-Id.
 *
 * This module intentionally uses local TypeScript interfaces instead of
 * generated OpenAPI types so it can be used before backend schemas are
 * fully wired into `generated/api.d.ts`.
 */
import { apiClient } from './apiClient';

export interface VendorResponse {
  id: string;
  public_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface VendorListResponse {
  items: VendorResponse[];
  total_items: number;
  total_pages: number;
  page: number;
  page_size: number;
}

export interface VendorCreateRequest {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface VendorUpdateRequest {
  name?: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

const VENDORS = '/vendors';

export interface ListVendorsParams {
  page?: number;
  page_size?: number;
  search?: string | null | undefined;
}

export async function listVendors(
  organisationId: string,
  params: ListVendorsParams = {}
): Promise<VendorListResponse> {
  const { data } = await apiClient.get<VendorListResponse>(VENDORS, {
    params: {
      page: params.page ?? 1,
      page_size: params.page_size ?? 20,
      search: params.search || undefined,
    },
    headers: { 'X-Organisation-Id': organisationId },
  });
  return data;
}

export async function getVendor(
  organisationId: string,
  vendorId: string
): Promise<VendorResponse> {
  const { data } = await apiClient.get<{ data?: VendorResponse | null }>(
    `${VENDORS}/${vendorId}`,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Vendor not found');
  return data.data;
}

export async function createVendor(
  organisationId: string,
  body: VendorCreateRequest
): Promise<VendorResponse> {
  const { data } = await apiClient.post<{ data?: VendorResponse | null }>(
    VENDORS,
    body,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Create vendor failed');
  return data.data;
}

export async function updateVendor(
  organisationId: string,
  vendorId: string,
  body: VendorUpdateRequest
): Promise<VendorResponse> {
  const { data } = await apiClient.patch<{ data?: VendorResponse | null }>(
    `${VENDORS}/${vendorId}`,
    body,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Update vendor failed');
  return data.data;
}

export async function deleteVendor(
  organisationId: string,
  vendorId: string
): Promise<void> {
  await apiClient.delete(`${VENDORS}/${vendorId}`, {
    headers: { 'X-Organisation-Id': organisationId },
  });
}
