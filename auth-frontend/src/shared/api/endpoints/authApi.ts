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

export const login = async (data: LoginRequest): Promise<User> => {
  const res = await apiClient.post('/api/users/login', {
    user: data,
  });

  return res.data.user;
};

export const register = async (data: LoginRequest): Promise<User> => {
  const res = await apiClient.post('/api/users/register', {
    user: {
      ...data,
      username: data.email, // временно используем email как username
    },
  });

  return res.data.user;
};

export const requestReset = async (_email: string) => {
  await new Promise((r) => setTimeout(r, 1000));

  return {
    message: 'Письмо отправлено',
  };
};