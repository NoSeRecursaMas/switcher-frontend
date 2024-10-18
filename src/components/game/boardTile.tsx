import { Button, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { Color } from '../../types/gameTypes';
import { ExtendedTile } from '../../types/gameTypes';
import { useGameTile } from '../../hooks/useGameTile';

const breathingKeyframes = keyframes`
  0% { box-shadow: none; }
  20% { box-shadow: 0 0 4px 1px currentColor; }
  40% { box-shadow: 0 0 8px 2px currentColor; }
  60% { box-shadow: 0 0 8px 2px currentColor; }
  80% { box-shadow: 0 0 4px 1px currentColor; }
  100% { box-shadow: none; }
`;

const colorScheme = (color: Color | undefined) => {
  switch (color) {
    case Color.Y:
      return 'yellow';
    case Color.R:
      return 'red';
    case Color.B:
      return 'blue';
    case Color.G:
      return 'green';
    default:
      return 'gray';
  }
};

export default function BoardTile({ tile }: { tile: ExtendedTile }) {
  const { posX, posY, color, isHighlighted, isPartial } = tile;
  const { markTopBorder, markRightBorder, markBottomBorder, markLeftBorder } =
    tile;
  const { handleClickTile, selectedTile } = useGameTile();
  const isSelected =
    selectedTile && selectedTile.posX === posX && selectedTile.posY === posY;

  const isNotImportant = selectedTile && !isHighlighted && !isSelected;

  return (
    <Button
      onClick={() => handleClickTile(posX, posY)}
      backgroundSize="cover"
      colorScheme={colorScheme(color)}
      variant="outline"
      width="100%"
      height="100%"
      borderRadius="22%"
      bg="color-mix(in srgb, currentColor 5%, transparent)"
      // Modo claro
      //border = "3px solid currentColor"
      _before={{
        content: '""',
        position: 'absolute',
        height: '111%',
        width: '111%',
        borderTop: markTopBorder
          ? '2px solid currentColor'
          : '2px solid transparent',
        borderRight: markRightBorder
          ? '2px solid currentColor'
          : '2px solid transparent',
        borderBottom: markBottomBorder
          ? '2px solid currentColor'
          : '2px solid transparent',
        borderLeft: markLeftBorder
          ? '2px solid currentColor'
          : '2px solid transparent',
        borderTopLeftRadius: markLeftBorder && markTopBorder ? '20px' : '0',
        borderTopRightRadius: markRightBorder && markTopBorder ? '20px' : '0',
        borderBottomRightRadius:
          markRightBorder && markBottomBorder ? '20px' : '0',
        borderBottomLeftRadius:
          markLeftBorder && markBottomBorder ? '20px' : '0',
      }}
      _after={{
        content: '""',
        position: 'absolute',
        top: '5px',
        right: '5px',
        borderTop: '1px solid currentColor',
        borderRight: '1px solid currentColor',
        borderRadius: '0 60% 0 0',
        height: '25%',
        width: '25%',
      }}
      _hover={{
        transform: 'scale(1.1)',
      }}
      isActive={isSelected}
      transform={isSelected ? 'scale(1.1)' : ''}
      filter={isNotImportant ? 'brightness(0.5)' : ''}
      animation={
        isHighlighted ? `${breathingKeyframes} 1s ease-in-out infinite` : ''
      }
    >
      <Text fontSize="2xl" fontWeight="bold">
        {isPartial ? 'P' : '\u00A0'}
      </Text>
    </Button>
  );
}
