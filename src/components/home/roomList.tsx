import {
  Tag,
  TagLabel,
  TagRightIcon,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
  Card,
  Box,
} from "@chakra-ui/react";
import { LockIcon, UnlockIcon } from "@chakra-ui/icons";
import { useEffect } from "react";
import { sendToast } from "../../services/utils";
import { roomDetails } from "../../api/room/room-types";

interface RoomListProps {
  isUserLoaded: boolean;
  selectedRoom: number | undefined;
  setSelectedRoom: (room: number) => void;
  refreshRoomList: () => void;
  rooms: roomDetails[] | undefined;
}

export default function RoomList(props: RoomListProps) {

  const { isUserLoaded, selectedRoom, setSelectedRoom, refreshRoomList, rooms } =
    props;

  const handleSelectRoom = (
    roomID: number,
    currentPlayers: number,
    maxPlayers: number
  ) => {
    if (currentPlayers < maxPlayers) {
      setSelectedRoom(roomID);
    } else {
      sendToast(
        "La sala está llena",
        "No puedes unirte a una que ya alcanzó su límite de jugadores",
        "warning"
      );
    }
  };

  useEffect(() => {
    refreshRoomList();
  }, [isUserLoaded]);

  return (
    <VStack
      w="xl"
      maxH="md"
      minH="xs"
      p={4}
      overflowY="auto"
      overflowX="hidden"
      boxShadow="base"
      justifyContent={
        typeof rooms === "undefined" || !isUserLoaded || rooms.length === 0
          ? "center"
          : "flex-start"
      }
    >
      {typeof rooms === "undefined" || !isUserLoaded ? (
        <VStack mb={8}>
          <Heading size="md" mb={2}>
            Cargando salas...
          </Heading>
          <Spinner emptyColor="gray.100" color="teal.500" size="xl" />
        </VStack>
      ) : rooms.length === 0 ? (
        <Box>
          <Heading size="md">No hay salas disponibles</Heading>
        </Box>
      ) : (
        rooms
          .filter((room) => !room.started)
          .map((room) => (
            <Card
              key={room.roomID}
              w="100%"
              m={1}
              p={2}
              onClick={() => {
                handleSelectRoom(
                  room.roomID,
                  room.currentPlayers,
                  room.maxPlayers
                );
              }}
              _hover={{
                bg: room.currentPlayers === room.maxPlayers ? "white" : "gray.100",
              }}
              cursor={
                room.currentPlayers === room.maxPlayers
                  ? "not-allowed"
                  : "pointer"
              }
              bg={selectedRoom === room.roomID ? "teal.50" : "white"}
            >
              <HStack justifyContent="space-between" h="50px">
                <Heading size="md" w="50%">
                  {room.roomName}
                </Heading>
                <Text
                  as={room.currentPlayers === room.maxPlayers ? "s" : undefined}
                >
                  {room.currentPlayers}/{room.maxPlayers} jugadores
                </Text>
                {room.private ? (
                  <Tag size="sm" variant="outline" colorScheme="red">
                    <TagLabel>Privada</TagLabel>
                    <TagRightIcon as={LockIcon} />
                  </Tag>
                ) : (
                  <Tag size="sm" variant="outline" colorScheme="green">
                    <TagLabel>Pública</TagLabel>
                    <TagRightIcon as={UnlockIcon} />
                  </Tag>
                )}
              </HStack>
            </Card>
          ))
      )}
    </VStack>
  );
}
