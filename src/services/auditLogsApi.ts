/**
 * Audit logs API. All requests require X-Organisation-Id.
 */
import type { components } from '@/generated/api';
import { apiClient } from './apiClient';

type AuditLogListResponse = components['schemas']['AuditLogListResponse'];
type AuditActionType = components['schemas']['AuditActionType'];

const AUDIT_LOGS = '/audit-logs';

export type { AuditLogListResponse, AuditActionType };

export interface ListAuditLogsParams {
  page?: number;
  page_size?: number;
  user_id?: string | null | undefined;
  action_type?: AuditActionType | null | undefined;
  resource_type?: string | null | undefined;
  resource_id?: string | null | undefined;
  status?: string | null | undefined;
  date_from?: string | null | undefined;
  date_to?: string | null | undefined;
}

export async function listAuditLogs(
  organisationId: string,
  params: ListAuditLogsParams = {}
): Promise<AuditLogListResponse> {
  const { data } = await apiClient.get<AuditLogListResponse>(AUDIT_LOGS, {
    params: {
      page: params.page ?? 1,
      page_size: params.page_size ?? 20,
      user_id: params.user_id ?? undefined,
      action_type: params.action_type ?? undefined,
      resource_type: params.resource_type || undefined,
      resource_id: params.resource_id ?? undefined,
      status: params.status || undefined,
      date_from: params.date_from ?? undefined,
      date_to: params.date_to ?? undefined,
    },
    headers: { 'X-Organisation-Id': organisationId },
  });
  return data;
}
