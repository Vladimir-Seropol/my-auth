import { useMutation } from '@tanstack/react-query';
import { login } from '../../../shared/api/endpoints/authApi';

export const useLogin = () => {
  return useMutation({
    mutationFn: login,

    retry: (failureCount, error: any) => {

      if (error?.response?.status === 401) return false;
      if (!error?.response) return failureCount < 2;

      return false;
    },
  });
};
