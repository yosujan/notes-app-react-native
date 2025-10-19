import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useNotes } from '@/lib/notes-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeftIcon, SaveIcon, TrashIcon } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';

export default function NoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getNote, updateNote, deleteNote, addNote } = useNotes();
  const router = useRouter();

  const isNew = id === 'new';
  const existingNote = isNew ? null : getNote(id);

  const [heading, setHeading] = useState(existingNote?.heading ?? '');
  const [description, setDescription] = useState(existingNote?.description ?? '');

  const handleSave = () => {
    if (!heading.trim() && !description.trim()) return;

    if (isNew) {
      addNote({ heading: heading.trim(), description: description.trim() });
    } else {
      updateNote(id, { heading: heading.trim(), description: description.trim() });
    }
    router.back();
  };

  const handleDelete = () => {
    if (!isNew) {
      deleteNote(id);
    }
    router.back();
  };

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
            <View className="flex-row gap-2">
              {!isNew && (
                <Button onPress={handleDelete} size="icon" variant="ghost">
                  <Icon as={TrashIcon} className="size-5 text-destructive" />
                </Button>
              )}
              <Button onPress={handleSave} size="icon" variant="ghost">
                <Icon as={SaveIcon} className="size-5" />
              </Button>
            </View>
          ),
          title: isNew ? 'New Note' : 'Edit Note',
        }}
      />
      <ScrollView className="flex-1 bg-background">
        <View className="p-4">
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-muted-foreground">Heading</Text>
            <TextInput
              value={heading}
              onChangeText={setHeading}
              placeholder="Note heading..."
              placeholderTextColor="#9ca3af"
              className="rounded-xl border border-border bg-card p-4 text-lg font-bold text-foreground"
            />
          </View>
          <View>
            <Text className="mb-2 text-sm font-medium text-muted-foreground">Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Write your note here..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={10}
              textAlignVertical="top"
              className="min-h-[300px] rounded-xl border border-border bg-card p-4 text-base text-foreground"
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
}
