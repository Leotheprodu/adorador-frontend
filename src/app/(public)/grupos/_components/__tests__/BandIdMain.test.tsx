import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { BandIdMain } from '../BandIdMain';
import { getBandById } from '@bands/_services/bandsService';

jest.mock('@bands/_services/bandsService');
jest.mock('../SongsSection', () => ({
  SongsSection: () => <div data-testid="songs-section">Songs Section</div>,
}));
jest.mock('../EventsSection', () => ({
  EventsSection: () => <div data-testid="events-section">Events Section</div>,
}));
jest.mock('@app/(public)/grupos/[bandId]/_components/BandMembers', () => ({
  BandMembers: () => <div data-testid="band-members">Band Members</div>,
}));
jest.mock('@global/utils/UIGuard', () => ({
  UIGuard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="ui-guard">{children}</div>
  ),
}));

describe('BandIdMain - Responsive Layout', () => {
  function renderWithQueryClient(ui: React.ReactElement) {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    );
  }
  beforeEach(() => {
    jest.clearAllMocks();
    (getBandById as jest.Mock).mockReturnValue({
      data: { id: 1, name: 'Test Band' },
      isLoading: false,
    });
  });

  it('should render without crashing', () => {
    renderWithQueryClient(<BandIdMain bandId="1" />);
    expect(screen.getByTestId('ui-guard')).toBeInTheDocument();
  });

  it('should have GuitarIcon with proper responsive classes', () => {
    const { container } = renderWithQueryClient(<BandIdMain bandId="1" />);

    // Verificar que el contenedor del icono tiene flex-shrink-0
    const iconContainer = container.querySelector('.flex.h-14.w-14');
    expect(iconContainer).toHaveClass('flex-shrink-0');

    // Verificar que el icono SVG tiene las clases correctas
    const guitarIcon = container.querySelector('svg');
    expect(guitarIcon).toHaveClass('h-7', 'w-7', 'flex-shrink-0');
  });

  it('should have proper spacing and layout classes', () => {
    const { container } = renderWithQueryClient(<BandIdMain bandId="1" />);

    // Verificar el contenedor principal tiene space-y-6
    const mainContainer = container.querySelector('.space-y-6');
    expect(mainContainer).toBeInTheDocument();
  });

  it('should render all sections', () => {
    renderWithQueryClient(<BandIdMain bandId="1" />);

    expect(screen.getByTestId('band-members')).toBeInTheDocument();
    expect(screen.getByTestId('songs-section')).toBeInTheDocument();
    expect(screen.getByTestId('events-section')).toBeInTheDocument();
  });

  it('should display band name', () => {
    renderWithQueryClient(<BandIdMain bandId="1" />);
    expect(screen.getByText('Test Band')).toBeInTheDocument();
  });
});
