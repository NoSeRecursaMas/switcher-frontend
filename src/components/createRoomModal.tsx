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
import { setRoomEndpoint } from "../services/api/room";

export default function CreateRoomModal() {

    const { isOpen, onOpen, onClose } = useDisclosure()

    // const {
    //     register,
    //     handleSubmit,
    //     formState: { errors, isSubmitting },
    // }
    //     =
    //     useForm<z.infer<typeof roomSchema>>({
    //         resolver: zodResolver(roomSchema),
    //     });

    // const onSubmit: SubmitHandler<z.infer<typeof roomSchema>> = async (data) => {
    //     await setRoomEndpoint();
    // };

    return (
        <>
            <Button onClick={onOpen} colorScheme="teal" size="lg" mt={4}> Crear partida </Button>
            <Modal closeOnOverlayClick={true} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <form> {/* onSubmit={handleSubmit(onSubmit)} */}
                        <ModalHeader>Nombre de la sala</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormControl isRequired>
                                <Input
                                    autoComplete="off"
                                    // {...register("name")}
                                    type="text"
                                    focusBorderColor="teal.400"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel mt={4}>Mínimo de jugadores</FormLabel>
                                <NumberInput max={4} min={2}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Máximo de jugadores</FormLabel>
                                <NumberInput max={4} min={2}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit" colorScheme="teal">
                                Aceptar
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    );
}