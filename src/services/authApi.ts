/**
 * Auth and user-onboarding API. Uses apiClient (refresh + auth header).
 */

import { setAccessToken } from './authStorage';
import { apiClient } from './apiClient';

const AUTH = '/auth';
const USERS = '/users';
const ORG = '/organisations';

export interface TokenData {
  access_token: string;
  expires_in: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// --- Sign in (2FA: step 1 – validate credentials and send OTP; step 2 – verify-otp returns tokens) ---
export interface SignInRequest {
  email: string;
  password: string;
}

/** Step 1 of login: validates email/password and sends OTP. No tokens returned. */
export async function signIn(
  body: SignInRequest
): Promise<ApiResponse<{ message?: string }>> {
  const { data } = await apiClient.post<ApiResponse<{ message?: string }>>(
    `${AUTH}/login`,
    body
  );
  if (data.success === false && data.message) {
    const err = new Error(data.message) as Error & {
      response?: { data?: ApiResponse<unknown> };
    };
    err.response = { data };
    throw err;
  }
  return data;
}

// --- Sign up (create user) ---
export interface SignUpRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  mobile?: string;
  timezone?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  mobile: string | null;
  email_verified: boolean;
  last_login: string | null;
  timezone: string;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

/** User create returns 201 Created on success. Use response.status to gate sending OTP. */
export async function signUp(
  body: SignUpRequest
): Promise<{ data: ApiResponse<UserResponse>; status: number }> {
  const response = await apiClient.post<ApiResponse<UserResponse>>(
    `${USERS}/`,
    body
  );
  return { data: response.data, status: response.status };
}

// --- Logout ---
export async function logout(): Promise<ApiResponse<null>> {
  const res = await apiClient.post<ApiResponse<null>>(`${AUTH}/logout`);
  return res.data;
}

// --- Forgot password ---
export async function forgotPassword(
  email: string
): Promise<ApiResponse<{ message?: string }>> {
  const { data } = await apiClient.post<ApiResponse<{ message?: string }>>(
    `${AUTH}/forgot-password`,
    { email }
  );
  return data;
}

// --- Reset password ---
export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export async function resetPassword(
  body: ResetPasswordRequest
): Promise<ApiResponse<{ message?: string }>> {
  const { data } = await apiClient.post<ApiResponse<{ message?: string }>>(
    `${AUTH}/reset-password`,
    body
  );
  return data;
}

// --- Send verification email (authenticated) ---
export async function sendVerificationEmail(): Promise<
  ApiResponse<{ message?: string }>
> {
  const { data } = await apiClient.post<ApiResponse<{ message?: string }>>(
    `${AUTH}/send-verification-email`
  );
  return data;
}

// --- OTP: send code to email (signup or login) ---
export async function sendOtp(
  email: string
): Promise<ApiResponse<{ message?: string }>> {
  const { data } = await apiClient.post<ApiResponse<{ message?: string }>>(
    `${AUTH}/send-otp`,
    { email }
  );
  return data;
}

/** @deprecated Use sendOtp */
export async function requestVerificationEmail(
  email: string
): Promise<ApiResponse<{ message?: string }>> {
  return sendOtp(email);
}

// --- OTP: submit code to complete sign-in; returns tokens ---
export async function verifyOtp(
  email: string,
  code: string
): Promise<
  ApiResponse<{
    message?: string;
    access_token?: string;
    expires_in?: number;
  }>
> {
  const { data } = await apiClient.post<
    ApiResponse<{
      message?: string;
      access_token?: string;
      expires_in?: number;
    }>
  >(`${AUTH}/verify-otp`, { email, code });
  if (data.data?.access_token) setAccessToken(data.data.access_token);
  return data;
}

/** @deprecated Use verifyOtp */
export async function verifyEmailByCode(
  email: string,
  code: string
): Promise<
  ApiResponse<{
    message?: string;
    access_token?: string;
    expires_in?: number;
  }>
> {
  return verifyOtp(email, code);
}

// --- Current user ---
export async function getCurrentUser(): Promise<ApiResponse<UserResponse>> {
  const { data } = await apiClient.get<ApiResponse<UserResponse>>(
    `${USERS}/me`
  );
  return data;
}

export interface UserUpdateRequest {
  first_name?: string | null;
  last_name?: string | null;
  mobile?: string | null;
  timezone?: string | null;
  avatar_url?: string | null;
}

export async function updateCurrentUser(
  body: UserUpdateRequest
): Promise<ApiResponse<UserResponse>> {
  const { data } = await apiClient.patch<ApiResponse<UserResponse>>(
    `${USERS}/me`,
    body
  );
  return data;
}

// --- Current user profiles (organisation memberships) ---
export interface UserProfileResponse {
  id: string;
  organisation_id: string;
  organisation_name: string;
  role_id: string;
  role_name: string;
  user_id?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  joined_at?: string;
  created_by_id?: string | null;
  [key: string]: unknown;
}

export async function getCurrentUserProfiles(): Promise<
  ApiResponse<UserProfileResponse[]>
> {
  const { data } = await apiClient.get<ApiResponse<UserProfileResponse[]>>(
    `${USERS}/me/profiles`
  );
  return data;
}

// --- Create organisation (business form) ---
export interface CreateOrganisationRequest {
  name: string;
  slug: string;
  description?: string;
  website?: string;
  logo_url?: string;
  country?: string;
}

export interface OrganisationResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  logo_url: string | null;
  country: string | null;
  currency_code: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export async function createOrganisation(
  body: CreateOrganisationRequest
): Promise<OrganisationResponse> {
  const { data } = await apiClient.post<OrganisationResponse>(`${ORG}/`, body);
  return data;
}

// --- Get / update current organisation (requires X-Organisation-Id) ---
export interface OrganisationUpdateRequest {
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  website?: string | null;
  logo_url?: string | null;
  country?: string | null;
}

export async function getOrganisation(
  organisationId: string
): Promise<OrganisationResponse> {
  const { data } = await apiClient.get<OrganisationResponse>(`${ORG}/`, {
    headers: { 'X-Organisation-Id': organisationId },
  });
  return data;
}

// --- Organisation members (team) ---
export interface OrgMemberResponse {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role_id: string;
  role_name: string;
  joined_at: string;
}

export async function listOrgMembers(
  organisationId: string
): Promise<OrgMemberResponse[]> {
  const { data } = await apiClient.get<ApiResponse<OrgMemberResponse[]>>(
    `${ORG}/members`,
    { headers: { 'X-Organisation-Id': organisationId } }
  );
  return data.data ?? [];
}

export async function updateOrganisation(
  organisationId: string,
  body: OrganisationUpdateRequest
): Promise<OrganisationResponse> {
  const { data } = await apiClient.patch<OrganisationResponse>(
    `${ORG}/`,
    body,
    {
      headers: { 'X-Organisation-Id': organisationId },
    }
  );
  return data;
}
