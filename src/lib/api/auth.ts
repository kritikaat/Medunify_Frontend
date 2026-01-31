import { API_ENDPOINTS, USER_STORAGE_KEY, TOKEN_STORAGE_KEY } from './config';
import { post, setAccessToken, removeAccessToken } from './client';
import type { LoginRequest, LoginResponse, User } from '@/types/api';

// Login user
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await post<LoginResponse>(API_ENDPOINTS.LOGIN, credentials);
  
  // Store the token and user info
  setAccessToken(response.access_token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
  
  return response;
}

// Logout user
export function logout(): void {
  removeAccessToken();
  localStorage.removeItem(USER_STORAGE_KEY);
}

// Get current user from storage
export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem(USER_STORAGE_KEY);
  if (userJson) {
    try {
      return JSON.parse(userJson) as User;
    } catch {
      return null;
    }
  }
  return null;
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return !!token;
}
