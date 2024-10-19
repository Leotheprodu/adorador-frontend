import { Input } from '@nextui-org/react';
import { EndContentInputPassword } from './EndContentInputPassword';
import { KeyIcon } from '@/global/icons/KeyIcon';

export const InputPasswordLoginForm = ({
  handle,
}: {
  handle: {
    // eslint-disable-next-line
    handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isVisible: boolean;
    toggleVisibility: () => void;
    isInvalidPass?: boolean;
    password: string;
    confirmPassword?: boolean;
  };
}) => {
  const {
    handleOnChange,
    isVisible,
    toggleVisibility,
    isInvalidPass = false,
    password,
    confirmPassword = false,
  } = handle;

  return (
    <div className="flex flex-col items-center justify-center">
      <Input
        size="lg"
        label={confirmPassword ? 'Confirmar contraseña' : 'Contraseña'}
        placeholder="Ingresa tu contraseña"
        variant="underlined"
        endContent={
          <EndContentInputPassword
            isVisible={isVisible}
            toggleVisibility={toggleVisibility}
          />
        }
        type={isVisible ? 'text' : 'password'}
        className="max-w-xs"
        startContent={
          <KeyIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
        }
        autoComplete="current-password"
        isInvalid={isInvalidPass}
        errorMessage={isInvalidPass && 'Contraseña Incorrecta'}
        value={password}
        onChange={handleOnChange}
        name={confirmPassword ? 'password2' : 'password'}
      />
    </div>
  );
};
