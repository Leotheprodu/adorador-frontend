/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $user } from '@stores/users';
import { signUpService } from '@auth/login/_services/authService';
import { setLocalStorage } from '@global/utils/handleLocalStorage';
import toast from 'react-hot-toast';
import { handleOnChange, handleOnClear } from '@global/utils/formUtils';

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
      toast.success('Usuario creado, revisa tu bandeja de correo electrónico');
      setForm(formInit);
      setIsInvalidPass(false);
      setIsVisible(false);
    } else if (status === 'error') {
      toast.error('Error al crear usuario');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, status]);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.password2 !== form.password) {
      setIsInvalidPass(true);
      toast.error('Las contraseñas no coinciden');
      return;
    } else if (!form.username) {
      setNoFormValue({ ...noFormValue, username: true });
      toast.error('El nombre de usuario es requerido');
      return;
    } else if (!form.email) {
      setNoFormValue({ ...noFormValue, email: true });
      toast.error('El correo electrónico es requerido');
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
