import { MailIcon } from '@global/icons/MailIcon';
import { Input } from '@nextui-org/react';

export const InputEmailLoginForm = ({
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
        isRequired
        onClear={() => handleOnClear('email')}
        label="Correo Electrónico"
        placeholder="Ingresa tu correo electrónico"
        className="text-gray-900 dark:text-brand-purple-200"
        variant="underlined"
        startContent={
          <MailIcon className="pointer-events-none flex-shrink-0 text-2xl text-brand-purple-600 dark:text-brand-purple-300" />
        }
        autoComplete="username"
        value={email}
        onChange={handleOnChange}
        name="email"
        required
        isInvalid={noFormValue?.email}
      />
    </div>
  );
};
