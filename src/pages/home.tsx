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
import PlayerCreationForm from "../components/home/playerCreationForm";
import RoomCreationForm from "../components/home/roomCreationForm";
import RoomList from "../components/home/roomList";
import { usePlayerStore } from "../store/playerStore";
import useRoomList from "../hooks/useRoomList";
import { joinRoom } from "../api/room/roomEndpoints";
import { isErrorDetail } from "../api/types";
import { sendErrorToast, sendToast } from "../services/utils";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const player = usePlayerStore((state) => state.player);
  const { rooms, selectedRoomID, setSelectedRoomID, refreshRoomList } =
    useRoomList();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const handleJoinRoom = async () => {
    if (!selectedRoomID || !player) return;
    const data = await joinRoom(selectedRoomID, { playerID: player.playerID });
    if (isErrorDetail(data)) {
      sendErrorToast(data, "Error al crear partida");
    } else {
      sendToast("Partida creada con éxito", null, "success");
      navigate(`/room/${selectedRoomID.toString()}`);
    }
  };

  return (
    <Center h="100vh">
      <PlayerCreationForm isPlayerLoaded={!!player} />
      <RoomCreationForm player={player} isOpen={isOpen} onClose={onClose} />
      <VStack>
        <Heading size="4xl">EL SWITCHER</Heading>
        <HStack>
          <Text fontSize="xl" as="i">
            Bienvenido,
          </Text>
          <Skeleton isLoaded={!!player}>
            <Text fontSize="xl" as="b">
              {player ? player.username : "invitado sin nombre"}
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
              isLoading={!player}
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
              isLoading={!player}
              isDisabled={selectedRoomID === undefined}
              onClick={handleJoinRoom}
            />
          </Tooltip>
          <Tooltip label="Actualizar lista de salas">
            <IconButton
              icon={<FaArrowRotateLeft />}
              size="lg"
              aria-label="Refresh"
              colorScheme="teal"
              isLoading={!player}
              onClick={refreshRoomList}
            />
          </Tooltip>
        </HStack>

        <RoomList
          isPlayerLoaded={!!player}
          selectedRoomID={selectedRoomID}
          setSelectedRoomID={setSelectedRoomID}
          rooms={rooms}
        />
      </VStack>
    </Center>
  );
}
