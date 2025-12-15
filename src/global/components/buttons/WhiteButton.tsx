'use client';
import { Button, ButtonProps } from '@heroui/react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface WhiteButtonProps extends Omit<ButtonProps, 'as'> {
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
 * Botón con fondo blanco, ideal para usar sobre fondos oscuros o gradientes.
 *
 * Puede usarse como:
 * - Link: Pasando la prop `href`
 * - Button: Pasando la prop `onClick`, `onPress` o para forms con `type="submit"`
 *
 * @example
 * // Como link sobre fondo oscuro
 * <WhiteButton href="/auth/login">Crear cuenta</WhiteButton>
 *
 * @example
 * // Como button con onClick
 * <WhiteButton onClick={handleClick} isLoading={isPending}>Confirmar</WhiteButton>
 */
export const WhiteButton = ({
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
}: WhiteButtonProps) => {
  const baseClasses =
    'bg-white text-brand-purple-600 font-semibold shadow-xl transition-all hover:scale-105 hover:shadow-2xl hover:bg-gray-50';

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
      size="lg"
      className={`${baseClasses} ${className}`}
      endContent={endContent}
      startContent={startContent}
      onClick={onClick}
      onPress={onPress}
      isLoading={isLoading}
      disabled={isButtonDisabled}
      type={type}
      {...props}
    >
      {children}
    </Button>
  );
};
