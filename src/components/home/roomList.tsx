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
  useColorMode,
} from "@chakra-ui/react";
import { LockIcon, UnlockIcon } from "@chakra-ui/icons";
import { RoomDetails } from "../../types/roomTypes";

interface RoomListProps {
  isPlayerLoaded: boolean;
  selectedRoomID: number | undefined;
  handleSelectRoomID: (
    roomID: number,
    actualPlayers: number,
    maxPlayers: number
  ) => void;
  rooms: RoomDetails[] | undefined;
}

export default function RoomList(props: RoomListProps) {
  const { isPlayerLoaded, selectedRoomID, handleSelectRoomID, rooms } = props;
  const { colorMode } = useColorMode();
  const colorHover = colorMode === "light" ? "gray.300" : "gray.600";
  const colorSelected = colorMode === "light" ? "teal.100" : "teal.800";
  const colorBackground = colorMode === "light" ? "gray.200" : "#242C3A";

  return (
    <VStack
      w="2xl"
      maxH="md"
      minH="xs"
      py={2}
      px={3}
      overflowY="auto"
      overflowX="hidden"
      justifyContent={
        typeof rooms === "undefined" || !isPlayerLoaded || rooms.length === 0
          ? "center"
          : "flex-start"
      }
      borderRadius={16}
      bg={colorBackground}
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
                handleSelectRoomID(
                  room.roomID,
                  room.actualPlayers,
                  room.maxPlayers
                );
              }}
              _hover={{
                bg:
                  room.actualPlayers === room.maxPlayers ? undefined : colorHover,
              }}
              cursor={
                room.actualPlayers === room.maxPlayers
                  ? "not-allowed"
                  : "pointer"
              }
              bg={selectedRoomID === room.roomID ? colorSelected : undefined}
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
