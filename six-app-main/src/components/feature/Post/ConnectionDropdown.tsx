import {
  ConnectionLevel,
  ConnectionSelectorProps,
} from "@/src/constants/types/post.types";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const ConnectionDropdown: React.FC<ConnectionSelectorProps> = ({
  activeConnectionLevel,
  onConnectionLevelChange,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownScaleAnim = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    if (isDropdownVisible) {
      hideDropdown();
    } else {
      showDropdown();
    }
  };

  const showDropdown = () => {
    setIsDropdownVisible(true);
    Animated.spring(dropdownScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
      friction: 8,
    }).start();
  };

  const hideDropdown = () => {
    Animated.timing(dropdownScaleAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setIsDropdownVisible(false);
    });
  };

  const handleSelectConnectionLevel = (level: ConnectionLevel) => {
    onConnectionLevelChange(level);
    hideDropdown();
  };

  useEffect(() => {
    return () => {
      dropdownScaleAnim.setValue(0);
    };
  }, []);

  return (
    <View style={{ position: "relative" }}>
      <TouchableOpacity
        style={styles.connectionCounter}
        onPress={toggleDropdown}
      >
        <Feather name="users" size={18} color="#666" />
        <Text style={styles.connectionCounterText}>
          {activeConnectionLevel}
        </Text>
      </TouchableOpacity>

      {isDropdownVisible && (
        <TouchableWithoutFeedback onPress={hideDropdown}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
      )}

      {isDropdownVisible && (
        <Animated.View
          style={[
            styles.dropdown,
            {
              transform: [
                { scale: dropdownScaleAnim },
                { translateY: Animated.multiply(-10, dropdownScaleAnim) },
              ],
              opacity: dropdownScaleAnim,
            },
          ]}
        >
          <View style={styles.dropdownContent}>
            {Object.values([
              ConnectionLevel.First,
              ConnectionLevel.Second,
              ConnectionLevel.Third,
            ]).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.connectionOption,
                  activeConnectionLevel === level &&
                    styles.activeConnectionOption,
                ]}
                onPress={() => handleSelectConnectionLevel(level)}
              >
                {activeConnectionLevel === level && (
                  <View style={styles.bulletPoint}>
                    <Text>•</Text>
                  </View>
                )}
                <Text style={styles.connectionOptionText}>
                  {level} connections
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  connectionCounter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  connectionCounterText: {
    marginLeft: 4,
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  dropdown: {
    position: "absolute",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 12,
    backgroundColor: "white",
    top: "100%",
    right: 0,
    marginTop: 20,
    width: 220,
  },
  dropdownContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 8,
  },
  connectionOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 2,
  },
  activeConnectionOption: {
    backgroundColor: "#f3f4f6",
  },
  bulletPoint: {
    marginRight: 8,
  },
  connectionOptionText: {
    fontSize: 16,
  },
});

export default ConnectionDropdown;
