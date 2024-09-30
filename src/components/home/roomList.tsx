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
import { sendToast } from "../../services/utils";
import { RoomDetails } from "../../types/roomTypes";

interface RoomListProps {
  isPlayerLoaded: boolean;
  selectedRoomID: number | undefined;
  setSelectedRoomID: (room: number) => void;
  rooms: RoomDetails[] | undefined;
}

export default function RoomList(props: RoomListProps) {
  const {
    isPlayerLoaded,
    selectedRoomID,
    setSelectedRoomID,
    rooms,
  } = props;

  const handleSelectRoom = (
    roomID: number,
    actualPlayers: number,
    maxPlayers: number
  ) => {
    if (actualPlayers < maxPlayers) {
      setSelectedRoomID(roomID);
    } else {
      sendToast(
        "La sala está llena",
        "No puedes unirte a una que ya alcanzó su límite de jugadores",
        "warning"
      );
    }
  };

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
        typeof rooms === "undefined" || !isPlayerLoaded || rooms.length === 0
          ? "center"
          : "flex-start"
      }
    >
      {!rooms || !isPlayerLoaded ? (
        <VStack>
          <Heading size="md" mb={2}>
            Cargando salas...
          </Heading>
          <Spinner emptyColor="gray.100" color="teal.500" size="xl" mb={8} />
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
                  room.actualPlayers,
                  room.maxPlayers
                );
              }}
              _hover={{
                bg:
                  room.actualPlayers === room.maxPlayers
                    ? "white"
                    : "gray.100",
              }}
              cursor={
                room.actualPlayers === room.maxPlayers
                  ? "not-allowed"
                  : "pointer"
              }
              bg={selectedRoomID === room.roomID ? "teal.50" : "white"}
            >
              <HStack justifyContent="space-between" h="50px">
                <Heading size="md" w="50%">
                  {room.roomName}
                </Heading>
                <Text
                  as={room.actualPlayers === room.maxPlayers ? "s" : undefined}
                >
                  {room.actualPlayers}/{room.maxPlayers} jugadores
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
