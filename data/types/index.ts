import { KeyboardTypeOptions } from "react-native";

export type CustomButtonProps = {
  title: string;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
};

export type FormFieldProps = {
  title: string;
  value: string;
  placeholder?: string;
  handleChangeText: (e: string) => void;
  otherStyles?: string;
  keyboardType?: KeyboardTypeOptions;
  typeInput?: "text" | "password";
};
