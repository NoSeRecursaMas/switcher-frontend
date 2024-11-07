import Countdown from 'react-countdown';
import { Box } from '@chakra-ui/react';

const TURN_DURATION = 120000; // 2 minutos en milisegundos

interface CountdownProps {
  timestamp: number; // Timestamp del inicio del turno (en milisegundos desde la época UNIX)
}

export default function CountdownComponent({ timestamp }: CountdownProps) {
  // Calcula el tiempo de finalización basado en el timestamp del inicio del turno
  const targetTime = timestamp + TURN_DURATION;

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
