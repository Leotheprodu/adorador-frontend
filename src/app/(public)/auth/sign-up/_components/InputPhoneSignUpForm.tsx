import { Input } from '@heroui/react';

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
        label="Número de WhatsApp"
        placeholder="+50677778888"
        variant="bordered"
        type="tel"
        className=""
        autoComplete="tel"
        value={phone}
        onChange={handleOnChange}
        name="phone"
        isRequired
        isInvalid={noFormValue?.phone}
        description="Incluye el + y código de país (ej: +50677778888)"
      />
    </div>
  );
};
