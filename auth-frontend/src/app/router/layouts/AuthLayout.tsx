
import { Link, Outlet } from 'react-router-dom';
import styles from './AuthLayout.module.css';
import { useLocation } from 'react-router-dom';

export const AuthLayout = () => {

    const location = useLocation();
const isLoginPage = location.pathname === '/';

    return (
        <div className={styles.auth_layout}>
            <h1 className={styles.auth_layout__title}>Авторизация</h1>
            <div className={styles.auth_layout__breadcrumbs}>
                <img src="./arrow.svg" alt="" className={styles.breadcrumbIcon} />

                {isLoginPage ? (
                    <span className={styles.breadcrumb}>Вход</span>
                ) : (
                    <>
                        <Link to="/" className={styles.breadcrumb}>Вход</Link>
                        <span className={styles.breadcrumbSeparator}><img src="./arrow.svg" alt="" /></span>
                        <span className={styles.breadcrumb}>
                            {location.pathname === '/register' ? 'Регистрация' : 'Восстановление пароля'}
                        </span>
                    </>
                )}
            </div>
            <div className={styles.auth_layout__content}>
                <div className={styles.auth_layout__banner}>
                    <p className={styles.auth_layout__banner__title}>Вход в систему</p>
                    <p className={styles.auth_layout__banner__description}>Дефолтный экран авторизации. Стандартный логин с валидацией по несуществующей связке почты и пароля.
                        Проверка введённых данных происходит после нажатия на кнопку <span >Войти.</span></p>
                        <img className={styles.auth_layout__banner__image} src="./Orbitto_Service.png" alt="Service" />
                </div>
                <div className={styles.auth_layout__left}>
                    <div className={styles.auth_layout__left__form}>
                        <div className={styles.auth_layout__left__form__logo}>
                            <img src="./Logo.png" alt="Logo" />
                        </div>

                        <Outlet />
                        <div className={styles.auth_layout__left__footer}>
                            <p>Еще не зарегистрированы? <Link to="/register" className={styles.registerLink}>Регистрация</Link></p>
                        </div>
                    </div>
                    <div className={styles.auth_layout__right}><img src="./Orbitto_Service.png" alt="Service" /></div>
                </div>
            </div>
        </div>
    );
};