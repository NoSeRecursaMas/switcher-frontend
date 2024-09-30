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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { playerSchema } from "../../services/validation/playerSchema";
import { usePlayer } from "../../hooks/usePlayer";

export default function PlayerCreationForm(props: { isPlayerLoaded: boolean }) {
  const { isPlayerLoaded } = props;
  const { createPlayer } = usePlayer();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof playerSchema>>({
    resolver: zodResolver(playerSchema),
  });

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={!isPlayerLoaded}
      onClose={() => null}
    >
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit((input) => createPlayer(input.name))}>
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
