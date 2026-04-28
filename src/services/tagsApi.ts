/**
 * Tags API. All requests require X-Organisation-Id.
 */
import type { components } from '@/generated/api';
import { apiClient } from './apiClient';

type TagListResponse = components['schemas']['TagListResponse'];
type TagResponse = components['schemas']['TagResponse'];
type TagCreateRequest = components['schemas']['TagCreateRequest'];
type TagUpdateRequest = components['schemas']['TagUpdateRequest'];

const TAGS = '/tags';

export type {
  TagResponse,
  TagListResponse,
  TagCreateRequest,
  TagUpdateRequest,
};

export interface ListTagsParams {
  page?: number;
  page_size?: number;
  code?: string | null | undefined;
  name?: string | null | undefined;
}

export async function listTags(
  organisationId: string,
  params: ListTagsParams = {}
): Promise<TagListResponse> {
  const { data } = await apiClient.get<TagListResponse>(TAGS, {
    params: {
      page: params.page ?? 1,
      page_size: params.page_size ?? 20,
      code: params.code || undefined,
      name: params.name || undefined,
    },
    headers: { 'X-Organisation-Id': organisationId },
  });
  return data;
}

export async function getTag(
  organisationId: string,
  tagId: string
): Promise<TagResponse> {
  const { data } = await apiClient.get<{ data?: TagResponse | null }>(
    `${TAGS}/${tagId}`,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Tag not found');
  return data.data;
}

export async function createTag(
  organisationId: string,
  body: TagCreateRequest
): Promise<TagResponse> {
  const { data } = await apiClient.post<{ data?: TagResponse | null }>(
    TAGS,
    body,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Create tag failed');
  return data.data;
}

export async function updateTag(
  organisationId: string,
  tagId: string,
  body: TagUpdateRequest
): Promise<TagResponse> {
  const { data } = await apiClient.patch<{ data?: TagResponse | null }>(
    `${TAGS}/${tagId}`,
    body,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Update tag failed');
  return data.data;
}

export async function deleteTag(
  organisationId: string,
  tagId: string
): Promise<void> {
  await apiClient.delete(`${TAGS}/${tagId}`, {
    headers: { 'X-Organisation-Id': organisationId },
  });
}
