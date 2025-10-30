/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';
import { loginService } from '@auth/login/_services/loginService';
import { setLocalStorage } from '@global/utils/handleLocalStorage';
import { setTokens, getTokenExpirationTime } from '@global/utils/jwtUtils';
import toast from 'react-hot-toast';
import { handleOnChange, handleOnClear } from '@global/utils/formUtils';

export const useLoginForm = (formInit: { email: string; password: string }) => {
  const user = useStore($user);
  const [form, setForm] = useState(formInit);
  const [isInvalidPass, setIsInvalidPass] = useState(false);
  const { data, error, status, mutate, isPending } = loginService();
  const errorMessage = (error: string) => {
    return error.split('-')[1];
  };

  const errorCode = (error: string) => {
    return parseInt(error.split('-')[0]);
  };

  useEffect(() => {
    if (status === 'success' && data) {
      console.log('Respuesta de login:', data); // Debug log

      // Validar que la respuesta tenga la estructura esperada
      if (!data.accessToken || !data.refreshToken) {
        console.error('Tokens JWT faltantes en la respuesta:', data);
        toast.error('Error: Tokens de autenticación faltantes');
        return;
      }

      // El backend retorna los datos del usuario directamente en el objeto raíz
      // junto con los tokens, no dentro de una propiedad 'user'
      const { accessToken, refreshToken, ...userData } = data;

      // Almacenar tokens JWT
      setTokens({
        accessToken,
        refreshToken,
        expiresAt: getTokenExpirationTime(accessToken),
      });

      // Crear objeto de usuario sin los tokens
      const userWithLogin = {
        ...userData,
        isLoggedIn: true,
      };

      $user.set(userWithLogin);
      setLocalStorage('user', userWithLogin);

      const userName = data.name || 'Usuario';
      toast.success(`Bienvenido ${userName}`);
      setForm(formInit);
      setIsInvalidPass(false);
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
    handleOnChange: handleChange,
    handleOnClear: (name: string) => handleOnClear(name, setForm),
    handleLogin,
    isInvalidPass,
    user,
    isPending,
  };
};
