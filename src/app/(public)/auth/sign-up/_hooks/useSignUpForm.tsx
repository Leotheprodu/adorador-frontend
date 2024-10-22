/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $user } from '@stores/users';
import toast from 'react-hot-toast';
import { handleOnChange, handleOnClear } from '@global/utils/formUtils';
import { signUpService } from '@auth/sign-up/_services/signUpService';

export const useSignUpForm = (formInit: {
  email: string;
  password: string;
  password2: string;
  username: string;
  phone: string;
  birthdate: string;
}) => {
  const user = useStore($user);
  const [form, setForm] = useState(formInit);
  const [noFormValue, setNoFormValue] = useState({
    username: false,
    email: false,
    phone: false,
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
    if (noFormValue.phone && form.phone) {
      setNoFormValue({ ...noFormValue, phone: false });
    }
  }, [form]);

  useEffect(() => {
    // si mientras escriben el numero de telefono no permite que pongan letras o caracteres especiales
    if (form.phone && !/^\d+$/.test(form.phone)) {
      setForm({ ...form, phone: form.phone.slice(0, -1) });
      toast.error(
        ' El teléfono solo puede contener números ejemplo: 50677778888',
      );
      //borra el ultimo valor ingresado si no es un numero
    }
  }, [form.phone]);

  useEffect(() => {
    if (status === 'success') {
      toast.success('Usuario creado, revisa tu bandeja de correo electrónico');
      setForm(formInit);
      setIsInvalidPass(false);
      setIsVisible(false);
    } else if (status === 'error') {
      console.log(error);
      toast.error('Error al crear usuario');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, status]);
  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }
  }, [isVisible]);

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
    //valida que el correo sea valido
    else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email)
    ) {
      setNoFormValue({ ...noFormValue, email: true });
      toast.error('El correo electrónico no es válido');
      return;
    } else if (form.phone && !/^\d+$/.test(form.phone)) {
      setNoFormValue({ ...noFormValue, phone: true });
      toast.error(
        'El teléfono solo puede contener números ejemplo: 50677778888',
      );
      return;
    }

    // eslint-disable-next-line

    mutate({
      password: form.password,
      email: form.email,
      name: form.username,
      phone: form.phone.length > 0 ? '+' + form.phone : '',
      birthdate: form.birthdate ?? new Date(form.birthdate).toISOString(),
    });
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
    dataEmail: data?.email,
  };
};
