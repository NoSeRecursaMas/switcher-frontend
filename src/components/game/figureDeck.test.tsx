import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FigureDeck from './figureDeck';
import { useGame } from '../../hooks/useGame';
import { Figure, FigureCard } from '../../types/gameTypes';
import { render } from '../../services/testUtils';

vi.mock('../../hooks/useGame');

describe('RenderFigureCard', () => {
  const mockHandleClickCard = vi.fn();
  const mockSelectedCard = { cardID: 1, type: Figure.fig01 };

  beforeEach(() => {
    vi.resetAllMocks();
    (useGame as Mock).mockReturnValue({
      handleClickCard: mockHandleClickCard,
      selectedCard: mockSelectedCard,
    });
  });

  afterEach(() => {
    cleanup();
  });

  const mockCards: FigureCard[] = [
    { cardID: 1, type: Figure.fig01, isBlocked: false },
    { cardID: 2, type: Figure.fig02, isBlocked: true },
  ];

  it('renders without crashing', () => {
    render(<FigureDeck figures={mockCards} vertical={true} />);
    expect(screen.getAllByRole('button')).toHaveLength(mockCards.length);
  });

  it('calls handleClickCard when a card is clicked', async () => {
    const user = userEvent.setup();
    render(<FigureDeck figures={mockCards} vertical={true} />);
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    expect(mockHandleClickCard).toHaveBeenCalledWith(mockCards[0]);
  });

  it('applies correct styles for selected and blocked cards', () => {
    render(<FigureDeck figures={mockCards} vertical={true} />);
    const buttons = screen.getAllByRole('button');

    // Check styles for the first card (selected)
    expect(buttons[0]).toHaveStyle('transform: scale(1.1)');
    expect(buttons[0]).not.toHaveStyle('filter: brightness(0.5)');

    // Check styles for the second card (blocked)
    expect(buttons[1]).toHaveStyle('filter: brightness(0.5)');
  });

  it('Apply correct style on hover', async () => {
    const user = userEvent.setup();

    render(<FigureDeck figures={mockCards} vertical={true} />);
    const buttons = screen.getAllByRole('button');

    // Hover on the first card
    await user.hover(buttons[0]);
    expect(buttons[0]).toHaveStyle('transform: scale(1.1)');
  });

  it('Render in vertical mode', () => {
    render(<FigureDeck figures={mockCards} vertical={true} />);
    expect(screen.getByLabelText('Figure deck vertical')).toBeInTheDocument();
  });

  it('Render in horizontal mode', () => {
    render(<FigureDeck figures={mockCards} vertical={false} />);
    expect(screen.getByLabelText('Figure deck horizontal')).toBeInTheDocument();
  });
});
