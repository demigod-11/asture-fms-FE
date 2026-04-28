/**
 * Roles API. All requests require X-Organisation-Id.
 */
import type { components } from '@/generated/api';
import { apiClient } from './apiClient';

type RoleResponse = components['schemas']['RoleResponse'];
type RoleCreateRequest = components['schemas']['RoleCreateRequest'];
type RoleUpdateRequest = components['schemas']['RoleUpdateRequest'];

const ROLES = '/roles';

export type { RoleResponse, RoleCreateRequest, RoleUpdateRequest };

export interface ListRolesParams {
  include_default?: boolean;
}

export async function listRoles(
  organisationId: string,
  params: ListRolesParams = {}
): Promise<RoleResponse[]> {
  const { data } = await apiClient.get<RoleResponse[]>(ROLES, {
    params: { include_default: params.include_default ?? undefined },
    headers: { 'X-Organisation-Id': organisationId },
  });
  return Array.isArray(data) ? data : [];
}

export async function getRole(
  organisationId: string,
  roleId: string
): Promise<RoleResponse> {
  const { data } = await apiClient.get<RoleResponse>(`${ROLES}/${roleId}`, {
    headers: { 'X-Organisation-Id': organisationId },
  });
  return data;
}

export async function createRole(
  organisationId: string,
  body: RoleCreateRequest
): Promise<RoleResponse> {
  const { data } = await apiClient.post<RoleResponse>(ROLES, body, {
    headers: { 'X-Organisation-Id': organisationId },
  });
  return data;
}

export async function updateRole(
  organisationId: string,
  roleId: string,
  body: RoleUpdateRequest
): Promise<RoleResponse> {
  const { data } = await apiClient.patch<RoleResponse>(
    `${ROLES}/${roleId}`,
    body,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  return data;
}

export async function deleteRole(
  organisationId: string,
  roleId: string
): Promise<void> {
  await apiClient.delete(`${ROLES}/${roleId}`, {
    headers: { 'X-Organisation-Id': organisationId },
  });
}
