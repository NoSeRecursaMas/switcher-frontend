import {
  IconButton,
  Center,
  Heading,
  HStack,
  Skeleton,
  Text,
  VStack,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { FaArrowRightToBracket, FaArrowRotateLeft } from "react-icons/fa6";
import { useUser } from "../context/user-context";
import UserCreationForm from "../components/home/userCreationForm";
import RoomCreationForm from "../components/home/roomCreationForm";
import RoomList from "../components/home/roomList";
import { requestRooms } from "../api/room/room-endpoints";
import { roomDetails } from "../api/room/room-types";
import { sendToast } from "../services/utils";
import { useState } from "react";
import { isErrorData } from "../api/types";

export default function Home() {
  const { user, setUser, isUserLoaded } = useUser();
  const [selectedRoom, setSelectedRoom] = useState<number | undefined>(
    undefined
  );
  const [rooms, setRooms] = useState<roomDetails[] | undefined>(undefined);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const refreshRoomList = async () => {
    setSelectedRoom(undefined);
    setRooms(undefined);

    const data = await requestRooms();
    if (isErrorData(data)) {
      sendToast("Error al obtener la lista de salas", data.detail, "error");
    } else {
      setRooms(data);
    }
  };

  return (
    <Center h="100vh">
      <UserCreationForm isUserLoaded={isUserLoaded} setUser={setUser} />
      <RoomCreationForm isUserLoaded={isUserLoaded} user={user} isOpen={isOpen} onClose={onClose} />
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
              onClick={onOpen}
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
              onClick={refreshRoomList}
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
