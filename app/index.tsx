import { NoteCard } from '@/components/note-card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useNotes } from '@/lib/notes-context';
import { useRouter, Stack, type Href } from 'expo-router';
import Fuse from 'fuse.js';
import { MoonStarIcon, PlusIcon, SearchIcon, SunIcon, XIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useMemo, useState } from 'react';
import { FlatList, TextInput, View } from 'react-native';

const SCREEN_OPTIONS = {
  title: 'My Notes',
  headerRight: () => <ThemeToggle />,
};

const FUSE_OPTIONS = {
  keys: ['heading', 'description'],
  threshold: 0.4,
};

export default function NotesListScreen() {
  const { sortedNotes } = useNotes();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const fuse = useMemo(() => new Fuse(sortedNotes, FUSE_OPTIONS), [sortedNotes]);

  const displayedNotes = useMemo(() => {
    if (!searchQuery.trim()) {
      return sortedNotes;
    }
    return fuse.search(searchQuery).map((result) => result.item);
  }, [searchQuery, sortedNotes, fuse]);

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <View className="flex-1 bg-background">
        <View className="border-b border-border bg-background px-4 py-3">
          <View className="flex-row items-center gap-2 rounded-lg bg-accent/50 px-3 py-2">
            <Icon as={SearchIcon} className="size-5 text-muted-foreground" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search notes..."
              placeholderTextColor="#9ca3af"
              className="flex-1 text-base text-foreground"
            />
            {searchQuery.length > 0 && (
              <Button
                onPress={() => setSearchQuery('')}
                size="icon"
                variant="ghost"
                className="h-6 w-6">
                <Icon as={XIcon} className="size-4 text-muted-foreground" />
              </Button>
            )}
          </View>
        </View>
        {displayedNotes.length === 0 ? (
          <View className="flex-1 items-center justify-center p-8">
            <Text className="mb-2 text-center text-2xl font-bold text-foreground">
              {sortedNotes.length === 0 ? 'No notes yet' : 'No results found'}
            </Text>
            <Text className="text-center text-muted-foreground">
              {sortedNotes.length === 0
                ? 'Tap the + button to create your first note'
                : 'Try a different search term'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={displayedNotes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NoteCard note={item} onPress={() => router.push(`/note/${item.id}` as Href)} />
            )}
          />
        )}
        <View className="absolute bottom-6 right-6">
          <Button
            size="icon"
            onPress={() => router.push('/note/new' as Href)}
            className="h-16 w-16 rounded-full shadow-lg shadow-black/30">
            <Icon as={PlusIcon} className="size-6 text-primary-foreground" />
          </Button>
        </View>
      </View>
    </>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}
