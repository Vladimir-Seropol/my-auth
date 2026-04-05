import clsx from 'clsx';
import styles from './SubmitButton.module.css';

type SubmitButtonProps = {
  children: React.ReactNode;
  isPending?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
    loadingText?: string;
};

export const SubmitButton = ({
  children,
  isPending = false,
  disabled = false,
  type = 'submit',
  className,
  onClick,
    loadingText = '',
}: SubmitButtonProps) => {
  return (
    <button
      type={type}
      disabled={isPending || disabled}
      onClick={onClick}
      className={clsx(styles.button, className, {
        [styles.pending]: isPending,
      })}
    >
      {isPending ? <span className={styles.spinner}>{loadingText}</span> : children}
    </button>
  );
};