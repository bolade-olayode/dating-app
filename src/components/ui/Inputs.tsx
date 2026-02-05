import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { FONTS } from '../../config/fonts';

export interface InputProps extends TextInputProps {
  placeholder?: string;
  error?: any;
  multiline?: any;
  maxLength?: any;
  numberOfLines?: any;
  password?: any;
  countryCode?: any;
  onSelect?: any;
  visible?: any;
  onPress?: any;
  label?: any;
  diff?: any;
  editable?: boolean
  defaultValue?: string;
  onFocus?: () => void;
  onChangeText?: any;
  secureTextEntry?: boolean;
  onCountryPress?: () => void;
}

export const InputField = ({
  placeholder,
  error,
  multiline,
  maxLength,
  numberOfLines,
  defaultValue,
  secureTextEntry = false,
  password,
  countryCode,
  onSelect,
  visible,
  onPress,
  label,
  keyboardType,
  editable,
  onFocus = () => { },
  onChangeText,
  diff,
  onCountryPress,
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <View style={{ paddingVertical: 10 }}>
      {label && (
        <Text style={{ fontFamily: FONTS.H2, fontSize: 14, color: "#9A9A9A", marginBottom: 8 }}>
          {label}
        </Text>
      )}
      <View style={{
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        backgroundColor: diff === 2 ? "#232635" : "#202427",
        borderWidth: 0.5,
        borderColor: error ? "#FD7575" : isFocused ? "#FF007B" : "#333",
        paddingHorizontal: 15,
      }}>
        {countryCode && (
          <TouchableOpacity
            onPress={onCountryPress}
            activeOpacity={0.8}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Text style={{ fontFamily: FONTS.Body, fontSize: 16, color: "#ccc", marginRight: 10 }}>{countryCode}</Text>
            <View style={{ width: 1, height: 24, backgroundColor: "#333", marginRight: 15 }} />
          </TouchableOpacity>
        )}
        <TextInput
          style={{
            flex: 1,
            fontFamily: FONTS.H2,
            fontSize: 16,
            color: diff === 2 ? "#BEF263" : "#fff",
            textDecorationLine: "none",
            height: "100%",
            fontWeight: "200",
          }}
          readOnly={editable}
          placeholder={placeholder}
          placeholderTextColor="#444"
          autoCorrect={false}
          autoComplete="off"
          autoCapitalize="none"
          defaultValue={defaultValue}
          onChangeText={onChangeText}
          maxLength={maxLength}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          editable={editable}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
      {error && (
        <Text
          style={{
            fontFamily: FONTS.H1,
            paddingTop: 18,
            color: "#FD7575",
            fontSize: 12,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};
