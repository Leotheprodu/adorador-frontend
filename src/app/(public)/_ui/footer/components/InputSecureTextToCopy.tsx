import { CopyIcon } from '@/global/icons/CopyIcon';
import { EyeFilledIcon } from '@/global/icons/EyeFilledIcon';
import { EyeSlashFilledIcon } from '@/global/icons/EyeSlashFilledIcon';
import { Input, Tooltip } from '@nextui-org/react';
import toast from 'react-hot-toast';

import { useEffect, useState } from 'react';

export const InputSecureTextToCopy = ({
  value,
  label,
}: {
  value: string;
  label?: string;
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${text} copiado`);
      })
      .catch((err) => {
        console.error('Error al copiar en el portapapeles', err);
        toast.error('Error al copiar en el portapapeles');
      });
  };

  const handleHideShow = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  useEffect(() => {
    if (isPasswordVisible) {
      setTimeout(() => {
        setIsPasswordVisible(false);
      }, 10000);
    }
  }, [isPasswordVisible]);

  return (
    <Input
      label={label}
      type={isPasswordVisible ? 'text' : 'password'}
      value={value}
      className="text-xl font-bold"
      endContent={
        <div className="flex gap-1">
          <Tooltip content={'Ver/ocultar información'}>
            <button onClick={handleHideShow}>
              {isPasswordVisible ? (
                <EyeSlashFilledIcon className="text-slate-400" />
              ) : (
                <EyeFilledIcon className="text-slate-400" />
              )}
            </button>
          </Tooltip>
          <Tooltip content={'Copiar'}>
            <button className="text-sm" onClick={() => copyToClipboard(value)}>
              <CopyIcon className="text-xl text-slate-400 active:scale-125" />
            </button>
          </Tooltip>
        </div>
      }
    />
  );
};
