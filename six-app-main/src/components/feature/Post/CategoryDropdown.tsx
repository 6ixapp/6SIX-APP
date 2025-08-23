import { CategoryTabs } from "@/src/constants/types/categoryTabs";
import { CategorySelectorProps } from "@/src/constants/types/post.types";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const CategoryDropdown: React.FC<CategorySelectorProps> = ({
  activeTab,
  onTabPress,
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

  const handleSelectCategory = (category: CategoryTabs) => {
    onTabPress(category);
    hideDropdown();
  };

  useEffect(() => {
    return () => {
      dropdownScaleAnim.setValue(0);
    };
  }, []);

  return (
    <View style={{ position: "relative", alignSelf: "flex-start" }}>
      <TouchableOpacity
        style={[styles.categoryButton, { backgroundColor: "#9191ff" }]}
        onPress={toggleDropdown}
      >
        <Text style={styles.categoryText}>{activeTab}</Text>
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
              minWidth: 180,
            },
          ]}
        >
          <View style={styles.dropdownContent}>
            {Object.values(CategoryTabs).map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryOption,
                  activeTab === category && styles.activeCategoryOption,
                ]}
                onPress={() => handleSelectCategory(category)}
              >
                {activeTab === category && (
                  <View style={styles.bulletPoint}>
                    <Text>•</Text>
                  </View>
                )}
                <Text style={styles.categoryOptionText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    zIndex: 1,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
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
    left: 0,
    marginTop: 20,
  },
  dropdownContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 8,
  },
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 2,
  },
  activeCategoryOption: {
    borderWidth: 1,
    borderColor: "#ddd",
  },
  bulletPoint: {
    marginRight: 8,
  },
  categoryOptionText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default CategoryDropdown;
