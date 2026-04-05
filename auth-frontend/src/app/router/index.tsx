import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../../pages/login/LoginPage';
import { RegisterPage } from '../../pages/register/RegisterPage';
import { ResetPasswordPage } from '../../pages/reset-password/ResetPasswordPage';
import { AuthLayout } from './layouts/AuthLayout';
import { SuccessPage } from '../../pages/entrance/SuccessPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'reset',
        element: <ResetPasswordPage />,
      },
    ],
  },
  {
    path: '/success',
    element: <SuccessPage />,
  },
]);