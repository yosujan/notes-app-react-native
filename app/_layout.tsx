import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { NotesProvider } from '@/lib/notes-context';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <NotesProvider>
        <Stack />
      </NotesProvider>
      <PortalHost />
    </ThemeProvider>
  );
}
