import { Button, type ButtonProps } from "@chakra-ui/react";
import { memo } from "react";

type Props = {
  label: string;
} & Omit<ButtonProps, "children">;

export const PrimaryButton = memo((props: Props) => {
  const { label, ...rest } = props;
  return (
    <Button colorPalette="teal" _hover={{ opacity: 0.8 }} {...rest}>
      {label}
    </Button>
  );
});
