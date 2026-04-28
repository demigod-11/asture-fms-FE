/**
 * Products API. All requests require X-Organisation-Id.
 *
 * Uses local interfaces so FE can consume new fields like public_id immediately.
 */
import { apiClient } from './apiClient';

export type ProductStatus = 'active' | 'inactive';

export interface ProductResponse {
  id: string;
  public_id: string;
  organisation_id: string;
  name: string;
  code?: string | null;
  description?: string | null;
  price: string;
  coa_id?: string | null;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
  is_deleted: boolean;
  tag_codes: string[];
}

export interface ProductListResponse {
  items: ProductResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface ProductCreateRequest {
  name: string;
  code?: string | null;
  description?: string | null;
  price?: string;
  coa_id?: string | null;
  status?: ProductStatus;
  tag_codes?: string[];
}

export interface ProductUpdateRequest {
  name?: string | null;
  code?: string | null;
  description?: string | null;
  price?: string | null;
  coa_id?: string | null;
  status?: ProductStatus | null;
  tag_codes?: string[] | null;
}

const PRODUCTS = '/products';

export interface ListProductsParams {
  page?: number;
  page_size?: number;
  status?: ProductStatus | null | undefined;
  name?: string | null | undefined;
  code?: string | null | undefined;
  coa_id?: string | null | undefined;
  tag_codes?: string | null | undefined;
}

export async function listProducts(
  organisationId: string,
  params: ListProductsParams = {}
): Promise<ProductListResponse> {
  const { data } = await apiClient.get<ProductListResponse>(PRODUCTS, {
    params: {
      page: params.page ?? 1,
      page_size: params.page_size ?? 20,
      status: params.status ?? undefined,
      name: params.name || undefined,
      code: params.code || undefined,
      coa_id: params.coa_id ?? undefined,
      tag_codes: params.tag_codes ?? undefined,
    },
    headers: { 'X-Organisation-Id': organisationId },
  });
  return data;
}

export async function getProduct(
  organisationId: string,
  productId: string
): Promise<ProductResponse> {
  const { data } = await apiClient.get<{ data?: ProductResponse | null }>(
    `${PRODUCTS}/${productId}`,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Product not found');
  return data.data;
}

export async function createProduct(
  organisationId: string,
  body: ProductCreateRequest
): Promise<ProductResponse> {
  const { data } = await apiClient.post<{ data?: ProductResponse | null }>(
    PRODUCTS,
    body,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Create product failed');
  return data.data;
}

export async function updateProduct(
  organisationId: string,
  productId: string,
  body: ProductUpdateRequest
): Promise<ProductResponse> {
  const { data } = await apiClient.patch<{ data?: ProductResponse | null }>(
    `${PRODUCTS}/${productId}`,
    body,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  if (data?.data == null) throw new Error('Update product failed');
  return data.data;
}

export async function deleteProduct(
  organisationId: string,
  productId: string
): Promise<void> {
  await apiClient.delete(`${PRODUCTS}/${productId}`, {
    headers: { 'X-Organisation-Id': organisationId },
  });
}
