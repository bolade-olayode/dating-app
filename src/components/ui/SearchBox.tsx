import { View, TextInput } from "react-native";
import React from "react";
import Icons, { IconsType } from "@components/ui/Icons";
import { FONTS } from "@config/fonts";

interface Props {
  placeholder?: string;
  onChangeText?: (text: string) => void;
}
const SearchBox = ({ placeholder, onChangeText }: Props) => {
  return (
    <View
      style={{
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#F3F0F1",
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        marginVertical: 10,
      }}
    >
      <Icons
        type={IconsType.Icon}
        size={20}
        name="ri-search-line"
        color="#626262"
      />
      <TextInput
        style={{
          padding: 4,
          flex: 1,
          backgroundColor: "#FFFFFF",
          fontFamily: FONTS.H2,
          fontSize: 16,
          fontWeight: "900",
          color: "#2A0208",
          shadowColor: "transparent",
          borderWidth: 0,
        }}
        placeholder={placeholder}
        placeholderTextColor="#626262"
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default SearchBox;
