import { Input } from '@nextui-org/react';
import { EndContentInputPassword } from '@auth/login/_components/EndContentInputPassword';
import { KeyIcon } from '@global/icons/KeyIcon';
import { useEffect, useState } from 'react';

export const InputPasswordLoginForm = ({
  handle,
}: {
  handle: {
    // eslint-disable-next-line
    handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isInvalidPass?: boolean;
    password: string;
    confirmPassword?: boolean;
    placeHolder?: string;
  };
}) => {
  const [toggleVisibility, setToggleVisibility] = useState(false);

  useEffect(() => {
    if (toggleVisibility) {
      setTimeout(() => {
        setToggleVisibility(false);
      }, 5000);
    }
  }, [toggleVisibility]);

  const {
    handleOnChange,
    isInvalidPass = false,
    password,
    confirmPassword = false,
    placeHolder = 'Ingresa tu contraseña',
  } = handle;

  return (
    <div className="flex flex-col items-center justify-center">
      <Input
        size="lg"
        label={confirmPassword ? 'Confirmar contraseña' : 'Contraseña'}
        placeholder={placeHolder}
        isRequired
        variant="underlined"
        endContent={
          <EndContentInputPassword
            isVisible={toggleVisibility}
            toggleVisibility={() => setToggleVisibility(!toggleVisibility)}
          />
        }
        type={toggleVisibility ? 'text' : 'password'}
        className=""
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
