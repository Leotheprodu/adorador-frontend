import { Input } from '@nextui-org/react';

export const InputPhoneSignUpForm = ({
  handle,
}: {
  handle: {
    // eslint-disable-next-line
    handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    phone: string;
    noFormValue?: { phone: boolean };
  };
}) => {
  const { handleOnChange, phone, noFormValue } = handle;

  return (
    <div className="flex flex-col items-center justify-center">
      <Input
        size="lg"
        label="Ingresa tu numero de teléfono"
        placeholder="50677778888"
        variant="underlined"
        type="text"
        className=""
        autoComplete="phone"
        value={phone}
        onChange={handleOnChange}
        name="phone"
        isInvalid={noFormValue?.phone}
      />
    </div>
  );
};
