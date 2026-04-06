# Auth Flow Frontend

Frontend-реализация регистрации, авторизации и восстановления пароля для инженерного челленджа.  
Цель — показать устойчивый клиент под реальный backend с обработкой ошибок, контролем асинхронности и продуманной архитектурой.

## Backend

Использован: [nestjs-realworld-example-app](https://github.com/lujakob/nestjs-realworld-example-app)  
- Контракт полностью рабочий, без тестовых данных  
- Основные API (typical auth API):
  - POST /api/users/login  
  - POST /api/users/register  
  - POST /api/users/reset  



## Запуск

### Backend
```bash
cd backend
npm install
npm run start
```
Сервер: http://localhost:3000
Swagger: http://localhost:3000/docs



### Frontend
```bash
cd frontend
npm install
npm run dev
```
Приложение: http://localhost:5173

### > ⚠ Перед входом пользователя необходимо пройти регистрацию


###### Архитектура

### Feature-Sliced Design (FSD):
app — точка входа и маршрутизация
pages — экраны
features/auth — логика авторизации
shared/api — работа с backend
shared/lib — утилиты (например, обработка ошибок)

### Состояние:
react-hook-form + zod для форм
@tanstack/react-query для серверного состояния
Loading / error состояния встроены
Контроль асинхронных сценариев

### API типизация:
type LoginRequest = { email: string; password: string; };
type LoginResponse = { accessToken: string; };
Вынесено в shared/api для изоляции транспортного слоя и масштабирования

### UX и устойчивость
Блокировка повторных отправок (isPending)
Отмена предыдущих запросов (AbortController)
Защита от race conditions (requestId)
Состояния: loading, error, success
Toggle видимости пароля
Floating labels, адаптивный layout

### Адаптивность
Desktop: 2 колонки (форма + изображение)
Tablet: изображение уменьшается
Mobile: изображение скрывается
Форма доступна на всех разрешениях

### UI и технологии
CSS Modules — изоляция стилей
Vite — быстрый dev-сервер
React Query — кеширование, retry, error handling
FSD (упрощённая) — читаемая структура, масштабируемость

### Тесты
Успешная авторизация
Обработка ошибок
Блокировка повторной отправки
```bash
npm run test
```
Инструменты: Vitest, Testing Library

### Production-планы
Error tracking (Sentry)
Refresh token flow
Критичные сценарии покрыты тестами
i18n (локализация)


### Использование ИИ
ChatGPT и Cursor использовались для:

генерации архитектурных идей
проверки edge cases
ускорения написания кода

Ключевые решения принимались вручную.

