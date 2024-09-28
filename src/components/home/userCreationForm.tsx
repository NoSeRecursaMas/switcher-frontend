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
import { userSchema } from "../../services/validation/user-schema";
import { createUser } from "../../api/user/user-endpoints";
import { sendToast } from "../../services/utils";
import { UserContextType } from "../../context/types";
import { isErrorData } from "../../api/types";

interface UserCreationFormProps {
  isUserLoaded: boolean;
  setUser: UserContextType["setUser"];
}

export default function UserCreationForm(props: UserCreationFormProps) {
  const { isUserLoaded, setUser } = props;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof userSchema>> = async (input) => {
    const data = await createUser({ username: input.name });
    if (isErrorData(data)) {
      sendToast("Error al seleccionar nombre", data.detail, "error");
    } else {
      setUser({ id: data.playerID, username: input.name });
      sendToast("¡Nombre seleccionado con éxito!", null, "success");
    }
  };

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={!isUserLoaded}
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
