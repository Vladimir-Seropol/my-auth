import { AxiosError } from 'axios';
import type { ApiError } from '../api/types';

export const getErrorMessage = (error: unknown): string => {
  const axiosError = error as AxiosError<ApiError>;

  if (!axiosError.response) {
    return 'Ошибка сети. Проверьте подключение';
  }

  const status = axiosError.response.status;
  const data = axiosError.response.data;

  if (status === 400) return data?.message || 'Некорректные данные';
  if (status === 401) return 'Неверный email или пароль';
  if (status === 403) return 'Доступ запрещен';
  if (status === 404) return 'Пользователь не найден';
  if (status >= 500) return 'Ошибка сервера. Попробуйте позже';

  return data?.message || 'Что-то пошло не так';
};