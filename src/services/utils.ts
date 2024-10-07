import { createStandaloneToast } from "@chakra-ui/react";
import { ErrorType } from "../api/types";
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

export const sendErrorToast = (error: ErrorType, title: string) => {
  if (Array.isArray(error.detail)) {
    error.detail.forEach((errorItem) => {
      sendToast(title, errorItem.msg, "error");
    });
  } else {
    sendToast(title, error.detail, "error");
  }
};
