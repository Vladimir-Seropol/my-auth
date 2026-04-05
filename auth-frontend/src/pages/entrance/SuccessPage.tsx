import { useNavigate } from 'react-router-dom';
import styles from './SuccessPage.module.css';
import { routes } from '../../shared/config/routes';
import { SubmitButton } from '../../shared/ui/SubmitButton';
import { useEffect } from 'react';

export const SuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate(routes.login, { replace: true });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate(routes.login, { replace: true });
  };

  return (
    <div className={styles.success}>
      <div className={styles.success__box}>
        <h1 className={styles.success__title}>Вы вошли в систему!</h1>
        <p className={styles.success__description}>
          Добро пожаловать, ваш логин прошёл успешно.
        </p>
        <SubmitButton type="button" onClick={handleLogout}>
          Выход
        </SubmitButton>
      </div>
    </div>
  );
};