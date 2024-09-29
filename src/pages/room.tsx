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
import { useRoom } from "../context/room-context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendToast } from "../services/utils";
import useWebSocket, { ReadyState } from 'react-use-websocket';

export default function Room() {
  const { ID } = useParams();
  const { user, isUserLoaded } = useUser();
  const { room, setRoom, isRoomDataLoaded } = useRoom();
  const navigate = useNavigate();
  let socketUrl = undefined;

  if (!ID || isNaN(parseInt(ID))) {
    sendToast(
      "Error al cargar la sala",
      "La información de la sala no es válida",
      "error"
    );
    navigate("/");
  } else if (!isUserLoaded) {
    sendToast(
      "Error al cargar la sala",
      "No se ha podido cargar la información del usuario",
      "error"
    );
    navigate("/");
  } else if (typeof user === "undefined" || isNaN(user.id)) {
    sendToast(
      "Error al cargar la sala",
      "La información del usuario no es válida",
      "error"
    );
    navigate("/");
  } else {
    socketUrl = `ws://localhost:8000/ws/${ID}/${user.id.toString()}`
  }

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  // Console log the last message
  useEffect(() => {
    if (lastMessage !== null) {
      const message = JSON.parse(lastMessage.data);
      if (message.type === 'update_room') {
        const payload = message.payload;
        sendToast(payload.msg, null, "info");
        const status = payload.status;
        setRoom({
          id: status.roomID,
          name: status.name,
          creatorID: status.creatorID,
          minPlayers: status.minPlayers,
          maxPlayers: status.maxPlayers,
          players: status.players.map((player) => ({
            playerID: parseInt(player.id),
            username: player.username,
          })),
        });
      } 
    }
  }, [lastMessage]);

  return (
    <>
      <Center h="100vh">
        <VStack>
          <Skeleton isLoaded={isRoomDataLoaded}>
            <Heading size="3xl" as="b">
              {isRoomDataLoaded ? room?.name : "Sala sin nombre" }
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
              
              <Card key={player.playerID} w="100%" m={1} p={2}>
                <HStack justifyContent="space-between">
                  <Text fontSize="lg">{player.username}</Text>
                  {player.id === room?.creatorID && (
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
            {room?.creatorID !== user?.id ? (
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
