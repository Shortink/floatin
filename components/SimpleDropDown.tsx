import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ViewStyle,
  StyleProp,
} from "react-native";

export type Option = {
  label: string;
  value: string | number;
};

type Props = {
  options: Option[];
  selectedValue: Option;
  onValueChange: (value: Option) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
};

export default function SimpleDropdown({
  options,
  selectedValue,
  onValueChange,
  placeholder,
  style,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.selector} onPress={() => setOpen(!open)}>
        <Text style={{ color: selectedValue ? "#000" : "black" }}>
          {selectedValue ? selectedValue.label : placeholder}
        </Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          <ScrollView
            style={{ maxHeight: 150 }}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.option}
                onPress={() => {
                  onValueChange(option);
                  setOpen(false);
                }}
              >
                <Text>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 8,
    flex: 1,
  },
  selector: {
    borderWidth: 1,
    borderColor: "#C3E3D4",
    borderRadius: 30,
    padding: 12,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#C3E3D4",
    borderRadius: 20,
    marginTop: 2,
  },
  option: {
    paddingVertical: 7,
    alignItems: "center",
  },
});
