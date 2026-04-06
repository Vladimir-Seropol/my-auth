import { apiClient } from '../client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  email: string;
  token: string;
  username: string;
  bio: string | null;
  image: string | null;
}

/** Бэкенд отдаёт `user.token` как строку JWT или как `{ access_token }` из UserService.login() */
export function resolveAuthToken(
  token: string | { access_token: string } | undefined
): string {
  if (typeof token === 'string') return token;
  if (token && typeof token === 'object' && 'access_token' in token) {
    return token.access_token;
  }
  throw new Error('Нет токена в ответе сервера');
}

export const login = async (data: LoginRequest): Promise<User> => {
  const res = await apiClient.post('/api/users/login', {
    user: data,
  });

  const u = res.data.user;
  return {
    email: u.email,
    username: u.username,
    bio: u.bio ?? null,
    image: u.image ?? null,
    token: resolveAuthToken(u.token),
  };
};

export const register = async (data: LoginRequest): Promise<User> => {
  const res = await apiClient.post('/api/users/register', {
    user: {
      ...data,
      username: data.email, 
    },
  });

  const u = res.data.user;
  return {
    email: u.email,
    username: u.username,
    bio: u.bio ?? null,
    image: u.image ?? null,
    token: resolveAuthToken(u.token),
  };
};

export const requestReset = async (email: string) => {
  await new Promise((r) => setTimeout(r, 1000));

  return {
    message: `Письмо отправлено на ${email}`,
  };
};