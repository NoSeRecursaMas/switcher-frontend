import { useSelector } from "react-redux";
import { Center, Heading, HStack, Skeleton, Text, VStack } from "@chakra-ui/react";
import { RootState } from "../services/state/store";
import CreateUserModal from "../components/createUserModal";

export default function Home() {
  const userData = useSelector((state : RootState) => state.user.data);
  const loaded = useSelector((state : RootState) => state.user.loaded);

  return (
    <>
      <CreateUserModal />
      <Center h="100vh">
        <VStack>
          <Heading size="4xl">EL SWITCHER</Heading>
          <HStack>
            <Text fontSize="xl" as="i">
              Bienvenido,
            </Text>
            <Skeleton isLoaded={loaded}>
              <Text fontSize="xl" as="b">{userData ? userData.username : "invitado sin nombre"}</Text>
            </Skeleton>
          </HStack>
        </VStack>
      </Center>
    </>
  );
}
