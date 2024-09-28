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
  useDisclosure,
  ModalHeader,
  HStack,
} from "@chakra-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { roomSchema } from "../../services/validation/room-schema";
import { setRoomEndpoint } from "../../api/room/room-endpoints";
import { sendToast } from "../../services/utils";
import { UserState } from "../../context/types";
import { isErrorData } from "../../api/types";
import { useNavigate } from "react-router-dom";

interface roomCreationFormProps {
  isUserLoaded: boolean;
  user: UserState | undefined;
  modalDisclosure: ReturnType<typeof useDisclosure>;
}

export default function RoomCreationForm(props: roomCreationFormProps) {
  const { isUserLoaded, user, modalDisclosure } = props;
  const { isOpen, onOpen, onClose } = modalDisclosure;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<z.infer<typeof roomSchema>>({
    resolver: zodResolver(roomSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof roomSchema>> = async (input) => {
    if (!isUserLoaded || typeof user === "undefined") {
      sendToast(
        "Error al crear partida",
        "No se pudo obtener tu usuario",
        "error"
      );
    } else {
      const data = await setRoomEndpoint({
        roomName: input.name,
        minPlayers: input.minPlayers,
        maxPlayers: input.maxPlayers,
        playerID: user.id,
      });
      if (isErrorData(data)) {
        sendToast("Error al crear partida", data.detail, "error");
      } else {
        sendToast("Partida creada con éxito", null, "success");
        navigate(`/room/${data.roomID.toString()}`);
      }
    }
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalCloseButton />
          <ModalHeader>Crear partida</ModalHeader>
          <ModalBody>
            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel>Nombre de la partida</FormLabel>
              <Input
                autoComplete="off"
                type="text"
                {...register("name")}
                focusBorderColor="teal.400"
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>
            <HStack spacing={4} mt={2}>
              <FormControl isRequired isInvalid={!!errors.minPlayers}>
                <FormLabel>Jugadores mínimos</FormLabel>
                <Controller
                  name="minPlayers"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      max={4}
                      min={2}
                      focusBorderColor="teal.400"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  )}
                />
                <FormErrorMessage>
                  {errors.minPlayers?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={!!errors.maxPlayers}>
                <FormLabel>Jugadores máximos</FormLabel>
                <Controller
                  name="maxPlayers"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      max={4}
                      min={2}
                      focusBorderColor="teal.400"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  )}
                />
                <FormErrorMessage>
                  {errors.maxPlayers?.message}
                </FormErrorMessage>
              </FormControl>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
              Crear
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
