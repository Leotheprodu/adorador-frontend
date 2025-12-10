import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

// Mock HeroUI components
jest.mock('@heroui/react', () => ({
  Modal: ({
    children,
    isOpen,
  }: {
    children: React.ReactNode;
    isOpen: boolean;
  }) => (isOpen ? <div data-testid="modal">{children}</div> : null),
  ModalContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  ModalHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  ModalBody: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  ModalFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Button: ({
    children,
    onPress,
  }: {
    children: React.ReactNode;
    onPress?: () => void;
  }) => <button onClick={onPress}>{children}</button>,
}));

describe('DeleteConfirmModal', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    title: 'Test Video',
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when isOpen is true', () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(<DeleteConfirmModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('should display confirmation header', () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    expect(screen.getByText('Confirmar Eliminación')).toBeInTheDocument();
  });

  it('should display video title in confirmation message', () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    expect(screen.getByText('Test Video')).toBeInTheDocument();
    expect(
      screen.getByText(/¿Estás seguro de eliminar el video/),
    ).toBeInTheDocument();
  });

  it('should display "sin título" when title is not provided', () => {
    render(<DeleteConfirmModal {...defaultProps} title={undefined} />);

    expect(screen.getByText('sin título')).toBeInTheDocument();
  });

  it('should display warning message', () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    expect(
      screen.getByText('Esta acción no se puede deshacer.'),
    ).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onConfirm and onClose when confirm button is clicked', () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    const confirmButton = screen.getByText('Eliminar');
    fireEvent.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should render cancel and confirm buttons', () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Eliminar')).toBeInTheDocument();
  });
});
