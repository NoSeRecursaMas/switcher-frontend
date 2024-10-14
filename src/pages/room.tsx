import { useParams } from "react-router-dom";
import { VStack, HStack, Center, Button, Tooltip } from "@chakra-ui/react";
import { usePlayerStore } from "../stores/playerStore";
import { useRoom } from "../hooks/useRoom";
import RoomData from "../components/room/roomData";
import { useRoomWebSocket } from "../hooks/useRoomWebSocket";


export default function Room() {
  const { ID } = useParams();
  const playerID = usePlayerStore((state) => state.player?.playerID);
  const { room, leaveRoom } = useRoom();

  useRoomWebSocket(parseInt(ID ?? ""));

  return (
    <>
      <Center h="100vh">
        <VStack>
          <RoomData room={room} />

          {room && (
            <HStack justifyContent="space-between" mt={4} spacing={4}>
              {room.hostID !== playerID ? (
                <>
                  <Button colorScheme="red" onClick={() => leaveRoom()}>
                    Abandonar sala
                  </Button>
                </>
              ) : (
                <>
                  <Tooltip label="No puedes abandonar la sala si eres el creador">
                    <Button colorScheme="red" isDisabled>
                      Abandonar sala
                    </Button>
                  </Tooltip>
                  {/* {room.players.length >= room.minPlayers ? (
                    <Button colorScheme="teal">Iniciar partida</Button>
                  ) : (
                    <Tooltip label="Esperando a que se unan más jugadores">
                      <Button colorScheme="teal" isDisabled>
                        Iniciar partida
                      </Button>
                    </Tooltip>
                  )} */}
                </>
              )}
            </HStack>
          )}
        </VStack>
      </Center>
    </>
  );
}
