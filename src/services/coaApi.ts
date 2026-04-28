/**
 * Chart of Accounts API. All requests require X-Organisation-Id.
 */
import type { components } from '@/generated/api';
import { apiClient } from './apiClient';

type ChartOfAccountListResponse =
  components['schemas']['ChartOfAccountListResponse'];
type ChartOfAccountResponse = components['schemas']['ChartOfAccountResponse'];
type ChartOfAccountCreateRequest =
  components['schemas']['ChartOfAccountCreateRequest'];
type ChartOfAccountUpdateRequest =
  components['schemas']['ChartOfAccountUpdateRequest'];
type COAStatus = components['schemas']['COAStatus'];
type COAUsageSummaryResponse = components['schemas']['COAUsageSummaryResponse'];

const COA = '/coa';

export type {
  ChartOfAccountResponse,
  ChartOfAccountCreateRequest,
  ChartOfAccountUpdateRequest,
  COAStatus,
  COAUsageSummaryResponse,
};

export interface ListCoasParams {
  page?: number;
  page_size?: number;
  category_id?: string | null | undefined;
  status?: COAStatus | null | undefined;
  name?: string | null | undefined;
  code?: string | null | undefined;
}

export async function listCoas(
  organisationId: string,
  params: ListCoasParams = {}
): Promise<ChartOfAccountListResponse> {
  const { data } = await apiClient.get<ChartOfAccountListResponse>(COA, {
    params: {
      page: params.page ?? 1,
      page_size: params.page_size ?? 20,
      category_id: params.category_id ?? undefined,
      status: params.status ?? undefined,
      name: params.name || undefined,
      code: params.code || undefined,
    },
    headers: { 'X-Organisation-Id': organisationId },
  });
  return data;
}

export async function getCoa(
  organisationId: string,
  coaId: string
): Promise<ChartOfAccountResponse> {
  const { data } = await apiClient.get<{
    data?: ChartOfAccountResponse | null;
  }>(`${COA}/${coaId}`, { headers: { 'X-Organisation-Id': organisationId } });
  if (data?.data == null) throw new Error('COA entry not found');
  return data.data;
}

export async function createCoa(
  organisationId: string,
  body: ChartOfAccountCreateRequest
): Promise<ChartOfAccountResponse> {
  const { data } = await apiClient.post<{
    data?: ChartOfAccountResponse | null;
  }>(COA, body, { headers: { 'X-Organisation-Id': organisationId } });
  if (data?.data == null) throw new Error('Create COA failed');
  return data.data;
}

export async function updateCoa(
  organisationId: string,
  coaId: string,
  body: ChartOfAccountUpdateRequest
): Promise<ChartOfAccountResponse> {
  const { data } = await apiClient.patch<{
    data?: ChartOfAccountResponse | null;
  }>(`${COA}/${coaId}`, body, {
    headers: { 'X-Organisation-Id': organisationId },
  });
  if (data?.data == null) throw new Error('Update COA failed');
  return data.data;
}

export async function deactivateCoa(
  organisationId: string,
  coaId: string
): Promise<ChartOfAccountResponse> {
  const { data } = await apiClient.patch<{
    data?: ChartOfAccountResponse | null;
  }>(
    `${COA}/${coaId}/deactivate`,
    {},
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Deactivate COA failed');
  return data.data;
}

export async function getCoaUsage(
  organisationId: string,
  coaId: string
): Promise<COAUsageSummaryResponse> {
  const { data } = await apiClient.get<{
    data?: COAUsageSummaryResponse | null;
  }>(`${COA}/${coaId}/usage`, {
    headers: { 'X-Organisation-Id': organisationId },
  });
  if (data?.data == null) throw new Error('COA usage not found');
  return data.data;
}
