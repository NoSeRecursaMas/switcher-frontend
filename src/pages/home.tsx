import { Center, Heading, HStack, Skeleton, Text, VStack } from "@chakra-ui/react";
import { useUser } from "../context/user-context";
import CreateUserForm from "../components/home/createUserForm";
import JoinRoomModal from "../components/home/joinRoomModal";
import CreateRoom from "../components/home/createRoom";

export default function Home() {
  const { user, setUser, isUserLoaded } = useUser();

  return (
    <>
      <CreateUserForm isUserLoaded={isUserLoaded} setUser={setUser} />
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
          <HStack>
          <CreateRoom />
            <JoinRoomModal />
          </HStack>
        </VStack>
      </Center>
    </>
  );
}
