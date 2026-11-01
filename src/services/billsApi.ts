/**
 * Bills API. All requests require X-Organisation-Id.
 */
import type { components } from '@/generated/api';
import { apiClient } from './apiClient';

type BillListResponseGenerated = components['schemas']['BillListResponse'];
type BillResponseGenerated = components['schemas']['BillResponse'];
type BillCreateRequest = components['schemas']['BillCreateRequest'];
type BillUpdateRequest = components['schemas']['BillUpdateRequest'];
type BillStatus = components['schemas']['BillStatus'];

export type BillResponse = BillResponseGenerated & {
  public_id?: string;
  vendor_name?: string | null;
  vendor_email?: string | null;
};

export type BillListResponse = Omit<BillListResponseGenerated, 'items'> & {
  items: BillResponse[];
};

const BILLS = '/bills';

export type { BillCreateRequest, BillUpdateRequest, BillStatus };

export interface ListBillsParams {
  page?: number;
  page_size?: number;
  status?: BillStatus | null | undefined;
  vendor_id?: string | null | undefined;
  from_date?: string | null | undefined;
  to_date?: string | null | undefined;
  search?: string | null | undefined;
}

export async function listBills(
  organisationId: string,
  params: ListBillsParams = {}
): Promise<BillListResponse> {
  const { data } = await apiClient.get<BillListResponse>(BILLS, {
    params: {
      page: params.page ?? 1,
      page_size: params.page_size ?? 20,
      status: params.status ?? undefined,
      vendor_id: params.vendor_id ?? undefined,
      from_date: params.from_date ?? undefined,
      to_date: params.to_date ?? undefined,
      search: params.search || undefined,
    },
    headers: { 'X-Organisation-Id': organisationId },
  });
  return data;
}

export async function createBill(
  organisationId: string,
  body: BillCreateRequest
): Promise<BillResponse> {
  const { data } = await apiClient.post<{ data?: BillResponse | null }>(
    BILLS,
    body,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Create bill failed');
  return data.data;
}

export async function updateBill(
  organisationId: string,
  billId: string,
  body: BillUpdateRequest
): Promise<BillResponse> {
  const { data } = await apiClient.patch<{ data?: BillResponse | null }>(
    `${BILLS}/${billId}`,
    body,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Update bill failed');
  return data.data;
}

export async function deleteBill(
  organisationId: string,
  billId: string
): Promise<void> {
  await apiClient.delete(`${BILLS}/${billId}`, {
    headers: { 'X-Organisation-Id': organisationId },
  });
}

export async function getBill(
  organisationId: string,
  billId: string
): Promise<BillResponse> {
  const { data } = await apiClient.get<{ data?: BillResponse | null }>(
    `${BILLS}/${billId}`,
    {
      headers: { 'X-Organisation-Id': organisationId },
    }
  );
  if (data?.data == null) throw new Error('Bill not found');
  return data.data;
}
