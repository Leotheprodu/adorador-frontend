import { Button, ButtonProps } from '@nextui-org/react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface SecondaryButtonProps extends Omit<ButtonProps, 'as'> {
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
 * Botón secundario con borde de la marca.
 *
 * Puede usarse como:
 * - Link: Pasando la prop `href`
 * - Button: Pasando la prop `onClick`, `onPress` o para forms con `type="submit"`
 *
 * @example
 * // Como link
 * <SecondaryButton href="/demo">Ver demo</SecondaryButton>
 *
 * @example
 * // Como button con onClick y estados
 * <SecondaryButton onClick={handleCancel} disabled={isProcessing}>
 *   Cancelar
 * </SecondaryButton>
 *
 * @example
 * // Con borde personalizado y loading
 * <SecondaryButton
 *   onClick={handleSave}
 *   isLoading={isSaving}
 *   className="border-white text-white"
 * >
 *   Guardar borrador
 * </SecondaryButton>
 */
export const SecondaryButton = ({
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
}: SecondaryButtonProps) => {
  const baseClasses =
    'border-2 border-brand-purple-600 bg-transparent font-semibold text-brand-purple-600 transition-all hover:bg-brand-purple-600 hover:text-white';

  // Combinar disabled y isDisabled
  const isButtonDisabled = isDisabled || disabled;

  if (href) {
    return (
      <Button
        as={Link}
        href={href}
        size="lg"
        variant="bordered"
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
      variant="bordered"
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
