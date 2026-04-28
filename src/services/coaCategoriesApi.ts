/**
 * COA Categories API. All requests require X-Organisation-Id.
 */
import type { components } from '@/generated/api';
import { apiClient } from './apiClient';

type COACategoryResponse = components['schemas']['COACategoryResponse'];
type COACategoryTreeResponse = components['schemas']['COACategoryTreeResponse'];
type COACategoryCreateRequest =
  components['schemas']['COACategoryCreateRequest'];
type COACategoryUpdateRequest =
  components['schemas']['COACategoryUpdateRequest'];

const COA_CATEGORIES = '/coa-categories';

export type {
  COACategoryResponse,
  COACategoryTreeResponse,
  COACategoryCreateRequest,
  COACategoryUpdateRequest,
};

export interface ListCategoriesParams {
  tree?: boolean;
  include_system?: boolean;
  parent_id?: string | null | undefined;
}

export async function listCategories(
  organisationId: string,
  params: ListCategoriesParams = {}
): Promise<COACategoryResponse[]> {
  const { data } = await apiClient.get<{ data?: COACategoryResponse[] | null }>(
    COA_CATEGORIES,
    {
      params: {
        tree: params.tree ?? undefined,
        include_system: params.include_system ?? undefined,
        parent_id: params.parent_id ?? undefined,
      },
      headers: { 'X-Organisation-Id': organisationId },
    }
  );
  return data?.data ?? [];
}

export async function getCategoryTree(
  organisationId: string
): Promise<COACategoryTreeResponse> {
  const { data } = await apiClient.get<{
    data?: COACategoryTreeResponse | null;
  }>(`${COA_CATEGORIES}/tree`, {
    headers: { 'X-Organisation-Id': organisationId },
  });
  if (data?.data == null) throw new Error('Category tree not found');
  return data.data;
}

export async function getCategory(
  organisationId: string,
  categoryId: string
): Promise<COACategoryResponse> {
  const { data } = await apiClient.get<{ data?: COACategoryResponse | null }>(
    `${COA_CATEGORIES}/${categoryId}`,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Category not found');
  return data.data;
}

export async function createCategory(
  organisationId: string,
  body: COACategoryCreateRequest
): Promise<COACategoryResponse> {
  const { data } = await apiClient.post<{ data?: COACategoryResponse | null }>(
    COA_CATEGORIES,
    body,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Create category failed');
  return data.data;
}

export async function updateCategory(
  organisationId: string,
  categoryId: string,
  body: COACategoryUpdateRequest
): Promise<COACategoryResponse> {
  const { data } = await apiClient.patch<{ data?: COACategoryResponse | null }>(
    `${COA_CATEGORIES}/${categoryId}`,
    body,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Update category failed');
  return data.data;
}

export async function deleteCategory(
  organisationId: string,
  categoryId: string
): Promise<void> {
  await apiClient.delete(`${COA_CATEGORIES}/${categoryId}`, {
    headers: { 'X-Organisation-Id': organisationId },
  });
}
