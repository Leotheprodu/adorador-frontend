import { Button, ButtonProps } from '@nextui-org/react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface PrimaryButtonProps extends Omit<ButtonProps, 'as'> {
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
 * Botón principal con gradiente morado de la marca.
 *
 * Puede usarse como:
 * - Link: Pasando la prop `href`
 * - Button: Pasando la prop `onClick`, `onPress` o para forms con `type="submit"`
 *
 * @example
 * // Como link
 * <PrimaryButton href="/auth/login">Iniciar sesión</PrimaryButton>
 *
 * @example
 * // Como button con onClick
 * <PrimaryButton onClick={handleClick} isLoading={isPending}>Guardar</PrimaryButton>
 *
 * @example
 * // Como submit button en form con estado de carga
 * <PrimaryButton type="submit" isLoading={isPending} disabled={!isValid}>
 *   Crear cuenta
 * </PrimaryButton>
 *
 * @example
 * // Con onPress (NextUI style)
 * <PrimaryButton onPress={handlePress} isDisabled={!canSubmit}>
 *   Enviar
 * </PrimaryButton>
 */
export const PrimaryButton = ({
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
}: PrimaryButtonProps) => {
  const baseClasses =
    'bg-gradient-primary font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl';

  // Combinar disabled y isDisabled
  const isButtonDisabled = isDisabled || disabled;

  if (href) {
    return (
      <Button
        as={Link}
        href={href}
        size="lg"
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
