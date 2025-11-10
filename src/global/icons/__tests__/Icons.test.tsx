import React from 'react';
import { render } from '@testing-library/react';
import { ArrowLeftIcon } from '../ArrowLeftIcon';
import { CloseIcon } from '../CloseIcon';
import { ArrowRightIcon } from '../ArrowRightIcon';
import { ArrowUpIcon } from '../ArrowUpIcon';
import { ArrowDownIcon } from '../ArrowDownIcon';
import { PlayIcon } from '../PlayIcon';
import { PauseIcon } from '../PauseIcon';
import { MailIcon } from '../MailIcon';
import { PhoneIcon } from '../PhoneIcon';
import { EditIcon } from '../EditIcon';
import { CopyIcon } from '../CopyIcon';
import { MenuButtonIcon } from '../MenuButtonIcon';
import { KeyIcon } from '../KeyIcon';
import { UsersIcon } from '../UsersIcon';
import { MusicNoteIcon } from '../MusicNoteIcon';
import { CalendarIcon } from '../CalendarIcon';

describe('Icon Components', () => {
  describe('ArrowLeftIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<ArrowLeftIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should accept custom className', () => {
      const { container } = render(<ArrowLeftIcon className="custom-class" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('custom-class');
    });

    it('should have correct ARIA attributes', () => {
      const { container } = render(<ArrowLeftIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(svg).toHaveAttribute('role', 'presentation');
      expect(svg).toHaveAttribute('focusable', 'false');
    });

    it('should accept custom width and height', () => {
      const { container } = render(<ArrowLeftIcon width="2em" height="2em" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '2em');
      expect(svg).toHaveAttribute('height', '2em');
    });
  });

  describe('CloseIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<CloseIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should accept custom className', () => {
      const { container } = render(<CloseIcon className="close-btn" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('close-btn');
    });

    it('should have correct viewBox', () => {
      const { container } = render(<CloseIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });
  });

  describe('ArrowRightIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<ArrowRightIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should accept custom props', () => {
      const { container } = render(
        <ArrowRightIcon data-testid="arrow-right" />,
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('data-testid', 'arrow-right');
    });
  });

  describe('ArrowUpIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<ArrowUpIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('ArrowDownIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<ArrowDownIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('PlayIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<PlayIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('PauseIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<PauseIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('MailIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<MailIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('PhoneIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<PhoneIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('EditIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<EditIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('CopyIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<CopyIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('MenuButtonIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<MenuButtonIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('KeyIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<KeyIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('UsersIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<UsersIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should have proper ARIA attributes for accessibility', () => {
      const { container } = render(<UsersIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(svg).toHaveAttribute('role', 'presentation');
      expect(svg).toHaveAttribute('focusable', 'false');
    });

    it('should have viewBox for responsive scaling', () => {
      const { container } = render(<UsersIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('should accept custom className for sizing', () => {
      const { container } = render(<UsersIcon className="h-5 w-5" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-5', 'w-5');
    });
  });

  describe('MusicNoteIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<MusicNoteIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should have viewBox for responsive scaling', () => {
      const { container } = render(<MusicNoteIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });
  });

  describe('CalendarIcon', () => {
    it('should render without crashing', () => {
      const { container } = render(<CalendarIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should have viewBox for responsive scaling', () => {
      const { container } = render(<CalendarIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });
  });
});
