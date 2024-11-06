import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import ProhibitedColor from './prohibitedColor';
import { Color } from '../../types/gameTypes';
import { ChakraProvider, theme } from '@chakra-ui/react';

const renderWithChakra = (ui: React.ReactNode) => {
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe('ProhibitedColor component', () => {
  it('renders with yellow color', () => {
    const { container } = renderWithChakra(<ProhibitedColor color={Color.Y} />);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle(
      `background-color: ${theme.colors.yellow[300]}`
    );
  });

  it('renders with red color', () => {
    const { container } = renderWithChakra(<ProhibitedColor color={Color.R} />);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle(`background-color: ${theme.colors.red[300]}`);
  });

  it('renders with blue color', () => {
    const { container } = renderWithChakra(<ProhibitedColor color={Color.B} />);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle(`background-color: ${theme.colors.blue[300]}`);
  });

  it('renders with green color', () => {
    const { container } = renderWithChakra(<ProhibitedColor color={Color.G} />);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle(`background-color: ${theme.colors.green[300]}`);
  });

  it('renders with gray color when color is undefined', () => {
    const { container } = renderWithChakra(
      <ProhibitedColor color={undefined} />
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle(`background-color: ${theme.colors.gray[200]}`);
  });
});
