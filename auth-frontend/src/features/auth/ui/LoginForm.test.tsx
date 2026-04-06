import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, beforeEach } from 'vitest';

import { LoginForm } from './LoginForm';
import { apiClient } from '../../../shared/api/client';

const mockedPost = vi.spyOn(apiClient, 'post');

const renderWithProviders = (ui: React.ReactNode) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </MemoryRouter>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('LoginForm', () => {
  it('login success', async () => {

    mockedPost.mockResolvedValue({ data: { access_token: '123' } });

    renderWithProviders(<LoginForm />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/пароль/i);
    const submitButton = screen.getByRole('button', { name: /войти/i });

    await userEvent.type(emailInput, 'test@mail.com');
    await userEvent.type(passwordInput, '123456');
    await userEvent.click(submitButton);

    await waitFor(() =>
      expect(mockedPost).toHaveBeenCalledWith('/api/users/login', {
        email: 'test@mail.com',
        password: '123456',
      })
    );

    await waitFor(() =>
      expect(localStorage.getItem('token')).toBe('123')
    );
  });

  it('login error', async () => {
    // Мокаем ошибку логина
    mockedPost.mockRejectedValue({
      response: { data: { message: 'Неверный email или пароль' }, status: 400 },
    });

    renderWithProviders(<LoginForm />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/пароль/i);
    const submitButton = screen.getByRole('button', { name: /войти/i });

    await userEvent.type(emailInput, 'wrong@mail.com');
    await userEvent.type(passwordInput, 'wrongpass');
    await userEvent.click(submitButton);

    // Проверяем отображение ошибки
    const errorMessage = await screen.findByText(/неверный email или пароль/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('button disabled while loading', async () => {

    let resolvePromise!: (value: { data: { access_token: string } }) => void;

    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockedPost.mockReturnValue(promise);

    renderWithProviders(<LoginForm />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/пароль/i);
    const submitButton = screen.getByRole('button', { name: /войти/i });

    await userEvent.type(emailInput, 'test@mail.com');
    await userEvent.type(passwordInput, '123456');

    await userEvent.click(submitButton);


    expect(submitButton).toBeDisabled();

    resolvePromise({ data: { access_token: '123' } });

    await waitFor(() => expect(submitButton).not.toBeDisabled());
  });
});