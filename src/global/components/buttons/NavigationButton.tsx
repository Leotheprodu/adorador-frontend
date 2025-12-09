import { Button, ButtonProps } from "@heroui/react";
import Link from 'next/link';
import { ReactNode } from 'react';

interface NavigationButtonProps extends Omit<ButtonProps, 'as'> {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  isDisabled?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onPress?: () => void;
}

/**
 * Botón de navegación con diseño especial para acciones de volver/navegar.
 * Tiene un estilo distintivo con fondo blanco/suave y efectos hover.
 *
 * Puede usarse como:
 * - Link: Pasando la prop `href`
 * - Button: Pasando la prop `onClick` o `onPress`
 *
 * @example
 * // Como button con onClick e ícono a la izquierda
 * <NavigationButton onClick={handleBack} icon={<BackwardIcon />}>
 *   Volver al grupo
 * </NavigationButton>
 *
 * @example
 * // Como link con ícono a la derecha
 * <NavigationButton href="/grupos" icon={<ArrowRightIcon />} iconPosition="right">
 *   Ir a grupos
 * </NavigationButton>
 *
 * @example
 * // Solo con ícono, sin texto
 * <NavigationButton onClick={handleBack} icon={<BackwardIcon />} />
 */
export const NavigationButton = ({
  children,
  href,
  onClick,
  onPress,
  className = '',
  icon,
  iconPosition = 'left',
  isLoading = false,
  isDisabled = false,
  disabled = false,
  type,
  ...props
}: NavigationButtonProps) => {
  const baseClasses =
    'group bg-white/80 font-medium text-brand-pink-700 shadow-sm transition-all hover:scale-105 hover:bg-brand-pink-50 hover:shadow-md active:scale-95';

  // Combinar disabled y isDisabled
  const isButtonDisabled = isDisabled || disabled;

  const content = (
    <>
      {icon && iconPosition === 'left' && <span>{icon}</span>}
      {children && <span>{children}</span>}
      {icon && iconPosition === 'right' && <span>{icon}</span>}
    </>
  );

  if (href) {
    return (
      <Button
        as={Link}
        href={href}
        size="lg"
        className={`${baseClasses} ${className}`}
        isLoading={isLoading}
        isDisabled={isButtonDisabled}
        {...props}
      >
        {content}
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
      isLoading={isLoading}
      isDisabled={isButtonDisabled}
      {...props}
    >
      {content}
    </Button>
  );
};
