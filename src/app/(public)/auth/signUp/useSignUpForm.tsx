import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { handleOnChange, handleOnClear } from '@chore/utils/formUtils';
import { $user } from '@/stores/users';
import { setLocalStorage } from '@/modules/chore/utils/handleLocalStorage';
import { signUpService } from '../services/authService';
/* import { ErrorCode, ErrorMessage } from '@/modules/chore/utils/ErrorMsgFormat'; */
import { ghostToast } from '@/modules/chore/components/ghostToast';

export const useSignUpForm = (formInit: {
  email: string;
  password: string;
  password2: string;
  username: string;
}) => {
  const user = useStore($user);
  const [form, setForm] = useState(formInit);
  const [noFormValue, setNoFormValue] = useState({
    username: false,
    email: false,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isInvalidPass, setIsInvalidPass] = useState(false);
  const { data, error, status, mutate, isPending } = signUpService();

  useEffect(() => {
    if (noFormValue.email && form.email) {
      setNoFormValue({ ...noFormValue, email: false });
    }
    if (noFormValue.username && form.username) {
      setNoFormValue({ ...noFormValue, username: false });
    }
  }, [form]);

  useEffect(() => {
    if (status === 'success') {
      $user.set(data);
      setLocalStorage('user', data);
      ghostToast({
        message: `Usuario creado, revisa tu bandeja de correo electrónico`,
      });
      setForm(formInit);
      setIsInvalidPass(false);
      setIsVisible(false);
    } else if (status === 'error') {
      /* if (ErrorCode(error.message) === 403) {
        ghostToast({ message: `${user.name}, ya has iniciado sesión` });
        $user.set({ ...user, isLoggedIn: true });
        setLocalStorage('user', { ...user, isLoggedIn: true });
        return;
      }
      if (ErrorMessage(error.message) === 'Invalid Password') {
        ghostToast({ message: 'Contraseña Incorrecta', type: 'error' });
        setIsInvalidPass(true);
        return;
      }
      if (ErrorMessage(error.message) === 'User not found') {
        ghostToast({ message: 'El usuario no existe', type: 'error' });
        return;
      } */

      ghostToast({ message: 'Ha ocurrido un error', type: 'error' });
    }
  }, [data, error, status]);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.password2 !== form.password) {
      setIsInvalidPass(true);
      ghostToast({ message: 'Las contraseñas no coinciden', type: 'error' });
      return;
    } else if (!form.username) {
      setNoFormValue({ ...noFormValue, username: true });
      ghostToast({ message: 'El nombre de usuario es requerido' });
      return;
    } else if (!form.email) {
      setNoFormValue({ ...noFormValue, email: true });
      ghostToast({ message: 'El correo electrónico es requerido' });
      return;
    }
    // eslint-disable-next-line

    mutate({ password: form.password, email: form.email, name: form.username });
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
    handleSignUp,
    isVisible,
    isInvalidPass,
    user,
    isPending,
    noFormValue,
    status,
  };
};
