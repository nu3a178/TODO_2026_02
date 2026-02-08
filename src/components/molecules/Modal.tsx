import { Dialog, Portal } from "@chakra-ui/react";
import { memo, type ReactNode } from "react";
import { PrimaryButton } from "../atoms/PrimaryButton";

type Props = {
  title: string;
  label?: string;
  children: ReactNode;
  isOpenControllable?: boolean;
  isOpen?: boolean;
  setIsOpen?: (bool: boolean) => void;
  hideTrigger?: boolean;
};
export const Modal = memo((props: Props) => {
  const {
    title = "Input Modal",
    label = "Click",
    children,
    isOpenControllable,
    isOpen,
    setIsOpen,
    hideTrigger = false,
  } = props;
  return (
    <Dialog.Root
      placement="center"
      motionPreset="slide-in-bottom"
      {...(isOpenControllable &&
        setIsOpen && {
          open: isOpen,
          onOpenChange: (e) => setIsOpen(e.open),
        })}
    >
      {!hideTrigger && (
        <Dialog.Trigger asChild>
          <PrimaryButton
            label={label}
            {...(isOpenControllable &&
              setIsOpen && { onClick: () => setIsOpen(true) })}
          ></PrimaryButton>
        </Dialog.Trigger>
      )}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                <p>{title}</p>
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>{children}</Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
});
