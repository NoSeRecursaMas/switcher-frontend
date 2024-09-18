import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
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
import { useSelector } from "react-redux";
import { RootState } from "../services/state/store";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { roomSchema } from "../services/validations/roomSchema";
import { setRoomEndpoint } from "../api/room/roomEndpoint";
import { sendToast } from "../services/utils";

export default function CreateRoomModal() {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const user = useSelector((state: RootState) => state.user.data);

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
        await setRoomEndpoint(user.id, data.name, data.minPlayers, data.maxPlayers);
    };

    return (
        <>
            <Button onClick={onOpen} colorScheme="teal" size="lg" mt={4}> Crear partida </Button>
            <Modal closeOnOverlayClick={true} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalHeader>Nombre de la sala</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormControl isRequired isInvalid={!!errors.name}>
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