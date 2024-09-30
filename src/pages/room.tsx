import { useParams } from "react-router-dom";
import { VStack, HStack, Center, Button, Tooltip } from "@chakra-ui/react";
import { usePlayerStore } from "../store/playerStore";
import useSocket from "../hooks/useSocket";
import RoomData from "../components/room/roomData";

export default function Room() {
  const { ID } = useParams();
  const { player } = usePlayerStore();
  const { room } = useSocket(parseInt(ID ?? ""), player?.playerID);

  return (
    <>
      <Center h="100vh">
        <VStack>
          <RoomData room={room} />

          {room && (
            <HStack justifyContent="space-between" mt={4} spacing={4}>
              {room.hostID !== player?.playerID ? (
                <>
                  <Button colorScheme="red">Abandonar sala</Button>
                  <Tooltip label="Solo el creador de la sala puede iniciar la partida">
                    <Button colorScheme="teal" isDisabled>
                      Iniciar partida
                    </Button>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip label="No puedes abandonar la sala si eres el creador">
                    <Button colorScheme="red" isDisabled>
                      Abandonar sala
                    </Button>
                  </Tooltip>
                  {room.players.length >= room.minPlayers ? (
                    <Button colorScheme="teal">Iniciar partida</Button>
                  ) : (
                    <Tooltip label="Esperando a que se unan más jugadores">
                      <Button colorScheme="teal" isDisabled>
                        Iniciar partida
                      </Button>
                    </Tooltip>
                  )}
                </>
              )}
            </HStack>
          )}
        </VStack>
      </Center>
    </>
  );
}
