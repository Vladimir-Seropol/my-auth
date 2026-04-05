import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiClient } from '../../../shared/api/client.js';
import { TextInput } from '../../../shared/ui/Input.js';
import { SubmitButton } from '../../../shared/ui/SubmitButton.js';
import { loginSchema, type LoginFormValues } from '../model/loginSchema.js';
import styles from './AuthForm.module.css';
import { Link, useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
  });

  const onSubmit = async (data: LoginFormValues) => {
    setBackendError(null); 
    try {
      const response = await apiClient.post('/api/users/login', {
        email: data.email,
        password: data.password,
      });

      const token = response.data.access_token;
      console.log('Access token:', token);
      localStorage.setItem('token', token);

      navigate('/success');
    } catch (err: any) {
      if (err.response?.data?.message) {
        setBackendError(err.response.data.message);
      } else {
        setBackendError('Произошла ошибка при логине');
      }
      console.error('Login error:', err);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.title}>Войти в систему</h2>

      <TextInput
        label="Email"
        {...register('email')}
        error={errors.email?.message}
        value={watch('email')}
      />

      <TextInput
        label="Пароль"
        {...register('password')}
        error={errors.password?.message}
        isPassword
        value={watch('password')}
      />

      {backendError && <p className={styles.error}>{backendError}</p>}

      <SubmitButton isPending={isSubmitting}>Войти</SubmitButton>

      <Link to="/reset" className={styles.link}>
        Забыли пароль?
      </Link>
    </form>
  );
};