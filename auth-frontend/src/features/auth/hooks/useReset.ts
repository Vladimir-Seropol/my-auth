import { useMutation } from '@tanstack/react-query';
import { requestReset } from '../../../shared/api/endpoints/authApi';
import { getErrorMessage } from '../../../shared/lib/getErrorMessage';

export const useReset = () =>
  useMutation({
    mutationFn: async (data: { email: string }) => {
      try {
        return await requestReset(data.email);
      } catch (err) {
        const message = getErrorMessage(err);
        throw new Error(message);
      }
    },
  });