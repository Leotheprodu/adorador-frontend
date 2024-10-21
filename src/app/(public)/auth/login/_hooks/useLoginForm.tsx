/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';
import { loginService } from '@auth/login/_services/authService';
import { setLocalStorage } from '@global/utils/handleLocalStorage';
import toast from 'react-hot-toast';
import { errorCode, errorMessage } from '@global/utils/errorMsgFormat';
import { handleOnChange, handleOnClear } from '@global/utils/formUtils';

export const useLoginForm = (formInit: { email: string; password: string }) => {
  const user = useStore($user);
  const [form, setForm] = useState(formInit);
  const [isVisible, setIsVisible] = useState(false);
  const [isInvalidPass, setIsInvalidPass] = useState(false);
  const { data, error, status, mutate, isPending } = loginService();

  useEffect(() => {
    if (status === 'success') {
      $user.set(data);
      setLocalStorage('user', data);
      toast.success(`Bienvenido ${data.name}`);
      setForm(formInit);
      setIsInvalidPass(false);
      setIsVisible(false);
    } else if (status === 'error') {
      if (errorCode(error.message) === 403) {
        toast.error(`${user.name}, ya has iniciado sesión`);
        $user.set({ ...user, isLoggedIn: true });
        setLocalStorage('user', { ...user, isLoggedIn: true });
        return;
      }
      if (errorMessage(error.message) === 'Invalid Password') {
        toast.error('Contraseña incorrecta');
        setIsInvalidPass(true);
        return;
      }
      if (errorMessage(error.message) === 'User not found') {
        toast.error('Usuario no encontrado');
        return;
      }

      toast.error('Error al iniciar sesión');
    }
  }, [data, error, status]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(form);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleOnChange(setForm, e);
    setIsInvalidPass(false);
  };
  return {
    ...form,
    toggleVisibility,
    handleOnChange: handleChange,
    handleOnClear: (name: string) => handleOnClear(name, setForm),
    handleLogin,
    isVisible,
    isInvalidPass,
    user,
    isPending,
  };
};
