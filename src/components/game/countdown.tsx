import Countdown from 'react-countdown';
import { Box } from '@chakra-ui/react';

interface CountdownProps {
  remainingSeconds: number; // Cantidad de segundos restantes al comienzo del turno
}

export default function CountdownComponent({
  remainingSeconds,
}: CountdownProps) {
  // Calcula el tiempo de finalización basado en los segundos restantes
  const targetTime = Date.now() + remainingSeconds * 1000;

  // Renderizador personalizado para mostrar minutos y segundos en formato "mm:ss"
  const renderer = ({
    minutes,
    seconds,
  }: {
    minutes: number;
    seconds: number;
  }) => (
    <Box fontSize="2xl" fontWeight="bold">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </Box>
  );

  return <Countdown date={targetTime} renderer={renderer} />;
}
