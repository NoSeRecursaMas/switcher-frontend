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
import { useSelector } from "react-redux";
import { RootState } from "../services/state/store";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "../services/validations/userSchema";
import { loadUserEndpoint } from "../api/user/endpoints";

export default function CreateUserModal() {
  const userLoaded = useSelector((state: RootState) => state.user.loaded);

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
    await loadUserEndpoint(data.name);
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={!userLoaded} onClose={() => null}>
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
