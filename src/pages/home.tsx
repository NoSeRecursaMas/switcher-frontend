import { Center, Heading, HStack, Skeleton, Text, VStack } from "@chakra-ui/react";
import CreateUserModal from "../components/home/createUserModal";
import { useUser } from "../context/user-context";

export default function Home() {
  const { user, isUserLoaded } = useUser();

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
            <Skeleton isLoaded={isUserLoaded}>
              <Text fontSize="xl" as="b">{isUserLoaded ? user?.username : "invitado sin nombre"}</Text>
            </Skeleton>
          </HStack>
        </VStack>
      </Center>
    </>
  );
}
