import { Input } from '@nextui-org/react';

export const InputUsernameSignUpForm = ({
  handle,
}: {
  handle: {
    // eslint-disable-next-line
    handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    username: string;
    noFormValue?: { username: boolean };
  };
}) => {
  const { handleOnChange, username, noFormValue } = handle;

  return (
    <div className="flex flex-col items-center justify-center">
      <Input
        size="lg"
        label="Nombre de usuario"
        placeholder="Ingresa tu nombre de usuario"
        variant="underlined"
        type="text"
        className=""
        autoComplete="username"
        value={username}
        onChange={handleOnChange}
        name="username"
        isInvalid={noFormValue?.username}
      />
    </div>
  );
};
