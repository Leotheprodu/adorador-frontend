/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { handleOnChange, handleOnClear, handleFocus } from '../formUtils';

describe('formUtils', () => {
  describe('handleOnChange', () => {
    it('should update form state with new value', () => {
      const mockSetForm = jest.fn();
      const mockEvent = {
        target: {
          name: 'username',
          value: 'testuser',
        },
      } as React.ChangeEvent<HTMLInputElement>;

      handleOnChange(mockSetForm, mockEvent);

      expect(mockSetForm).toHaveBeenCalledTimes(1);

      // Ejecutar el updater para verificar el resultado
      const updaterFn = mockSetForm.mock.calls[0][0];
      const prevState = { username: '', email: '' };
      const newState = updaterFn(prevState);

      expect(newState).toEqual({ username: 'testuser', email: '' });
    });

    it('should preserve other form fields when updating one field', () => {
      const mockSetForm = jest.fn();
      const mockEvent = {
        target: {
          name: 'email',
          value: 'test@example.com',
        },
      } as React.ChangeEvent<HTMLInputElement>;

      handleOnChange(mockSetForm, mockEvent);

      const updaterFn = mockSetForm.mock.calls[0][0];
      const prevState = { username: 'existinguser', email: '', age: 25 };
      const newState = updaterFn(prevState);

      expect(newState).toEqual({
        username: 'existinguser',
        email: 'test@example.com',
        age: 25,
      });
    });

    it('should handle numeric values as strings', () => {
      const mockSetForm = jest.fn();
      const mockEvent = {
        target: {
          name: 'age',
          value: '30',
        },
      } as React.ChangeEvent<HTMLInputElement>;

      handleOnChange(mockSetForm, mockEvent);

      const updaterFn = mockSetForm.mock.calls[0][0];
      const prevState = { age: '' };
      const newState = updaterFn(prevState);

      expect(newState).toEqual({ age: '30' });
    });
  });

  describe('handleOnClear', () => {
    it('should clear the specified field', () => {
      const mockSetForm = jest.fn();

      handleOnClear('username', mockSetForm);

      expect(mockSetForm).toHaveBeenCalledTimes(1);

      const updaterFn = mockSetForm.mock.calls[0][0];
      const prevState = { username: 'testuser', email: 'test@example.com' };
      const newState = updaterFn(prevState);

      expect(newState).toEqual({ username: '', email: 'test@example.com' });
    });

    it('should set field to empty string', () => {
      const mockSetForm = jest.fn();

      handleOnClear('email', mockSetForm);

      const updaterFn = mockSetForm.mock.calls[0][0];
      const prevState = { email: 'filled@example.com' };
      const newState = updaterFn(prevState);

      expect(newState.email).toBe('');
    });
  });

  describe('handleFocus', () => {
    it('should select all text in input when focused', () => {
      const mockSelect = jest.fn();
      const mockEvent = {
        target: {
          value: 'some text',
          select: mockSelect,
        },
      } as unknown as React.FocusEvent<HTMLInputElement>;

      handleFocus(mockEvent);

      expect(mockSelect).toHaveBeenCalledTimes(1);
    });

    it('should work with empty input', () => {
      const mockSelect = jest.fn();
      const mockEvent = {
        target: {
          value: '',
          select: mockSelect,
        },
      } as unknown as React.FocusEvent<HTMLInputElement>;

      handleFocus(mockEvent);

      expect(mockSelect).toHaveBeenCalledTimes(1);
    });
  });
});
