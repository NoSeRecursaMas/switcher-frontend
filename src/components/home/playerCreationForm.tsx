import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { playerSchema } from "../../services/validation/playerSchema";
import { createPlayer } from "../../api/player/playerEndpoints";
import { sendToast } from "../../services/utils";
import { isErrorDetail } from "../../api/types";
import { usePlayerStore } from "../../store/playerStore";

interface PlayerCreationFormProps {
  isPlayerLoaded: boolean;
}

export default function PlayerCreationForm(props: PlayerCreationFormProps) {
  const { isPlayerLoaded } = props;
  const { setPlayer } = usePlayerStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof playerSchema>>({
    resolver: zodResolver(playerSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof playerSchema>> = async (input) => {
    const data = await createPlayer({ username: input.name });
    if (isErrorDetail(data)) {
      sendToast("Error al crear el usuario", data.detail, "error");
    } else {
      setPlayer(data);
      sendToast("¡Nombre seleccionado con éxito!", null, "success");
    }
  };

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={!isPlayerLoaded}
      onClose={() => null}
    >
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Elige tu nombre</ModalHeader>
          <ModalBody>
            <FormControl isInvalid={!!errors.name}>
              <Input
                autoComplete="off"
                {...register("name")}
                type="text"
                focusBorderColor="teal.400"
                isRequired
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
              Crear
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
