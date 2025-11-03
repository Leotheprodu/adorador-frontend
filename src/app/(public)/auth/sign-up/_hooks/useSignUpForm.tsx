/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $user } from '@stores/users';
import toast from 'react-hot-toast';
import { handleOnChange, handleOnClear } from '@global/utils/formUtils';
import { signUpService } from '@auth/sign-up/_services/signUpService';

export const useSignUpForm = (formInit: {
  phone: string; // phone ahora es el campo principal
  password: string;
  password2: string;
  username: string;
  email: string; // email ahora es opcional
  birthdate: string;
}) => {
  const user = useStore($user);
  const [form, setForm] = useState(formInit);
  const [noFormValue, setNoFormValue] = useState({
    username: false,
    email: false,
    phone: false,
  });
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
    // Validar formato de teléfono: debe empezar con + seguido de números
    if (form.phone && !/^\+?\d*$/.test(form.phone)) {
      setForm({ ...form, phone: form.phone.slice(0, -1) });
      toast.error(
        'Formato inválido. Usa: +codigoPais + número (ej: +50677778888)',
      );
      //borra el ultimo valor ingresado si no es válido
    }
  }, [form.phone]);

  useEffect(() => {
    if (status === 'success' && data) {
      // Nuevo flujo: registro exitoso con token de WhatsApp
      toast.success(
        data.message || '¡Registro exitoso! Ahora verifica tu WhatsApp.',
      );
      setForm(formInit);
      setIsInvalidPass(false);
    } else if (status === 'error') {
      console.error('SignUp Error:', error);

      // Extraer mensaje de error
      const errorMessage = error?.message || '';
      const isConflictError =
        errorMessage.includes('409') ||
        errorMessage.includes('Conflict') ||
        errorMessage.includes('already exists') ||
        errorMessage.includes('ya existe') ||
        errorMessage.includes('teléfono ya existe');

      if (isConflictError) {
        toast.error(
          (t) => (
            <div>
              <p>📱 Este número de WhatsApp ya está registrado.</p>
              <div className="mt-2 flex flex-col gap-1">
                <a
                  href="/auth/login"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => toast.dismiss(t.id)}
                >
                  ¿Ya tienes cuenta? Inicia sesión →
                </a>
                <a
                  href="/auth/password-recovery"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => toast.dismiss(t.id)}
                >
                  ¿Olvidaste tu contraseña? →
                </a>
              </div>
            </div>
          ),
          {
            duration: 10000, // Más tiempo para leer
            style: {
              maxWidth: '450px',
            },
          },
        );
      } else if (errorMessage.includes('400')) {
        // Error de validación
        toast.error(
          '❌ Error en los datos ingresados. Verifica el formato del teléfono.',
        );
      } else {
        // Error genérico
        const cleanMessage = errorMessage.split('-')[1] || errorMessage;
        toast.error(
          `❌ ${cleanMessage || 'Error al crear usuario. Intenta de nuevo en unos momentos.'}`,
        );
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, status]);

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
    } else if (!form.phone) {
      setNoFormValue({ ...noFormValue, phone: true });
      toast.error('El número de WhatsApp es requerido');
      return;
    } else if (!form.phone.startsWith('+')) {
      setNoFormValue({ ...noFormValue, phone: true });
      toast.error('El teléfono debe empezar con + seguido del código de país');
      return;
    } else if (!/^\+[1-9]\d{7,14}$/.test(form.phone)) {
      setNoFormValue({ ...noFormValue, phone: true });
      toast.error('Formato de teléfono inválido. Ejemplo: +50677778888');
      return;
    }
    // Validar email solo si se proporciona
    else if (
      form.email &&
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email)
    ) {
      setNoFormValue({ ...noFormValue, email: true });
      toast.error('El correo electrónico no es válido');
      return;
    }

    mutate({
      password: form.password,
      phone: form.phone, // phone ya incluye el +
      name: form.username,
      email: form.email || undefined, // email es opcional
      birthdate: form.birthdate
        ? new Date(form.birthdate).toISOString()
        : undefined,
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleOnChange(setForm, e);
    setIsInvalidPass(false);
  };
  return {
    ...form,
    handleOnChange: handleChange,
    handleOnClear: (name: string) => handleOnClear(name, setForm),
    handleSignUp,
    isInvalidPass,
    user,
    isPending,
    noFormValue,
    status,
    data,
    dataPhone: data?.user?.phone,
  };
};
