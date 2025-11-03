import { PhoneIcon } from '@global/icons/PhoneIcon';
import { Input } from '@nextui-org/react';

export const InputPhoneLoginForm = ({
  handle,
}: {
  handle: {
    // eslint-disable-next-line
    handleOnClear: (name: string) => void;
    phone: string;
    // eslint-disable-next-line
    handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    noFormValue?: { phone: boolean };
  };
}) => {
  const { handleOnClear, phone, handleOnChange, noFormValue } = handle;
  return (
    <div className="flex flex-col items-center justify-center">
      <Input
        size="lg"
        type="tel"
        isClearable
        isRequired
        onClear={() => handleOnClear('phone')}
        label="Número de WhatsApp"
        placeholder="+50677778888"
        className=""
        variant="underlined"
        startContent={
          <PhoneIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
        }
        autoComplete="tel"
        value={phone}
        onChange={handleOnChange}
        name="phone"
        required
        isInvalid={noFormValue?.phone}
        description="Incluye el + y código de país"
      />
    </div>
  );
};
