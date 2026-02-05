"use client";

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
  Text,
  Button,
} from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
});

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster}>
        {(toast) => (
          <Toast.Root width={{ md: "sm" }} insetInline={{ mdDown: "4" }}>
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && (
                <Text fontWeight="medium">{toast.title}</Text>
              )}
              {toast.description && (
                <Text color="fg.muted" textStyle="sm">
                  {toast.description}
                </Text>
              )}
            </Stack>
            {toast.action && (
              <Button variant="outline" size="sm" onClick={toast.action.onClick}>
                {toast.action.label}
              </Button>
            )}
            {toast.meta?.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};
