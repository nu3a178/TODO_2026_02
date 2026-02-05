import { Button } from "@chakra-ui/react";
import { memo } from "react";
type Props = {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "reset" | "submit";
  label: string;
};

export const PrimaryButton = memo((props: Props) => {
  const { label, onClick, disabled, loading, type = "button" } = props;
  return (
    <Button
      colorPalette="teal"
      _hover={{ opacity: 0.8 }}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      type={type}
    >
      {label}
    </Button>
  );
});
