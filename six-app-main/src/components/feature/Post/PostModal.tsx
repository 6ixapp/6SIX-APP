import { CategoryTabs } from "@/src/constants/types/categoryTabs";
import {
  ConnectionLevel,
  Post,
  PostComponentProps,
  PostInput,
} from "@/src/constants/types/post.types";
import { PostTabs } from "@/src/constants/types/postTabs.types";
import { supabase } from "@/src/db/supabase";
import { logger } from "@/src/service/logger.service";
import { createPost } from "@/src/service/post.service";
import { fetchPostSuggestion } from "@/src/service/six.service";
import { usePostStore } from "@/src/store/postStore";
import { useUserStore } from "@/src/store/userStore";
import { Feather } from "@expo/vector-icons";
import { Buffer } from "buffer"; // Make sure this is at the top
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CategoryDropdown from "./CategoryDropdown";
import ConnectionDropdown from "./ConnectionDropdown";

enum PostConnectionVisibility {
  All = "All connections",
  HideChat = "Hide chat connections",
}

const FlexiblePostComponent: React.FC<PostComponentProps> = ({
  defaultTab = CategoryTabs.General,
  isModal = false,
  visible = true,
  onClose,
  defaultConnectionLevel = ConnectionLevel.First,
  postTabs,
}) => {
  const { user } = useUserStore();
  const { addPostOnTop } = usePostStore();
  const [activeTab, setActiveTab] = useState<CategoryTabs>(defaultTab);
  const [connectionLevel, setConnectionLevel] = useState<ConnectionLevel>(
    defaultConnectionLevel
  );
  const [connectionVisibility, setConnectionVisibility] =
    useState<PostConnectionVisibility>(PostConnectionVisibility.All);
  const [noteText, setNoteText] = useState("");
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [isPostButtonActive, setIsPostButtonActive] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedImage, setSelectedImage] = useState<{
    uri: string;
    base64: string;
  } | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isModal || !visible) return;
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible, fadeAnim, isModal]);

  useEffect(() => {
    setIsPostButtonActive(noteText.length > 0 || selectedImage !== null);
  }, [noteText, selectedImage]);

  const handleTabPress = (tab: CategoryTabs) => {
    setActiveTab(tab);
  };

  const handleConnectionLevelChange = (level: ConnectionLevel) => {
    setConnectionLevel(level);
  };

  const handleToggleConnectionVisibility = () => {
    if (connectionVisibility === PostConnectionVisibility.All) {
      setConnectionVisibility(PostConnectionVisibility.HideChat);
    } else setConnectionVisibility(PostConnectionVisibility.All);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1], // Square
      quality: 0.7,
      base64: true,
      allowsMultipleSelection: false,
      selectionLimit: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (asset.base64) {
        setSelectedImage({ uri: asset.uri, base64: asset.base64 });
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setUploadedImageUrl(null);
  };

  const uploadImageToSupabase = async () => {
    if (!selectedImage || !user) {
      return null;
    }
    setIsUploadingImage(true);
    try {
      const base64Str = selectedImage.base64;
      const res = Buffer.from(base64Str, "base64");
      const timestamp = Date.now();
      const fileName = `${user.id}/post-${timestamp}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("posts")
        .upload(fileName, res, {
          contentType: "image/jpeg",
          cacheControl: "3600",
          upsert: true,
        });
      if (uploadError) {
        return null;
      }
      const { data } = supabase.storage.from("posts").getPublicUrl(fileName);
      if (!data || !data.publicUrl) {
        return null;
      }
      const cacheBustedUrl = `${data.publicUrl}?t=${timestamp}`;
      setUploadedImageUrl(cacheBustedUrl);
      return cacheBustedUrl;
    } catch (error) {
      logger.error(
        "uploadImageToSupabase",
        "Error uploading post image:",
        error as string
      );
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handlePost = async () => {
    if (user) {
      let imageUrl = uploadedImageUrl;
      if (selectedImage && !uploadedImageUrl) {
        imageUrl = await uploadImageToSupabase();
      }
      const post: PostInput = {
        user_id: user.id,
        content: noteText,
        category: activeTab,
        connectiontype: connectionLevel,
        hide_from_chat:
          connectionVisibility === PostConnectionVisibility.All ? false : true,
        image_url: imageUrl || null,
      };

      const data = await createPost(post);
      if (!data) logger.error("handlePost", "error creating post");

      if (postTabs === PostTabs.AllPosts) {
        const newPost: Post = {
          id: data.data?.id,
          user_id: user.id,
          user_name: user.name || "Anonymous",
          content: noteText,
          category: activeTab,
          hide_from_chat: post.hide_from_chat,
          created_at: new Date().toISOString(),
          expires_at: null,
          locked: false,
          connection_type: ConnectionLevel.You,
          connection_degree: ConnectionLevel.You,
          keyword_summary: [],
          user_interested: false,
          user_accepted: false,
          mutual_count: 0,
          has_chat: false,
          image_url: imageUrl || null,
        };

        addPostOnTop(newPost);
      }

      if (data && onClose) {
        onClose(true);
      }

      setNoteText("");
      setSelectedImage(null);
      setUploadedImageUrl(null);
    }
  };

  const handlePostSuggestion = async () => {
    if (user?.keyword_summary && !isLoadingSuggestion) {
      setIsLoadingSuggestion(true);
      try {
        const response = await fetchPostSuggestion(user.keyword_summary);
        setNoteText(response.data);
      } catch (error) {
        logger.error("handlePostSuggestion", "error fetching suggestion");
      } finally {
        setIsLoadingSuggestion(false);
      }
    }
  };

  const renderContent = () => (
    <ScrollView
      style={styles.scrollableContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.subHeader}>
            <View style={styles.tagIcon}>
              <Feather name="tag" size={20} color="#666" />
            </View>
            <CategoryDropdown
              activeTab={activeTab}
              onTabPress={handleTabPress}
            />
          </View>

          <View style={styles.subHeader}>
            <ConnectionDropdown
              activeConnectionLevel={connectionLevel}
              onConnectionLevelChange={handleConnectionLevelChange}
            />
            {onClose && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => onClose(false)}
              >
                <Feather name="x" size={22} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your note..."
              placeholderTextColor="#A0A0A0"
              multiline
              scrollEnabled={true}
              value={noteText}
              onChangeText={setNoteText}
            />
          </View>
        </View>

        {selectedImage && (
          <View style={{ alignItems: "center", marginBottom: 12 }}>
            <Image
              source={{ uri: selectedImage.uri }}
              style={{ width: 180, height: 180, borderRadius: 12 }}
            />
            <TouchableOpacity
              onPress={handleRemoveImage}
              style={{ marginTop: 6 }}
            >
              <Text style={{ color: "#9191ff" }}>Remove Image</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.uploadImageContainer}
          onPress={handlePickImage}
          disabled={isUploadingImage}
        >
          <Text style={styles.uploadImageText}>
            {isUploadingImage ? "Uploading..." : "Upload Image"}
          </Text>
          <Feather name="upload" size={20} color="#666" />
        </TouchableOpacity>

        <View style={styles.bottomSection}>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.option}
              onPress={handleToggleConnectionVisibility}
            >
              <Text style={styles.optionText}>{connectionVisibility}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.suggestionButton,
                isLoadingSuggestion && styles.suggestionButtonDisabled,
              ]}
              onPress={handlePostSuggestion}
              disabled={isLoadingSuggestion}
            >
              {isLoadingSuggestion ? (
                <ActivityIndicator size="small" color="#666" />
              ) : (
                <Feather name="zap" size={18} color="#666" />
              )}
              <Text style={styles.suggestionText}>Suggestion</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.postButton,
              isPostButtonActive ? styles.postButtonActive : {},
            ]}
            onPress={handlePost}
            disabled={!isPostButtonActive}
          >
            <Text
              style={[
                styles.postButtonText,
                isPostButtonActive ? styles.postButtonTextActive : {},
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  if (!isModal) {
    return <View style={styles.container}>{renderContent()}</View>;
  }

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => onClose && onClose(false)}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles.modalOverlay}
        onPress={() => onClose && onClose(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={styles.centerModalContainer}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {renderContent()}
          </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  centerModalContainer: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    maxHeight: "70%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 16,
    justifyContent: "space-between",
  },
  subHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  tagIcon: {
    marginRight: 8,
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    marginBottom: 16,
    backgroundColor: "#F9F9FB",
    borderRadius: 12,
    minHeight: 120,
  },
  inputWrapper: {
    flex: 1,
    height: "100%",
    padding: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    textAlignVertical: "top",
    maxHeight: 130,
  },
  bottomSection: {
    marginTop: 8,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9FB",
    borderRadius: 12,
    padding: 8,
  },
  optionText: {
    color: "#666",
    fontSize: 14,
  },
  suggestionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9FB",
    borderRadius: 12,
    padding: 8,
  },
  suggestionButtonDisabled: {
    opacity: 0.6,
  },
  suggestionText: {
    marginLeft: 4,
    color: "#666",
    fontSize: 14,
  },
  postButton: {
    backgroundColor: "#F3F4F6",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  postButtonActive: {
    backgroundColor: "#9191ff",
  },
  postButtonText: {
    color: "#A0A0A0",
    fontWeight: "500",
  },
  postButtonTextActive: {
    color: "#000",
  },
  uploadImageContainer: {
    marginBottom: 16,
    backgroundColor: "#F9F9FB",
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  uploadImageText: {
    color: "#666",
    fontSize: 14,
  },
  scrollableContent: {
    maxHeight: 398,
  },
});

export default FlexiblePostComponent;
