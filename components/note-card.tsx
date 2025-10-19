import { Text } from '@/components/ui/text';
import type { Note } from '@/lib/types';
import { formatDate, getAvatarColor } from '@/lib/utils';
import { Pressable, View } from 'react-native';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
}

export function NoteCard({ note, onPress }: NoteCardProps) {
  const firstLetter = note.heading.charAt(0).toUpperCase() || '?';
  const avatarColor = getAvatarColor(firstLetter);

  return (
    <Pressable
      onPress={onPress}
      className="border-b border-border bg-background px-4 py-3 active:bg-accent/50">
      <View className="flex-row gap-3">
        <View
          className="h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: avatarColor }}>
          <Text className="text-xl font-bold text-white">{firstLetter}</Text>
        </View>
        <View className="flex-1 justify-center gap-1">
          <View className="flex-row items-center justify-between">
            <Text className="flex-1 text-base font-semibold text-foreground" numberOfLines={1}>
              {note.heading}
            </Text>
            <Text className="ml-2 text-xs text-muted-foreground">{formatDate(note.updatedAt)}</Text>
          </View>
          <Text className="text-sm text-muted-foreground" numberOfLines={2}>
            {note.description}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
