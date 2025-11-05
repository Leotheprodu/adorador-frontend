import { Button, ButtonProps } from '@nextui-org/react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface TertiaryButtonProps extends Omit<ButtonProps, 'as'> {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  endContent?: ReactNode;
  startContent?: ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onPress?: () => void;
}

/**
 * Botón terciario de texto sin borde.
 * Útil para acciones secundarias o enlaces de texto.
 *
 * Puede usarse como:
 * - Link: Pasando la prop `href`
 * - Button: Pasando la prop `onClick` o `onPress`
 *
 * @example
 * // Como link
 * <TertiaryButton href="/ayuda">¿Necesitas ayuda?</TertiaryButton>
 *
 * @example
 * // Como button con onClick y estados
 * <TertiaryButton onClick={handleSkip} isDisabled={!canSkip}>
 *   Omitir
 * </TertiaryButton>
 *
 * @example
 * // Con color personalizado y loading
 * <TertiaryButton
 *   onClick={handleReset}
 *   isLoading={isResetting}
 *   className="text-red-600"
 * >
 *   Restablecer contraseña
 * </TertiaryButton>
 */
export const TertiaryButton = ({
  children,
  href,
  onClick,
  onPress,
  className = '',
  endContent,
  startContent,
  isLoading = false,
  isDisabled = false,
  disabled = false,
  type,
  ...props
}: TertiaryButtonProps) => {
  const baseClasses =
    'bg-transparent font-semibold text-brand-purple-600 transition-all hover:text-brand-purple-700 hover:underline';

  // Combinar disabled y isDisabled
  const isButtonDisabled = isDisabled || disabled;

  if (href) {
    return (
      <Button
        as={Link}
        href={href}
        size="lg"
        variant="light"
        className={`${baseClasses} ${className}`}
        endContent={endContent}
        startContent={startContent}
        isLoading={isLoading}
        isDisabled={isButtonDisabled}
        {...props}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      onClick={onClick}
      onPress={onPress}
      type={type}
      size="lg"
      variant="light"
      className={`${baseClasses} ${className}`}
      endContent={endContent}
      startContent={startContent}
      isLoading={isLoading}
      isDisabled={isButtonDisabled}
      {...props}
    >
      {children}
    </Button>
  );
};
