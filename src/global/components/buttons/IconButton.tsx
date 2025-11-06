import { Button, ButtonProps } from '@nextui-org/react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface IconButtonProps extends Omit<ButtonProps, 'as' | 'variant' | 'size'> {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'circular' | 'square' | 'rounded';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onPress?: () => void;
  ariaLabel?: string;
}

/**
 * Botón solo con ícono, ideal para controles compactos como navegación, menús, etc.
 * Soporta diferentes variantes: circular, cuadrado o redondeado.
 *
 * Puede usarse como:
 * - Link: Pasando la prop `href`
 * - Button: Pasando la prop `onClick` o `onPress`
 *
 * @example
 * // Botón circular de navegación (anterior)
 * <IconButton
 *   onClick={handlePrevious}
 *   variant="circular"
 *   disabled={isFirst}
 * >
 *   <span>‹</span>
 * </IconButton>
 *
 * @example
 * // Botón de menú redondeado
 * <IconButton
 *   onClick={handleMenu}
 *   variant="rounded"
 *   className="hover:bg-brand-purple-100"
 * >
 *   <MenuButtonIcon />
 * </IconButton>
 *
 * @example
 * // Botón cuadrado con link
 * <IconButton href="/config" variant="square" ariaLabel="Configuración">
 *   <SettingsIcon />
 * </IconButton>
 */
export const IconButton = ({
  children,
  href,
  onClick,
  onPress,
  className = '',
  variant = 'circular',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  disabled = false,
  type,
  ariaLabel,
  ...props
}: IconButtonProps) => {
  // Estilos base según variante
  const variantClasses = {
    circular: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg',
  };

  // Tamaños
  const sizeClasses = {
    sm: 'h-8 w-8 min-w-8',
    md: 'h-10 w-10 min-w-10',
    lg: 'h-12 w-12 min-w-12',
  };

  const baseClasses = `flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-0 text-slate-700 transition-all hover:scale-110 hover:from-brand-purple-100 hover:to-brand-pink-100 hover:text-brand-purple-700 disabled:opacity-30 disabled:hover:scale-100 ${variantClasses[variant]} ${sizeClasses[size]}`;

  // Combinar disabled y isDisabled
  const isButtonDisabled = isDisabled || disabled;

  if (href) {
    return (
      <Button
        as={Link}
        href={href}
        isIconOnly
        className={`${baseClasses} ${className}`}
        isLoading={isLoading}
        isDisabled={isButtonDisabled}
        aria-label={ariaLabel}
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
      isIconOnly
      className={`${baseClasses} ${className}`}
      isLoading={isLoading}
      isDisabled={isButtonDisabled}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </Button>
  );
};
