import { useMutation } from '@tanstack/react-query';
import { register } from '../../../shared/api/endpoints/authApi';
import { getErrorMessage } from '../../../shared/lib/getErrorMessage';

export const useRegister = () =>
  useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      try {
        return await register(data);
      } catch (err) {
        const message = getErrorMessage(err);
        throw new Error(message);
      }
    },
  });