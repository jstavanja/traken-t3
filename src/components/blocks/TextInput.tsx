import {
  ChangeEventHandler,
  FC,
  FocusEventHandler,
  forwardRef,
  useState,
} from "react";
import { TextInput as MantineTextInput, createStyles } from "@mantine/core";
import { Controller } from "react-hook-form";

const useStyles = createStyles(
  (theme, { floating }: { floating: boolean }) => ({
    root: {
      position: "relative",
    },

    label: {
      position: "absolute",
      zIndex: 2,
      top: 7,
      left: theme.spacing.sm,
      pointerEvents: "none",
      color: floating
        ? theme.colorScheme === "dark"
          ? theme.white
          : theme.black
        : theme.colorScheme === "dark"
        ? theme.colors.dark?.[3]
        : theme.colors.gray?.[5],
      transition:
        "transform 150ms ease, color 150ms ease, font-size 150ms ease",
      transform: floating ? `translate(-${theme.spacing.sm}px, -28px)` : "none",
      fontSize: floating ? theme.fontSizes.xs : theme.fontSizes.sm,
      fontWeight: floating ? 500 : 400,
    },

    required: {
      transition: "opacity 150ms ease",
      opacity: floating ? 1 : 0,
    },

    input: {
      "&::placeholder": {
        transition: "color 150ms ease",
        color: !floating ? "transparent" : undefined,
      },
    },
  })
);

interface InputProps {
  id?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export const TextInput: FC<InputProps> = ({
  id,
  onChange,
  onBlur,
  onFocus,
  value,
  placeholder,
  label,
  required,
}) => {
  const [focused, setFocused] = useState(false);
  const { classes } = useStyles({
    floating: value?.trim().length !== 0 || focused,
  });

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange?.(event);
  };

  const handleOnBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    setFocused(false);
    onBlur?.(event);
  };

  const handleOnFocus: FocusEventHandler<HTMLInputElement> = (event) => {
    setFocused(true);
    onFocus?.(event);
  };

  return (
    <MantineTextInput
      id={id}
      label={label}
      placeholder={placeholder}
      required={required}
      classNames={classes}
      value={value}
      onChange={handleOnChange}
      onFocus={handleOnFocus}
      onBlur={handleOnBlur}
      mt="md"
      autoComplete="nope"
    />
  );
};
