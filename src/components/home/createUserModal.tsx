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
import { userSchema } from "../../services/validations/userSchema";
import { createUser } from "../../api/user/user-endpoints";
import { useUser } from "../../context/user-context";
import { sendToast } from "../../services/utils";

export default function CreateUserModal() {
  const { isUserLoaded, setUser } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } 
  = 
  useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof userSchema>> = async (data) => {
    const response = await createUser(data.name);
    if (response.error) {
      sendToast("Error al seleccionar nombre", response.detail, "error");
    }
    if (response.id && response.username) {
      setUser({ id: response.id, username: response.username });
      sendToast("¡Nombre seleccionado con éxito!", null, "success");
    }
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={!isUserLoaded} onClose={() => null}>
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
