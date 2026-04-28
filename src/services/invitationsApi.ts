/**
 * Invitations API. All requests require X-Organisation-Id (except accept).
 */
import type { components } from '@/generated/api';
import { apiClient } from './apiClient';

type InvitationListResponse = components['schemas']['InvitationListResponse'];
type InvitationResponse = components['schemas']['InvitationResponse'];
type InvitationCreateRequest = components['schemas']['InvitationCreateRequest'];

const INVITATIONS = '/invitations';

export type {
  InvitationResponse,
  InvitationListResponse,
  InvitationCreateRequest,
};

export interface ListInvitationsParams {
  page?: number;
  page_size?: number;
  include_deleted?: boolean;
}

export async function listInvitations(
  organisationId: string,
  params: ListInvitationsParams = {}
): Promise<InvitationListResponse> {
  const { data } = await apiClient.get<InvitationListResponse>(INVITATIONS, {
    params: {
      page: params.page ?? 1,
      page_size: params.page_size ?? 20,
      include_deleted: params.include_deleted ?? undefined,
    },
    headers: { 'X-Organisation-Id': organisationId },
  });
  return data;
}

export async function getInvitation(
  organisationId: string,
  invitationId: string
): Promise<InvitationResponse> {
  const { data } = await apiClient.get<{ data?: InvitationResponse | null }>(
    `${INVITATIONS}/${invitationId}`,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Invitation not found');
  return data.data;
}

export async function createInvitation(
  organisationId: string,
  body: InvitationCreateRequest
): Promise<InvitationResponse> {
  const { data } = await apiClient.post<{ data?: InvitationResponse | null }>(
    INVITATIONS,
    body,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Create invitation failed');
  return data.data;
}

export async function resendInvitation(
  organisationId: string,
  invitationId: string
): Promise<InvitationResponse> {
  const { data } = await apiClient.post<{ data?: InvitationResponse | null }>(
    `${INVITATIONS}/${invitationId}/resend`,
    {},
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Resend invitation failed');
  return data.data;
}

export async function cancelInvitation(
  organisationId: string,
  invitationId: string
): Promise<InvitationResponse> {
  const { data } = await apiClient.post<{ data?: InvitationResponse | null }>(
    `${INVITATIONS}/${invitationId}/cancel`,
    {},
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Cancel invitation failed');
  return data.data;
}

/**
 * Accept an invitation (no X-Organisation-Id; uses token from email link).
 */
export async function acceptInvitation(token: string): Promise<void> {
  await apiClient.post(`${INVITATIONS}/accept`, { token });
}
