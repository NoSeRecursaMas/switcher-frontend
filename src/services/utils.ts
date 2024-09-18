import { createStandaloneToast } from "@chakra-ui/react";
const { toast } = createStandaloneToast();

export const sendToast = (
  title: string,
  description: string | null,
  status: "success" | "error" | "warning" | "info" | "loading"
) => {
  toast({
    title,
    description,
    status,
    duration: 9000,
    isClosable: true,
    position: "bottom-right",
  });
};
