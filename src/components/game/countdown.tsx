import Countdown from 'react-countdown';
import { useGame } from '../../hooks/useGame';
import { Box } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

const TURN_DURATION = 120000; // 2 minutos en milisegundos

export default function CountdownComponent() {
  const { endTurn, currentPlayer, posEnabledToPlay } = useGame();
  const [targetTime, setTargetTime] = useState<number | null>(null);

  useEffect(() => {
    // Verifica si existe una hora de finalización del turno en localStorage
    const savedTargetTime = localStorage.getItem('targetTime');

    if (savedTargetTime) {
      setTargetTime(Number(savedTargetTime));
    } else {
      startNewTurn();
    }
  }, []);

  // Función para comenzar un nuevo turno y establecer la hora de finalización
  const startNewTurn = () => {
    const newTargetTime = Date.now() + TURN_DURATION;
    localStorage.setItem('targetTime', newTargetTime.toString());
    setTargetTime(newTargetTime);
  };

  // Llama a endTurn y comienza un nuevo turno cuando el temporizador se completa
  const handleComplete = async () => {
    if (posEnabledToPlay === currentPlayer?.position) {
      await endTurn();
      startNewTurn();
    }
  };

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

  return targetTime ? (
    <Countdown
      date={targetTime}
      onComplete={handleComplete}
      renderer={renderer}
    />
  ) : null;
}
