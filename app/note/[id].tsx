import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { formatDate } from '@/lib/utils';
import type { AttachedFile } from '@/lib/types';
import { useNotes } from '@/lib/notes-context';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ArrowLeftIcon,
  CameraIcon,
  CheckIcon,
  FileIcon,
  TrashIcon,
  XIcon,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';

export default function NoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getNote, updateNote, deleteNote, addNote } = useNotes();
  const router = useRouter();

  const isNew = id === 'new';
  const existingNote = isNew ? null : getNote(id);

  const [heading, setHeading] = useState(existingNote?.heading ?? '');
  const [description, setDescription] = useState(existingNote?.description ?? '');
  const [images, setImages] = useState<string[]>(existingNote?.images ?? []);
  const [files, setFiles] = useState<AttachedFile[]>(existingNote?.files ?? []);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        const newFiles: AttachedFile[] = result.assets.map((asset) => ({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || 'application/octet-stream',
          size: asset.size,
        }));
        setFiles([...files, ...newFiles]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please grant permission to access your camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImageFile = (file: AttachedFile) => {
    return file.type.startsWith('image/');
  };

  const handleSave = () => {
    if (!heading.trim() && !description.trim()) return;

    if (isNew) {
      addNote({ heading: heading.trim(), description: description.trim(), images, files });
    } else {
      updateNote(id, { heading: heading.trim(), description: description.trim(), images, files });
    }
    router.back();
  };

  const handleDelete = () => {
    if (!isNew) {
      deleteNote(id);
    }
    router.back();
  };

  const hasChanges =
    heading.trim() !== (existingNote?.heading ?? '') ||
    description.trim() !== (existingNote?.description ?? '') ||
    JSON.stringify(images) !== JSON.stringify(existingNote?.images ?? []) ||
    JSON.stringify(files) !== JSON.stringify(existingNote?.files ?? []);

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Button onPress={() => router.back()} size="icon" variant="ghost">
              <Icon as={ArrowLeftIcon} className="size-5" />
            </Button>
          ),
          headerRight: () => (
            <View className="flex-row gap-1">
              {!isNew && (
                <Button onPress={handleDelete} size="icon" variant="ghost">
                  <Icon as={TrashIcon} className="size-5 text-destructive" />
                </Button>
              )}
              {isNew && <View className="h-10 w-10" />}
            </View>
          ),
          title: '',
          headerShadowVisible: false,
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-background">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 py-4">
            {!isNew && existingNote && (
              <View className="mb-6">
                <Text className="text-xs text-muted-foreground">
                  Modified {formatDate(existingNote.updatedAt)} • Created{' '}
                  {formatDate(existingNote.createdAt)}
                </Text>
              </View>
            )}
            <TextInput
              value={heading}
              onChangeText={setHeading}
              placeholder="Note title"
              placeholderTextColor="#9ca3af"
              className="mb-4 text-3xl font-bold text-foreground"
              autoFocus={isNew}
            />
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Start writing..."
              placeholderTextColor="#9ca3af"
              multiline
              textAlignVertical="top"
              className="min-h-[200px] text-base leading-6 text-foreground"
            />
            {images.length > 0 && (
              <View className="mt-6">
                <Text className="mb-3 text-sm font-semibold text-foreground">
                  Images ({images.length})
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {images.map((uri, index) => (
                    <View key={index} className="relative">
                      <Image source={{ uri }} className="h-24 w-24 rounded-lg" resizeMode="cover" />
                      <Pressable
                        onPress={() => removeImage(index)}
                        className="absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full bg-destructive">
                        <Icon as={XIcon} className="size-4 text-white" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            )}
            {files.length > 0 && (
              <View className="mt-6">
                <Text className="mb-3 text-sm font-semibold text-foreground">
                  Files ({files.length})
                </Text>
                <View className="gap-2">
                  {files.map((file, index) =>
                    isImageFile(file) ? (
                      <View key={index} className="relative inline-block">
                        <Image
                          source={{ uri: file.uri }}
                          className="h-24 w-24 rounded-lg"
                          resizeMode="cover"
                        />
                        <Pressable
                          onPress={() => removeFile(index)}
                          className="absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full bg-destructive">
                          <Icon as={XIcon} className="size-4 text-white" />
                        </Pressable>
                      </View>
                    ) : (
                      <View
                        key={index}
                        className="flex-row items-center justify-between rounded-lg border border-border bg-card p-3">
                        <View className="flex-1 flex-row items-center gap-3">
                          <View className="h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Icon as={FileIcon} className="size-5 text-primary" />
                          </View>
                          <View className="flex-1">
                            <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
                              {file.name}
                            </Text>
                            <Text className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </Text>
                          </View>
                        </View>
                        <Pressable
                          onPress={() => removeFile(index)}
                          className="ml-2 h-8 w-8 items-center justify-center">
                          <Icon as={XIcon} className="size-4 text-destructive" />
                        </Pressable>
                      </View>
                    )
                  )}
                </View>
              </View>
            )}
            <View className="mt-6 flex-row gap-2">
              <Button onPress={pickFile} variant="outline" className="flex-1">
                <Icon as={FileIcon} className="size-5" />
                <Text>Attach File</Text>
              </Button>
              <Button onPress={takePhoto} variant="outline" className="flex-1">
                <Icon as={CameraIcon} className="size-5" />
                <Text>Camera</Text>
              </Button>
            </View>
            {(isNew || hasChanges) && keyboardVisible && (
              <View className="mt-6">
                <Button onPress={handleSave} className="w-full">
                  <Icon as={CheckIcon} className="size-5 text-primary-foreground" />
                  <Text className="text-base font-semibold">
                    {isNew ? 'Create Note' : 'Save Changes'}
                  </Text>
                </Button>
              </View>
            )}
          </View>
        </ScrollView>
        {(isNew || hasChanges) && !keyboardVisible && (
          <View className="border-t border-border bg-background p-4">
            <Button onPress={handleSave} className="w-full">
              <Icon as={CheckIcon} className="size-5 text-primary-foreground" />
              <Text className="text-base font-semibold">
                {isNew ? 'Create Note' : 'Save Changes'}
              </Text>
            </Button>
          </View>
        )}
      </KeyboardAvoidingView>
    </>
  );
}
