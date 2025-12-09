import { Input } from "@heroui/react";

export const InputBirthdateSignUpForm = ({
  handle,
}: {
  handle: {
    // eslint-disable-next-line
    handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    birthdate: string;
    noFormValue?: { birthdate: boolean };
  };
}) => {
  const { handleOnChange, birthdate, noFormValue } = handle;

  return (
    <div className="flex flex-col items-center justify-center">
      <Input
        size="lg"
        placeholder="Ingresa tu fecha de nacimiento"
        variant="underlined"
        type="date"
        className=""
        autoComplete="birthdate"
        value={birthdate}
        onChange={handleOnChange}
        name="birthdate"
        isInvalid={noFormValue?.birthdate}
      />
    </div>
  );
};
