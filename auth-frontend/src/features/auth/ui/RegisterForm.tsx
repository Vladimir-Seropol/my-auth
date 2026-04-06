import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '../hooks/useRegister';
import styles from './AuthForm.module.css';
import { Link } from 'react-router-dom';
import { SubmitButton } from '../../../shared/ui/SubmitButton';
import { TextInput } from '../../../shared/ui/Input';
import {
  registerSchema,
  type RegisterFormValues,
} from '../model/loginSchema';

function registerErrorText(error: unknown): string {
  const raw =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : '';

  if (!raw.trim()) {
    return 'Ошибка регистрации';
  }

  if (/уже существует|already exists/i.test(raw)) {
    return 'Пользователь уже был зарегистрирован';
  }

  return raw;
}

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
  });

  const { mutate, isPending, error, isSuccess } = useRegister();

  const onSubmit = (data: RegisterFormValues) => mutate(data);

  if (isSuccess) {
    return (
      <div className={styles.success}>
        <p>Регистрация успешна</p>
        <Link to="/">Перейти ко входу</Link>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.title}>Регистрация</h2>

      <TextInput
        label="E-mail"
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

      <SubmitButton isPending={isPending}>
        Зарегистрироваться
      </SubmitButton>

      {error && (
        <p className={styles.error}>{registerErrorText(error)}</p>
      )}

      <Link to="/" className={styles.link}>
        Уже есть аккаунт? Войти
      </Link>
    </form>
  );
};