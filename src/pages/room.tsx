import { useParams } from "react-router-dom";
import { VStack, HStack, Center, Button, Tooltip } from "@chakra-ui/react";
import { usePlayerStore } from "../stores/playerStore";
import { useRoom } from "../hooks/useRoom";
import RoomData from "../components/room/roomData";
import useWebSocket from "react-use-websocket";
import { useEffect } from "react";
import SocketMessage from "../types/socketTypes";
import { sendToast } from "../services/utils";

export default function Room() {
  const { ID } = useParams();
  const { player } = usePlayerStore();
  const { room, leaveRoom, updateRoom } = useRoom(parseInt(ID ?? ""));

  const roomID = ID ?? "0";
  const playerID = player?.playerID.toString() ?? "0";


  const socketUrl = `ws://localhost:8000/ws/${roomID}/${playerID}`;
  const { lastMessage, getWebSocket } = useWebSocket(socketUrl);
  console.log("Intenando conectarse a: ", socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      const message = JSON.parse(lastMessage.data as string) as SocketMessage;
      if (message.type === "UPDATE_ROOM") {
        sendToast(message.payload.msg, null, "info");
        updateRoom(message.payload.status);
        console.log(message.payload.status);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  return (
    <>
      <Center h="100vh">
        <VStack>
          <RoomData room={room} />

          {room && (
            <HStack justifyContent="space-between" mt={4} spacing={4}>
              {room.hostID !== player?.playerID ? (
                <>
                  <Button colorScheme="red" onClick={() => leaveRoom(getWebSocket())}>
                    Abandonar sala
                  </Button>
                  {/* <Tooltip label="Solo el creador de la sala puede iniciar la partida">
                    <Button colorScheme="teal" isDisabled>
                      Iniciar partida
                    </Button>
                  </Tooltip> */}
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
