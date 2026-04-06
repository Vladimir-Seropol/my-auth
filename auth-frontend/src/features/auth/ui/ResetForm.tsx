import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useReset } from '../hooks/useReset';
import styles from './AuthForm.module.css';
import { SubmitButton } from '../../../shared/ui/SubmitButton';
import { TextInput } from '../../../shared/ui/Input';
import { resetSchema, type ResetFormValues } from '../model/resetSchema';

export const ResetForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    mode: 'onSubmit',
  });
  const { mutate, isPending, isSuccess, error } = useReset();

  const onSubmit = (data: ResetFormValues) => {
    mutate(data);
  };

  if (isSuccess) {
    return (
      <div className={styles.success}>
        <p>Письмо отправлено 📩</p>
        <p>Проверьте почту для восстановления пароля</p>
      </div>
    );
  }

   
  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.title}>Восстановление пароля</h2>

       <TextInput
              label="E-mail"
              {...register('email')}
              error={errors.email?.message}
              value={watch('email')}
            />

      <SubmitButton isPending={isPending}>Отправить</SubmitButton>

      {error && (
        <p className={styles.error}>
          {error instanceof Error ? error.message : 'Ошибка отправки'}
        </p>
      )}
    </form>
  );
};