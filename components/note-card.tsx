import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { Note } from '@/lib/types';
import { formatDate, getAvatarColor } from '@/lib/utils';
import { FileIcon, ImageIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
}

export function NoteCard({ note, onPress }: NoteCardProps) {
  const firstLetter = note.heading.charAt(0).toUpperCase() || '?';
  const avatarColor = getAvatarColor(firstLetter);
  const hasImages = note.images && note.images.length > 0;
  const hasFiles = note.files && note.files.length > 0;

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
          <View className="flex-row items-center justify-between">
            <Text className="flex-1 text-sm text-muted-foreground" numberOfLines={2}>
              {note.description}
            </Text>
          </View>
          {(hasImages || hasFiles) && (
            <View className="mt-1 flex-row gap-3">
              {hasImages && (
                <View className="flex-row items-center gap-1">
                  <Icon as={ImageIcon} className="size-3 text-muted-foreground" />
                  <Text className="text-xs text-muted-foreground">{note.images!.length}</Text>
                </View>
              )}
              {hasFiles && (
                <View className="flex-row items-center gap-1">
                  <Icon as={FileIcon} className="size-3 text-muted-foreground" />
                  <Text className="text-xs text-muted-foreground">{note.files!.length}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
