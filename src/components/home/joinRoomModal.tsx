import { Button, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure, Text, Card, UnorderedList, ListItem } from "@chakra-ui/react";
import { useUser } from "../../context/user-context";
import { roomData } from "../../api/room/room-types";
import { requestRooms } from "../../api/room/room-endpoints";
import { useState } from "react";
import { FaLock } from "react-icons/fa";

export default function JoinRoomModal() {
    const [rooms, setRooms] = useState<roomData[] | undefined>(undefined);
    const { user, isUserLoaded } = useUser();
    const { isOpen, onOpen, onClose } = useDisclosure()

    const getRoomList = async () => {
        onOpen();
        const roomList = await requestRooms();
        setRooms(roomList);
    }

    // const joinRoom = async (roomID: number) => {
    //     await joinRoomRequest(roomID, user);
    // }

    return (
        <>
            <Button onClick={getRoomList} colorScheme="teal" size="lg" mt={4} isLoading={!isUserLoaded}> Unirse a partida </Button>
            <Modal closeOnOverlayClick={true} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Unirse a partida</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text mb={2}>Lista de partidas disponibles</Text>
                        <UnorderedList styleType="none" maxHeight="400px" overflowY="auto" pr={4}>
                            {/* Se filtran las salas empezadas y las que están llenas */}
                            {rooms?.filter((room: roomData) => !room.started && room.currentPlayers < room.maxPlayers)
                                .map((room: roomData) => (
                                    <ListItem key={room.roomID}>
                                        <Card m={4}>
                                            <HStack justifyContent="space-between">
                                                <Text fontSize="md" as="b" ml={2} maxWidth="200px" whiteSpace="break-spaces" overflow="hidden" textOverflow="ellipsis">
                                                    {room.roomName}
                                                </Text>
                                                <HStack>
                                                    <Text>{room.currentPlayers}/{room.maxPlayers}</Text>
                                                    {room.private && <FaLock color="red" />}
                                                    <Button colorScheme="teal" size="md" m={4} minWidth="90px" isLoading={!isUserLoaded}> Unirse </Button>
                                                    {/* onClick={() => joinRoom(room.roomID)} para agregar función de unirse a la sala 
                                                cambiar la condición de isLoading por una que espere la request de unirse*/}
                                                </HStack>
                                            </HStack>
                                        </Card>
                                    </ListItem>
                                ))}
                        </UnorderedList>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}