import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { FONTS } from '../../config/fonts';
import Icons, { IconsType } from './Icons';


export interface ButtonProps {
  onPress?: any;
  disabled?: any;
  text?: string;
  variant?: number;
}


export const PrimaryButton = ({ onPress, disabled, text, variant }: ButtonProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.8}
      style={{ width: "100%" }}
    >
      <LinearGradient
        colors={
          variant === 2 ? ["#202427", "#202427"] : ["#FF007B", "#6366F1", "#00B4D8"]
        }
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.primaryButton, { opacity: disabled ? 0.5 : 1 }]}
      >
        <Text
          style={{
            fontFamily: FONTS.H3,
            fontSize: 16,
            color: "#fff",
          }}
        >
          {text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};


export const FacebookButton = ({ onPress, disabled, text = "Continue with Facebook" }: ButtonProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.facebookButton, { opacity: disabled ? 0.5 : 1 }]}>
        <Icons
          type={IconsType.MaterialCommunityIcons}
          name="facebook"
          size={24}
          color="#fff"
          style={{ marginRight: 10 }}
        />
        <Text
          style={{
            fontFamily: FONTS.H3,
            fontSize: 16,
            color: "#fff",
          }}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};


export const GoogleButton = ({ onPress, disabled, text = "Continue with Google" }: ButtonProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.googleButton, { opacity: disabled ? 0.5 : 1 }]}>
        <Icons
          type={IconsType.AntDesign}
          name="google"
          size={24}
          color="#000"
          style={{ marginRight: 10 }}
        />
        <Text
          style={{
            fontFamily: FONTS.H3,
            fontSize: 16,
            color: "#000",
          }}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 56,
    paddingHorizontal: 8,
    borderRadius: 100,
    paddingVertical: 10,
  },
  facebookButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 56,
    paddingHorizontal: 8,
    borderRadius: 100,
    paddingVertical: 10,
    backgroundColor: "#094EAB",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 56,
    paddingHorizontal: 8,
    borderRadius: 100,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
});
