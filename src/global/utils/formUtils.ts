/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import type React from 'react';

export const handleOnChange = <T extends Record<string, any>>(
  setForm: (updater: (prevState: T) => T) => void,
  e: React.ChangeEvent<HTMLInputElement>,
) => {
  const { name, value } = mapEventToNameAndValue(e);
  setForm((prev) => ({ ...prev, [name]: value }));
};

// Esta función de mapeo toma el evento y la función setForm y devuelve { name, value } con los tipos correctos.
const mapEventToNameAndValue = <
  T extends Record<string, any>,
  K extends keyof T,
>(
  e: React.ChangeEvent<HTMLInputElement>,
): { name: K; value: T[K] } => {
  const { name, value } = e.target;
  return { name: name as K, value: value as T[K] };
};

export const handleOnClear = (
  name: string,
  setForm: (prev: (prevState: any) => any) => void,
) => {
  setForm((prev) => ({ ...prev, [name]: '' }));
};

export const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  // Selecciona automáticamente el contenido del input cuando se enfoca en él
  e.target.select();
};
