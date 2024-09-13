import { Center, Heading, Button, Text, VStack } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";


export default function NotFound() {
  return (
    <Center h="100vh">
      <VStack>
        <Heading>Error 404</Heading>
        <Text>Pagina no encontrada</Text>
        <Link to="/">
          <Button colorScheme="teal" leftIcon={<ArrowBackIcon/>}>Volver al inicio</Button>
        </Link>
      </VStack>
    </Center>
  );
}
