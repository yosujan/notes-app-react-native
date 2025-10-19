import { NoteCard } from '@/components/note-card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useNotes } from '@/lib/notes-context';
import { useRouter, Stack, type Href } from 'expo-router';
import Fuse from 'fuse.js';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MoonStarIcon,
  PlusIcon,
  SearchIcon,
  SunIcon,
  XIcon,
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, TextInput, View } from 'react-native';

const SCREEN_OPTIONS = {
  title: 'My Notes',
  headerRight: () => <ThemeToggle />,
};

const FUSE_OPTIONS = {
  keys: ['heading', 'description'],
  threshold: 0.4,
};

type Filter = 'all' | 'recent' | 'with-images';
type SortBy = 'modified' | 'created' | 'alphabetical';
type SortOrder = 'asc' | 'desc';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'recent', label: 'Recent' },
  { id: 'with-images', label: 'With Images' },
];

const SORT_OPTIONS: { id: SortBy; label: string }[] = [
  { id: 'modified', label: 'Modified' },
  { id: 'created', label: 'Created' },
  { id: 'alphabetical', label: 'A-Z' },
];

export default function NotesListScreen() {
  const { sortedNotes } = useNotes();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('modified');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSortPress = (sortId: SortBy) => {
    if (sortBy === sortId) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(sortId);
      setSortOrder('desc');
    }
  };

  const fuse = useMemo(() => new Fuse(sortedNotes, FUSE_OPTIONS), [sortedNotes]);

  const filteredAndSortedNotes = useMemo(() => {
    let notes = [...sortedNotes];

    if (activeFilter === 'recent') {
      const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
      notes = notes.filter((note) => note.updatedAt > threeDaysAgo);
    } else if (activeFilter === 'with-images') {
      notes = notes.filter((note) => note.images && note.images.length > 0);
    }

    if (sortBy === 'created') {
      notes.sort((a, b) =>
        sortOrder === 'desc' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
      );
    } else if (sortBy === 'alphabetical') {
      notes.sort((a, b) =>
        sortOrder === 'desc'
          ? b.heading.localeCompare(a.heading)
          : a.heading.localeCompare(b.heading)
      );
    } else {
      notes.sort((a, b) =>
        sortOrder === 'desc' ? b.updatedAt - a.updatedAt : a.updatedAt - b.updatedAt
      );
    }

    return notes;
  }, [sortedNotes, activeFilter, sortBy, sortOrder]);

  const displayedNotes = useMemo(() => {
    if (!searchQuery.trim()) {
      return filteredAndSortedNotes;
    }
    const fuseFiltered = new Fuse(filteredAndSortedNotes, FUSE_OPTIONS);
    return fuseFiltered.search(searchQuery).map((result) => result.item);
  }, [searchQuery, filteredAndSortedNotes]);

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
              onFocus={() => setSearchFocused(true)}
              placeholder="Search notes..."
              placeholderTextColor="#9ca3af"
              className="flex-1 text-base text-foreground"
            />
            {searchQuery.length > 0 && (
              <Button
                onPress={() => {
                  setSearchQuery('');
                  setSearchFocused(false);
                }}
                size="icon"
                variant="ghost"
                className="h-6 w-6">
                <Icon as={XIcon} className="size-4 text-muted-foreground" />
              </Button>
            )}
          </View>
        </View>
        {(searchFocused || searchQuery.length > 0) && (
          <View className="border-b border-border bg-background px-4 py-2">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {FILTERS.map((filter) => (
                  <Pressable
                    key={filter.id}
                    onPress={() => setActiveFilter(filter.id)}
                    className={
                      activeFilter === filter.id
                        ? 'rounded-full bg-primary px-4 py-2'
                        : 'rounded-full border border-border bg-background px-4 py-2'
                    }>
                    <Text
                      className={
                        activeFilter === filter.id
                          ? 'text-sm font-medium text-primary-foreground'
                          : 'text-sm font-medium text-foreground'
                      }>
                      {filter.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
        <View className="border-b border-border bg-background px-4 py-2">
          <View className="mb-1 flex-row items-center justify-between">
            <Text className="text-xs font-medium text-muted-foreground">Sort by</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {SORT_OPTIONS.map((sort) => (
                <Pressable
                  key={sort.id}
                  onPress={() => handleSortPress(sort.id)}
                  className={
                    sortBy === sort.id
                      ? 'flex-row items-center gap-1.5 rounded-full bg-secondary px-4 py-1.5'
                      : 'rounded-full border border-border bg-background px-4 py-1.5'
                  }>
                  <Text
                    className={
                      sortBy === sort.id
                        ? 'text-xs font-medium text-secondary-foreground'
                        : 'text-xs font-medium text-muted-foreground'
                    }>
                    {sort.label}
                  </Text>
                  {sortBy === sort.id && (
                    <Icon
                      as={sortOrder === 'desc' ? ArrowDownIcon : ArrowUpIcon}
                      className="size-3 text-secondary-foreground"
                    />
                  )}
                </Pressable>
              ))}
            </View>
          </ScrollView>
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
