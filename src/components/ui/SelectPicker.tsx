import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FONTS } from "@config/fonts";
import Icons, { IconsType } from "@components/ui/Icons";

export interface InputProps {
  placeholder?: string;
  error?: any;
  defaultValue?: string;
  label?: string;
  editable?: boolean;
  options: string[];
  onSelect?: (value: string) => void;
  diff?: number;
}

export const SelectPicker = ({
  placeholder,
  error,
  defaultValue,
  label,
  editable = true,
  options,
  onSelect,
  diff,
}: InputProps) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || "");
  const [pickerVisible, setPickerVisible] = useState(false);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setPickerVisible(false);
    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <View style={{ paddingVertical: 18 }}>
      <Text style={{ fontFamily: FONTS.H2, fontSize: 14, color: "#646667" }}>
        {label}
      </Text>
      <View style={{ height: 56 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            borderRadius: 12,
            backgroundColor: diff == 2 ? "#FCFAFA" : "#FCFAFA",
            height: 56,
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 15,
            marginVertical: 10,
            borderWidth: 1,
            borderColor: error ? "#FD7575" : "#9A9A9A",
          }}
          onPress={() => setPickerVisible(!pickerVisible)}
          disabled={!editable}
        >
          <Text
            style={{
              fontFamily: FONTS.H2,
              fontSize: 14,
              color: selectedValue
                ? diff == 2
                  ? "#BEF263"
                  : "#000"
                : "#9A9A9A",
            }}
          >
            {selectedValue || placeholder}
          </Text>
          <Icons
            type={IconsType.Icon}
            size={28}
            name={pickerVisible ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}
            color="#626D80"
          />
        </TouchableOpacity>
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
      {pickerVisible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={pickerVisible}
          onRequestClose={() => setPickerVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedValue}
                style={styles.picker}
                onValueChange={(itemValue: string) => handleSelect(itemValue)}
                itemStyle={styles.pickerItem}
              >
                {options.map((option, index) => (
                  <Picker.Item key={index} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Add any additional styles if necessary
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    paddingHorizontal: 16,
  },
  pickerContainer: {
    borderRadius: 24,
    backgroundColor: "#ffffff",

    // Ensure the Picker is above other components
  },
  picker: {
    height: 208, // Adjust this value to fit your needs
    width: "100%",
  },
  pickerItem: {
    fontSize: 14,
    color: "#000",
    fontFamily: FONTS.H2,
    paddingVertical: 20,
  },
});
