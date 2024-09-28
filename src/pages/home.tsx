import {
  IconButton,
  Center,
  Heading,
  HStack,
  Skeleton,
  Text,
  VStack,
  Tooltip,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { FaArrowRightToBracket, FaArrowRotateLeft } from "react-icons/fa6";
import { useUser } from "../context/user-context";
import CreateUserForm from "../components/home/createUserForm";
import RoomList from "../components/home/roomList";
import { requestRooms } from "../api/room/room-endpoints";
import { roomDetails } from "../api/room/room-types";
import { sendToast } from "../services/utils";
import { useState } from "react";

export default function Home() {
  const { user, setUser, isUserLoaded } = useUser();
  const [selectedRoom, setSelectedRoom] = useState<number | undefined>(
    undefined
  );
  const [rooms, setRooms] = useState<roomDetails[] | undefined>(undefined);

  const refreshRoomList = () => {
    setSelectedRoom(undefined);
    setRooms(undefined);

    requestRooms()
      .then((rooms) => {
        setRooms(rooms);
      })
      .catch((error: unknown) => {
        sendToast("Error al cargar las salas", JSON.stringify(error), "error");
        setRooms([]);
      });
  };

  return (
    <Center h="100vh">
      <CreateUserForm isUserLoaded={isUserLoaded} setUser={setUser} />

      <VStack>
        <Heading size="4xl">EL SWITCHER</Heading>
        <HStack>
          <Text fontSize="xl" as="i">
            Bienvenido,
          </Text>
          <Skeleton isLoaded={isUserLoaded}>
            <Text fontSize="xl" as="b">
              {isUserLoaded ? user?.username : "invitado sin nombre"}
            </Text>
          </Skeleton>
        </HStack>

        <HStack spacing={4} mt={8}>
          <Tooltip label="Crear una sala">
            <IconButton
              icon={<AddIcon />}
              size="lg"
              aria-label="Create Room"
              colorScheme="teal"
              isLoading={!isUserLoaded}
            />
          </Tooltip>
          <Tooltip
            label={
              selectedRoom
                ? "Unirse a la sala"
                : "Selecciona una sala para unirte"
            }
          >
            <IconButton
              icon={<FaArrowRightToBracket />}
              size="lg"
              aria-label="Join Room"
              colorScheme="teal"
              isLoading={!isUserLoaded}
              isDisabled={selectedRoom === undefined}
            />
          </Tooltip>
          <Tooltip label="Actualizar lista de salas">
            <IconButton
              icon={<FaArrowRotateLeft />}
              size="lg"
              aria-label="Refresh"
              colorScheme="teal"
              isLoading={!isUserLoaded}
            />
          </Tooltip>
        </HStack>

        <RoomList
          isUserLoaded={isUserLoaded}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          refreshRoomList={refreshRoomList}
          rooms={rooms}
        />
      </VStack>
    </Center>
  );
}
