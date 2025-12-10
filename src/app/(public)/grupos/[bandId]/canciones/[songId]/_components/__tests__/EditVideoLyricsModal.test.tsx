import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditVideoLyricsModal } from '../EditVideoLyricsModal';

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
    type,
  }: {
    children: React.ReactNode;
    onPress?: () => void;
    type?: string;
  }) => (
    <button onClick={onPress} type={type}>
      {children}
    </button>
  ),
  Input: ({
    label,
    value,
    onValueChange,
  }: {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
  }) => (
    <input
      aria-label={label}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    />
  ),
  Textarea: ({
    label,
    value,
    onValueChange,
  }: {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
  }) => (
    <textarea
      aria-label={label}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    />
  ),
  Select: ({
    children,
    selectedKeys,
  }: {
    children: React.ReactNode;
    selectedKeys: string[];
  }) => <select value={selectedKeys[0]}>{children}</select>,
  SelectItem: ({ children }: { children: React.ReactNode }) => (
    <option>{children}</option>
  ),
  Checkbox: ({
    children,
    isSelected,
    onValueChange,
  }: {
    children: React.ReactNode;
    isSelected: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <label>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => onValueChange(e.target.checked)}
      />
      {children}
    </label>
  ),
}));

describe('EditVideoLyricsModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  const mockVideo = {
    id: 1,
    youtubeId: 'dQw4w9WgXcQ',
    title: 'Test Video',
    videoType: 'instrumental' as const,
    description: 'Test description',
    priority: 5,
    usesVideoLyrics: true,
    isPreferred: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    songId: 100,
  };

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    video: mockVideo,
    onSave: mockOnSave,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when isOpen is true and video is provided', () => {
    render(<EditVideoLyricsModal {...defaultProps} />);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(<EditVideoLyricsModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('should not render when video is null', () => {
    render(<EditVideoLyricsModal {...defaultProps} video={null} />);

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('should display modal header', () => {
    render(<EditVideoLyricsModal {...defaultProps} />);

    expect(screen.getByText('Editar Video con Lyrics')).toBeInTheDocument();
  });

  it('should populate form with video data', () => {
    render(<EditVideoLyricsModal {...defaultProps} />);

    expect(screen.getByLabelText('Título (opcional)')).toHaveValue(
      'Test Video',
    );
    expect(screen.getByLabelText('Descripción (opcional)')).toHaveValue(
      'Test description',
    );
    expect(screen.getByLabelText('Prioridad')).toHaveValue('5');
  });

  it('should render cancel and save buttons', () => {
    render(<EditVideoLyricsModal {...defaultProps} />);

    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Guardar Cambios')).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', () => {
    render(<EditVideoLyricsModal {...defaultProps} />);

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onSave when form is submitted', () => {
    render(<EditVideoLyricsModal {...defaultProps} />);

    const form = screen.getByTestId('modal').querySelector('form');
    fireEvent.submit(form!);

    expect(mockOnSave).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({
        title: 'Test Video',
        videoType: 'instrumental',
        description: 'Test description',
        priority: 5,
        usesVideoLyrics: true,
      }),
    );
  });

  it('should show checkbox for usesVideoLyrics', () => {
    render(<EditVideoLyricsModal {...defaultProps} />);

    expect(screen.getByText('Usar lyrics del video')).toBeInTheDocument();
  });

  it('should handle empty title correctly', () => {
    const videoWithoutTitle = { ...mockVideo, title: '' };
    render(
      <EditVideoLyricsModal {...defaultProps} video={videoWithoutTitle} />,
    );

    expect(screen.getByLabelText('Título (opcional)')).toHaveValue('');
  });

  it('should handle empty description correctly', () => {
    const videoWithoutDescription = { ...mockVideo, description: '' };
    render(
      <EditVideoLyricsModal
        {...defaultProps}
        video={videoWithoutDescription}
      />,
    );

    expect(screen.getByLabelText('Descripción (opcional)')).toHaveValue('');
  });
});
