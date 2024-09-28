import { useParams } from "react-router-dom";
import {
  Skeleton,
  Text,
  VStack,
  HStack,
  Heading,
  Card,
  Center,
  Button,
  Tooltip,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { useUser } from "../context/user-context";

export default function Room() {
  const { roomID } = useParams<{ roomID: string }>();
  const { user } = useUser();

  const room = undefined; // Harcodeado
  const isRoomDataLoaded = 2 + 2 < 3; // Harcodeado

  return (
    <>
      <Center h="100vh">
        <VStack>
          <Skeleton isLoaded={isRoomDataLoaded}>
            <Heading size="3xl" as="b">
              {isRoomDataLoaded ? "Sala sin nombre" : "Sala sin nombre"}
            </Heading>
          </Skeleton>
          <Skeleton isLoaded={isRoomDataLoaded}>
            <Text fontSize="lg" as="i">
              Mínimo de jugadores: {isRoomDataLoaded ? room?.minPlayers : 0}-
              Máximo de jugadores: {isRoomDataLoaded ? room?.maxPlayers : 0}
            </Text>
          </Skeleton>

          <VStack p={2} w="lg">
            {room?.players.map((player) => (
              <Card key={player.id} w="100%" m={1} p={2}>
                <HStack justifyContent="space-between">
                  <Text fontSize="lg">{player.username}</Text>
                  {player.id === room?.creator_id && (
                    <Tooltip label="Creador de la sala">
                      {/* Cambiar la posición del icono porque se ve mal tan lejos del nombre */}
                      <StarIcon color="yellow.500" />
                    </Tooltip>
                  )}
                </HStack>
              </Card>
            ))}
          </VStack>

          <HStack justifyContent="space-between" mt={4} spacing={4}>
            {room?.creator_id !== user?.id ? (
              <Button colorScheme="red">Abandonar sala</Button>
            ) : (
              <Tooltip label="No puedes abandonar la sala si eres el creador">
                <Button colorScheme="red" disabled>
                  Abandonar sala
                </Button>
              </Tooltip>
            )}
            {room?.minPlayers <= room?.players.length ? (
              <Button colorScheme="teal">Iniciar partida</Button>
            ) : (
              <Tooltip label="Esperando a que se unan más jugadores">
                <Button colorScheme="teal" isDisabled>
                  Iniciar partida
                </Button>
              </Tooltip>
            )}
          </HStack>
        </VStack>
      </Center>
    </>
  );
}
