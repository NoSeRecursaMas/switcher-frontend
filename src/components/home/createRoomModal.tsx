import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Input,
    FormControl,
    FormLabel,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    FormErrorMessage,
    useDisclosure
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { roomSchema } from "../../services/validation/room-schema";
import { setRoomEndpoint } from "../../api/room/room-endpoints";
import { sendToast } from "../../services/utils";
import { useUser } from "../../context/user-context";
import { useNavigate } from "react-router-dom";

export default function CreateRoomModal() {

    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, isUserLoaded } = useUser();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    }
        =
        useForm<z.infer<typeof roomSchema>>({
            resolver: zodResolver(roomSchema),
        });


    const onSubmit: SubmitHandler<z.infer<typeof roomSchema>> = async (data) => {
        if (!user) {
            sendToast("Error", "No se pudo obtener el usuario", "error");
            return null;
        }
        await setRoomEndpoint(user.id, data.name, data.minPlayers, data.maxPlayers, navigate);
    };

    return (
        <>
            <Button onClick={onOpen} colorScheme="teal" size="lg" mt={4} isLoading={!isUserLoaded}> Crear partida </Button>
            <Modal closeOnOverlayClick={true} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormControl isRequired isInvalid={!!errors.name}>
                                <FormLabel mt={4}>Nombre de la sala</FormLabel>
                                <Input
                                    autoComplete="off"
                                    {...register("name")}
                                    type="text"
                                    focusBorderColor="teal.400"
                                />
                                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel mt={4}>Mínimo de jugadores</FormLabel>
                                <NumberInput
                                    max={4} min={2}
                                    value={watch('minPlayers')}
                                    onChange={(valueString) => { setValue('minPlayers', Number(valueString)) }}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </FormControl>
                            <FormControl isRequired isInvalid={!!errors.maxPlayers}>
                                <FormLabel>Máximo de jugadores</FormLabel>
                                <NumberInput
                                    max={4} min={2}
                                    value={watch('maxPlayers')}
                                    onChange={(valueString) => { setValue('maxPlayers', Number(valueString)) }}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <FormErrorMessage> {errors.maxPlayers?.message} </FormErrorMessage>
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
                                Aceptar
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    );
}