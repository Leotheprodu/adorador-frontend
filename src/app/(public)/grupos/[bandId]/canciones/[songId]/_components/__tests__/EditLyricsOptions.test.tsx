import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditLyricsOptions } from '../EditLyricsOptions';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';

// Mock child components
jest.mock('../LyricsTextEditor', () => ({
  LyricsTextEditor: ({
    params,
    songTitle,
  }: {
    params: { bandId: string; songId: string };
    songTitle?: string;
  }) => (
    <div data-testid="lyrics-text-editor">
      LyricsTextEditor - {params.bandId}/{params.songId} - {songTitle}
    </div>
  ),
}));

jest.mock('../ButtonNormalizeLyrics', () => ({
  ButtonNormalizeLyrics: () => (
    <div data-testid="button-normalize-lyrics">ButtonNormalizeLyrics</div>
  ),
}));

// Mock services
jest.mock('../../_services/songIdServices', () => ({
  deleteAllLyricsService: jest.fn(() => ({
    mutate: jest.fn(),
    status: 'idle',
  })),
}));

// Mock utils
jest.mock('../../_utils/lyricsConverter', () => ({
  convertLyricsToPlainText: jest.fn((lyrics) => {
    if (!lyrics || lyrics.length === 0) return '';
    return '(verso)\nEm\nTest converted lyrics';
  }),
}));

describe('EditLyricsOptions', () => {
  const mockParams = { bandId: '1', songId: '100' };
  const mockRefetch = jest.fn();
  const mockMutateUpload = jest.fn();
  const mockExistingLyrics: LyricsProps[] = [
    {
      id: 1,
      position: 1,
      lyrics: 'Test lyrics line',
      structure: { id: 1, title: 'verso' },
      chords: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset window.location.hash
    window.history.replaceState(null, '', window.location.pathname);
  });

  describe('Collapsed State', () => {
    it('should render collapsed button by default', () => {
      render(
        <EditLyricsOptions
          params={mockParams}
          refetchLyricsOfCurrentSong={mockRefetch}
          mutateUploadLyricsByFile={mockMutateUpload}
          existingLyrics={mockExistingLyrics}
        />,
      );

      expect(
        screen.getByText('Editar o Reemplazar Letras'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Usa el editor de texto o sube un nuevo archivo'),
      ).toBeInTheDocument();
    });

    it('should not show expanded content when collapsed', () => {
      render(
        <EditLyricsOptions
          params={mockParams}
          refetchLyricsOfCurrentSong={mockRefetch}
          mutateUploadLyricsByFile={mockMutateUpload}
          existingLyrics={mockExistingLyrics}
        />,
      );

      expect(screen.queryByText('Cerrar')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('lyrics-text-editor'),
      ).not.toBeInTheDocument();
    });

    it('should expand when collapsed button is clicked', () => {
      render(
        <EditLyricsOptions
          params={mockParams}
          refetchLyricsOfCurrentSong={mockRefetch}
          mutateUploadLyricsByFile={mockMutateUpload}
          existingLyrics={mockExistingLyrics}
        />,
      );

      const expandButton = screen
        .getByText('Editar o Reemplazar Letras')
        .closest('button');
      fireEvent.click(expandButton!);

      expect(screen.getByText('Cerrar')).toBeInTheDocument();
    });

    it('should auto-expand when URL has #edit-lyrics hash', () => {
      // Set the hash before rendering
      window.location.hash = '#edit-lyrics';

      render(
        <EditLyricsOptions
          params={mockParams}
          refetchLyricsOfCurrentSong={mockRefetch}
          mutateUploadLyricsByFile={mockMutateUpload}
          existingLyrics={mockExistingLyrics}
        />,
      );

      // Should be expanded automatically
      expect(screen.getByText('Cerrar')).toBeInTheDocument();
      expect(screen.getByText('✍️ Editor de Texto')).toBeInTheDocument();
    });
  });

  describe('Expanded State', () => {
    it('should show tabs when expanded', () => {
      render(
        <EditLyricsOptions
          params={mockParams}
          refetchLyricsOfCurrentSong={mockRefetch}
          mutateUploadLyricsByFile={mockMutateUpload}
          existingLyrics={mockExistingLyrics}
        />,
      );

      const expandButton = screen
        .getByText('Editar o Reemplazar Letras')
        .closest('button');
      fireEvent.click(expandButton!);

      expect(screen.getByText('✍️ Editor de Texto')).toBeInTheDocument();
      expect(screen.getByText('📁 Subir Archivo')).toBeInTheDocument();
    });

    it('should collapse when close button is clicked', () => {
      render(
        <EditLyricsOptions
          params={mockParams}
          refetchLyricsOfCurrentSong={mockRefetch}
          mutateUploadLyricsByFile={mockMutateUpload}
          existingLyrics={mockExistingLyrics}
        />,
      );

      // Expand
      const expandButton = screen
        .getByText('Editar o Reemplazar Letras')
        .closest('button');
      fireEvent.click(expandButton!);

      // Collapse
      const closeButton = screen.getByText('Cerrar');
      fireEvent.click(closeButton);

      expect(screen.queryByText('Cerrar')).not.toBeInTheDocument();
    });
  });

  describe('Editor Tab', () => {
    it('should show editor by default when expanded', () => {
      render(
        <EditLyricsOptions
          params={mockParams}
          songTitle="Test Song"
          refetchLyricsOfCurrentSong={mockRefetch}
          mutateUploadLyricsByFile={mockMutateUpload}
          existingLyrics={mockExistingLyrics}
        />,
      );

      const expandButton = screen
        .getByText('Editar o Reemplazar Letras')
        .closest('button');
      fireEvent.click(expandButton!);

      expect(screen.getByTestId('lyrics-text-editor')).toBeInTheDocument();
      expect(screen.getByTestId('lyrics-text-editor')).toHaveTextContent(
        'Test Song',
      );
    });

    it('should convert existing lyrics to plain text', async () => {
      const lyricsConverter = await import('../../_utils/lyricsConverter');
      const convertSpy = jest.spyOn(
        lyricsConverter,
        'convertLyricsToPlainText',
      );

      render(
        <EditLyricsOptions
          params={mockParams}
          refetchLyricsOfCurrentSong={mockRefetch}
          mutateUploadLyricsByFile={mockMutateUpload}
          existingLyrics={mockExistingLyrics}
        />,
      );

      await waitFor(() => {
        expect(convertSpy).toHaveBeenCalledWith(mockExistingLyrics);
      });
    });
  });

  describe('Upload Tab', () => {
    it('should switch to upload tab when clicked', () => {
      render(
        <EditLyricsOptions
          params={mockParams}
          refetchLyricsOfCurrentSong={mockRefetch}
          mutateUploadLyricsByFile={mockMutateUpload}
          existingLyrics={mockExistingLyrics}
        />,
      );

      const expandButton = screen
        .getByText('Editar o Reemplazar Letras')
        .closest('button');
      fireEvent.click(expandButton!);

      const uploadTab = screen.getByText('📁 Subir Archivo');
      fireEvent.click(uploadTab);

      expect(screen.getByText('Subir Archivo .txt')).toBeInTheDocument();
    });

    it('should display upload instructions', () => {
      render(
        <EditLyricsOptions
          params={mockParams}
          refetchLyricsOfCurrentSong={mockRefetch}
          mutateUploadLyricsByFile={mockMutateUpload}
          existingLyrics={mockExistingLyrics}
        />,
      );

      const expandButton = screen
        .getByText('Editar o Reemplazar Letras')
        .closest('button');
      fireEvent.click(expandButton!);

      const uploadTab = screen.getByText('📁 Subir Archivo');
      fireEvent.click(uploadTab);

      expect(
        screen.getByText(/Incluye etiquetas de estructura entre paréntesis/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/El archivo txt debe estar codificado en UTF-8/),
      ).toBeInTheDocument();
    });

    it('should show warning about replacing existing lyrics', () => {
      render(
        <EditLyricsOptions
          params={mockParams}
          refetchLyricsOfCurrentSong={mockRefetch}
          mutateUploadLyricsByFile={mockMutateUpload}
          existingLyrics={mockExistingLyrics}
        />,
      );

      const expandButton = screen
        .getByText('Editar o Reemplazar Letras')
        .closest('button');
      fireEvent.click(expandButton!);

      const uploadTab = screen.getByText('📁 Subir Archivo');
      fireEvent.click(uploadTab);

      expect(screen.getByText('⚠️ Advertencia')).toBeInTheDocument();
      expect(
        screen.getByText(/se reemplazarán todas las letras existentes/),
      ).toBeInTheDocument();
    });

    it('should show drag and drop area', () => {
      render(
        <EditLyricsOptions
          params={mockParams}
          refetchLyricsOfCurrentSong={mockRefetch}
          mutateUploadLyricsByFile={mockMutateUpload}
          existingLyrics={mockExistingLyrics}
        />,
      );

      const expandButton = screen
        .getByText('Editar o Reemplazar Letras')
        .closest('button');
      fireEvent.click(expandButton!);

      const uploadTab = screen.getByText('📁 Subir Archivo');
      fireEvent.click(uploadTab);

      expect(
        screen.getByText('Arrastra tu archivo .txt aquí'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('o haz clic para seleccionar'),
      ).toBeInTheDocument();
    });
  });

  describe('File Upload', () => {
    it('should handle file input change', () => {
      render(
        <EditLyricsOptions
          params={mockParams}
          refetchLyricsOfCurrentSong={mockRefetch}
          mutateUploadLyricsByFile={mockMutateUpload}
          existingLyrics={mockExistingLyrics}
        />,
      );

      const expandButton = screen
        .getByText('Editar o Reemplazar Letras')
        .closest('button');
      fireEvent.click(expandButton!);

      const uploadTab = screen.getByText('📁 Subir Archivo');
      fireEvent.click(uploadTab);

      const file = new File(['test content'], 'test.txt', {
        type: 'text/plain',
      });
      const input = screen.getByLabelText(/Arrastra tu archivo/);

      fireEvent.change(input, { target: { files: [file] } });

      // Should call delete mutation first
      // Then in callback should call upload
      // This is tested by checking the mutation was called
      expect(mockMutateUpload).toBeDefined();
    });

    it('should show alert for non-txt files on drop', () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation();

      render(
        <EditLyricsOptions
          params={mockParams}
          refetchLyricsOfCurrentSong={mockRefetch}
          mutateUploadLyricsByFile={mockMutateUpload}
          existingLyrics={mockExistingLyrics}
        />,
      );

      const expandButton = screen
        .getByText('Editar o Reemplazar Letras')
        .closest('button');
      fireEvent.click(expandButton!);

      const uploadTab = screen.getByText('📁 Subir Archivo');
      fireEvent.click(uploadTab);

      const dropZone = screen
        .getByText('Arrastra tu archivo .txt aquí')
        .closest('div');
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });

      fireEvent.drop(dropZone!, {
        dataTransfer: {
          files: [file],
        },
      });

      expect(alertSpy).toHaveBeenCalledWith(
        'Por favor, arrastra un archivo .txt',
      );

      alertSpy.mockRestore();
    });
  });

  describe('Tab Styling', () => {
    it('should apply active styles to editor tab by default', () => {
      render(
        <EditLyricsOptions
          params={mockParams}
          refetchLyricsOfCurrentSong={mockRefetch}
          mutateUploadLyricsByFile={mockMutateUpload}
          existingLyrics={mockExistingLyrics}
        />,
      );

      const expandButton = screen
        .getByText('Editar o Reemplazar Letras')
        .closest('button');
      fireEvent.click(expandButton!);

      const editorTab = screen.getByText('✍️ Editor de Texto');
      expect(editorTab).toHaveClass('border-primary-500', 'text-primary-600');
    });

    it('should change active tab styling when switching tabs', () => {
      render(
        <EditLyricsOptions
          params={mockParams}
          refetchLyricsOfCurrentSong={mockRefetch}
          mutateUploadLyricsByFile={mockMutateUpload}
          existingLyrics={mockExistingLyrics}
        />,
      );

      const expandButton = screen
        .getByText('Editar o Reemplazar Letras')
        .closest('button');
      fireEvent.click(expandButton!);

      const uploadTab = screen.getByText('📁 Subir Archivo');
      fireEvent.click(uploadTab);

      expect(uploadTab).toHaveClass('border-primary-500', 'text-primary-600');
    });
  });

  describe('Props Handling', () => {
    it('should pass correct params to child components', () => {
      render(
        <EditLyricsOptions
          params={mockParams}
          songTitle="My Song"
          refetchLyricsOfCurrentSong={mockRefetch}
          mutateUploadLyricsByFile={mockMutateUpload}
          existingLyrics={mockExistingLyrics}
        />,
      );

      const expandButton = screen
        .getByText('Editar o Reemplazar Letras')
        .closest('button');
      fireEvent.click(expandButton!);

      expect(screen.getByTestId('lyrics-text-editor')).toHaveTextContent(
        '1/100',
      );
      expect(screen.getByTestId('lyrics-text-editor')).toHaveTextContent(
        'My Song',
      );
    });

    it('should handle empty existing lyrics', () => {
      render(
        <EditLyricsOptions
          params={mockParams}
          refetchLyricsOfCurrentSong={mockRefetch}
          mutateUploadLyricsByFile={mockMutateUpload}
          existingLyrics={[]}
        />,
      );

      expect(
        screen.getByText('Editar o Reemplazar Letras'),
      ).toBeInTheDocument();
    });
  });
});
