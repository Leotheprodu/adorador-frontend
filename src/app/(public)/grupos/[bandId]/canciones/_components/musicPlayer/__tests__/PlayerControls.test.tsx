import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { PlayerControls } from '../PlayerControls';

describe('PlayerControls', () => {
    const defaultProps = {
        playing: false,
        hasSelectedBeat: true,
        hasMultipleSongs: true,
        onPlayPause: jest.fn(),
        onNext: jest.fn(),
        onPrev: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('renderiza el botón de play cuando no está reproduciendo', () => {
        render(<PlayerControls {...defaultProps} />);

        const playButton = screen.getByRole('button', { name: 'Reproducir' });
        expect(playButton).toBeInTheDocument();
    });

    it('renderiza el botón de pause cuando está reproduciendo', () => {
        render(<PlayerControls {...defaultProps} playing={true} />);

        const pauseButton = screen.getByRole('button', { name: 'Pausar' });
        expect(pauseButton).toBeInTheDocument();
    });

    it('muestra botones de navegación cuando hay múltiples canciones', () => {
        render(<PlayerControls {...defaultProps} />);

        expect(screen.getByRole('button', { name: 'Anterior' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reproducir' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Siguiente' })).toBeInTheDocument();
    });

    it('oculta botones de navegación cuando hay una sola canción', () => {
        render(<PlayerControls {...defaultProps} hasMultipleSongs={false} />);

        expect(screen.queryByRole('button', { name: 'Anterior' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Siguiente' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reproducir' })).toBeInTheDocument();
    });

    it('llama onPlayPause al hacer clic en play/pause', () => {
        const onPlayPause = jest.fn();
        render(<PlayerControls {...defaultProps} onPlayPause={onPlayPause} />);

        const playButton = screen.getByRole('button', { name: 'Reproducir' });
        fireEvent.click(playButton);

        expect(onPlayPause).toHaveBeenCalledTimes(1);
    });

    it('llama onNext al hacer clic en siguiente', () => {
        const onNext = jest.fn();
        render(<PlayerControls {...defaultProps} onNext={onNext} />);

        const nextButton = screen.getByRole('button', { name: 'Siguiente' });
        fireEvent.click(nextButton);

        expect(onNext).toHaveBeenCalledTimes(1);
    });

    it('llama onPrev al hacer clic en anterior', () => {
        const onPrev = jest.fn();
        render(<PlayerControls {...defaultProps} onPrev={onPrev} />);

        const prevButton = screen.getByRole('button', { name: 'Anterior' });
        fireEvent.click(prevButton);

        expect(onPrev).toHaveBeenCalledTimes(1);
    });
});
