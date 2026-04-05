import { useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './TextInput.module.css';

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string | boolean;
  isPassword?: boolean;
  value?: string;
  validateOnBlur?: (value: string) => string | null; 
};

export const TextInput = ({
  label,
  error,
  isPassword = false,
  type,
  value = '',
  validateOnBlur,
  ...rest
}: TextInputProps) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type || 'text';

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    if (validateOnBlur) {
      const validationResult = validateOnBlur(e.target.value);
      setLocalError(validationResult);
    }
    rest.onBlur?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    rest.onFocus?.(e);
  };

  return (
    <div className={styles.field}>
      <div className={clsx({ [styles.passwordWrapper]: isPassword })}>
        <input
          {...rest}
          type={inputType}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={clsx(styles.input, { [styles.inputError]: error || localError })}
          placeholder={focused ? '' : label} // скрываем placeholder при фокусе
        />

        {isPassword && (
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <img src="./Union.png" alt="toggle password visibility" />
          </button>
        )}
      </div>


      {(value || focused) && <label className={styles.label}>{label}</label>}


      {localError && <p className={styles.error}>{localError}</p>}
      {error && typeof error === 'string' && <p className={styles.error}>{error}</p>}
    </div>
  );
};