import { MailIcon } from '@global/icons/MailIcon';
import { Input } from '@heroui/react';

export const InputEmailSignUpForm = ({
  handle,
}: {
  handle: {
    // eslint-disable-next-line
    handleOnClear: (name: string) => void;
    email: string;
    // eslint-disable-next-line
    handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    noFormValue?: { email: boolean };
  };
}) => {
  const { handleOnClear, email, handleOnChange, noFormValue } = handle;
  return (
    <div className="flex flex-col items-center justify-center">
      <Input
        size="lg"
        type="email"
        isClearable
        onClear={() => handleOnClear('email')}
        label="Correo Electrónico"
        placeholder="ejemplo@correo.com"
        className=""
        variant="bordered"
        startContent={
          <MailIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
        }
        autoComplete="email"
        value={email}
        onChange={handleOnChange}
        name="email"
        isInvalid={noFormValue?.email}
        errorMessage={
          noFormValue?.email && 'El correo electrónico es requerido'
        }
        description="Requerido para recuperación de cuenta"
      />
    </div>
  );
};
