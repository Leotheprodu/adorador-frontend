import React from 'react';
import { render } from '@testing-library/react';
import { AddSongIcon } from '../AddSongIcon';
import { BackwardIcon } from '../BackwardIcon';
import { ForwardIcon } from '../ForwardIcon';
import { ChurchIcon } from '../ChurchIcon';
import { DeleteMusicIcon } from '../DeleteMusicIcon';
import { EyeFilledIcon } from '../EyeFilledIcon';
import { EyeSlashFilledIcon } from '../EyeSlashFilledIcon';
import { FullscreenIcon } from '../FullScreenIcon';
import { GuitarIcon } from '../GuitarIcon';
import { PrintIcon } from '../PrintIcon';
import { UnpluggedIcon } from '../UnpluggedIcon';
import { UpdateIcon } from '../UpdateIcon';
import { VolumeDownIcon } from '../VolumeDownIcon';
import { VolumeOffIcon } from '../VolumeOffIcon';
import { VolumeUpIcon } from '../VolumeUpIcon';
import { ArrowsUpDownIconIcon } from '../ArrowsUpDownIcon';

describe('Additional Icon Components', () => {
  describe('AddSongIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<AddSongIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should accept custom props', () => {
      const { container } = render(<AddSongIcon className="custom" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('custom');
    });
  });

  describe('BackwardIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<BackwardIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should have correct ARIA attributes', () => {
      const { container } = render(<BackwardIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(svg).toHaveAttribute('role', 'presentation');
    });
  });

  describe('ForwardIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<ForwardIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('ChurchIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<ChurchIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should accept custom width and height', () => {
      const { container } = render(<ChurchIcon width="3em" height="3em" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '3em');
      expect(svg).toHaveAttribute('height', '3em');
    });
  });

  describe('DeleteMusicIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<DeleteMusicIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('EyeFilledIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<EyeFilledIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('EyeSlashFilledIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<EyeSlashFilledIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('FullscreenIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<FullscreenIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('GuitarIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<GuitarIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should have default width and height attributes', () => {
      const { container } = render(<GuitarIcon />);
      const svg = container.querySelector('svg');
      // El SVG tiene width/height de 1em por defecto
      expect(svg).toHaveAttribute('width', '1em');
      expect(svg).toHaveAttribute('height', '1em');
    });

    it('should have viewBox for proper scaling', () => {
      const { container } = render(<GuitarIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('should accept custom className for sizing', () => {
      const { container } = render(<GuitarIcon className="h-7 w-7" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-7', 'w-7');
    });
  });

  describe('PrintIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<PrintIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('UnpluggedIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<UnpluggedIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('UpdateIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<UpdateIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('VolumeDownIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<VolumeDownIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('VolumeOffIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<VolumeOffIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('VolumeUpIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<VolumeUpIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('ArrowsUpDownIconIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<ArrowsUpDownIconIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should accept custom className', () => {
      const { container } = render(
        <ArrowsUpDownIconIcon className="sort-icon" />,
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('sort-icon');
    });
  });

  // Group test for all icons with custom props
  describe('All icons with custom props', () => {
    const icons = [
      { Component: AddSongIcon, name: 'AddSongIcon' },
      { Component: BackwardIcon, name: 'BackwardIcon' },
      { Component: ForwardIcon, name: 'ForwardIcon' },
      { Component: ChurchIcon, name: 'ChurchIcon' },
      { Component: DeleteMusicIcon, name: 'DeleteMusicIcon' },
      { Component: EyeFilledIcon, name: 'EyeFilledIcon' },
      { Component: EyeSlashFilledIcon, name: 'EyeSlashFilledIcon' },
      { Component: FullscreenIcon, name: 'FullscreenIcon' },
      { Component: GuitarIcon, name: 'GuitarIcon' },
      { Component: PrintIcon, name: 'PrintIcon' },
      { Component: UnpluggedIcon, name: 'UnpluggedIcon' },
      { Component: UpdateIcon, name: 'UpdateIcon' },
      { Component: VolumeDownIcon, name: 'VolumeDownIcon' },
      { Component: VolumeOffIcon, name: 'VolumeOffIcon' },
      { Component: VolumeUpIcon, name: 'VolumeUpIcon' },
      { Component: ArrowsUpDownIconIcon, name: 'ArrowsUpDownIconIcon' },
    ];

    it.each(icons)(
      'should render $name with custom data attribute',
      ({ Component }) => {
        const { container } = render(<Component data-testid="test-icon" />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('data-testid', 'test-icon');
      },
    );
  });
});
