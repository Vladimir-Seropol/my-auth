import { isAxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { login } from '../../../shared/api/endpoints/authApi';

export const useLogin = () => {
  return useMutation({
    mutationFn: login,

      onSuccess: (user) => {
      localStorage.setItem('token', user.token);
      
      // window.location.href = '/';
    },

    onError: (error) => {
      console.error('Login error', error);
    },

    retry: (failureCount, error: unknown) => {
      if (!isAxiosError(error)) {
        return failureCount < 2;
      }
      if (error.response?.status === 401) return false;
      if (!error.response) return failureCount < 2;

      return false;
    },
  });
};
