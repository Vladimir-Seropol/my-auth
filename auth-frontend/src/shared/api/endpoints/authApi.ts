import { apiClient } from '../client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  email: string;
  token: string;
}

export const login = async (
  data: LoginRequest
): Promise<UserResponse> => {
  const res = await apiClient.post('/api/users/login', {
    user: data,
  });

  return res.data.user;
};

export const register = async (data: LoginRequest) => {
  const res = await apiClient.post('/api/users', {
    user: {
      ...data,
      username: data.email,
    },
  });

  return res.data.user;
};

export const requestReset = async (_data?: { email: string; }) => {
  await new Promise((r) => setTimeout(r, 1000));

  return {
    message: 'Письмо отправлено',
  };
};

