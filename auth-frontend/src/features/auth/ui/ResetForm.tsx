import { useForm } from 'react-hook-form';
import { useReset } from '../hooks/useReset';
import styles from './AuthForm.module.css'; 
import { SubmitButton } from '../../../shared/ui/SubmitButton';
import { TextInput } from '../../../shared/ui/Input';

type FormValues = {
  email: string;
};

export const ResetForm = () => {
  const { register, handleSubmit, watch, formState: { errors }  } = useForm<FormValues>();
  const { mutate, isPending, isSuccess } = useReset();

   const onSubmit = (data: FormValues) => {
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

      <SubmitButton isPending={isPending}>
        Отправить
      </SubmitButton>
    </form>
  );
};