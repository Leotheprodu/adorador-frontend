import { EyeFilledIcon } from '@global/icons/EyeFilledIcon';
import { EyeSlashFilledIcon } from '@global/icons/EyeSlashFilledIcon';

export const EndContentInputPassword = ({ toggleVisibility, isVisible }) => {
  return (
    <button
      className="focus:outline-none"
      type="button"
      onClick={toggleVisibility}
    >
      {isVisible ? (
        <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
      ) : (
        <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
      )}
    </button>
  );
};
