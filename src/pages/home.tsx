import {
  IconButton,
  Center,
  Heading,
  HStack,
  Text,
  VStack,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { FaArrowRightToBracket } from "react-icons/fa6";

import RoomCreationForm from "../components/home/roomCreationForm";
import RoomList from "../components/home/roomList";

import { useRoomList } from "../hooks/useRoomList";
import { usePlayer } from "../hooks/usePlayer";
import { useRoom } from "../hooks/useRoom";

export default function Home() {
  const { player } = usePlayer();
  const { selectedRoomID } = useRoomList();
  const { joinRoom } = useRoom();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Center h="100vh">
      <RoomCreationForm isOpen={isOpen} onClose={onClose} />
      <VStack>
        <Heading size="4xl">EL SWITCHER</Heading>
        <HStack>
          <Text fontSize="xl" as="i">
            Bienvenido,
          </Text>
          <Text fontSize="xl" as="b">
            {player?.username}
          </Text>
        </HStack>

        <HStack spacing={4} mt={8} mb={2}>
          <Tooltip label="Crear una sala">
            <IconButton
              icon={<AddIcon />}
              size="lg"
              aria-label="Create Room"
              colorScheme="teal"
              onClick={onOpen}
            />
          </Tooltip>
          <Tooltip
            label={
              selectedRoomID
                ? "Unirse a la sala"
                : "Selecciona una sala para unirte"
            }
          >
            <IconButton
              icon={<FaArrowRightToBracket />}
              size="lg"
              aria-label="Join Room"
              colorScheme="teal"
              isDisabled={selectedRoomID === undefined}
              onClick={joinRoom}
            />
          </Tooltip>
        </HStack>
        <RoomList />
      </VStack>
    </Center>
  );
}
