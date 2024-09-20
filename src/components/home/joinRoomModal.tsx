import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { useUser } from "../../context/user-context";
import { roomData } from "../../api/room/room-types";
import { requestRooms } from "../../api/room/room-list-endpoints";
import { useState } from "react";

export default function JoinRoomModal() {
    const [rooms, setRooms] = useState<roomData[] | undefined>(undefined);
    const { user, isUserLoaded } = useUser();
    const { isOpen, onOpen, onClose } = useDisclosure()

    const getRoomList = async () => {
        onOpen();
        const roomList = await requestRooms();
        setRooms(roomList);
    }

    return (
        <>
            <Button onClick={getRoomList} colorScheme="teal" size="lg" mt={4} isLoading={!isUserLoaded}> Unirse a partida </Button>
            <Modal closeOnOverlayClick={true} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Unirse a partida</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <p>Lista de partidas disponibles</p>
                        <ul>
                            {rooms?.map((room: roomData) => (
                                <li key={room.roomID}>
                                    <p>{room.roomName}</p>
                                    <p>Jugadores: {room.currentPlayers}/{room.maxPlayers}</p>
                                    <Button colorScheme="teal" size="lg" mt={4} isLoading={!isUserLoaded}> Unirse </Button>
                                </li>
                            ))}
                        </ul>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}