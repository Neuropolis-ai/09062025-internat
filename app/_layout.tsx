import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="uspevaemost" options={{ headerShown: false }} />
      <Stack.Screen name="respublika" options={{ headerShown: false }} />
      <Stack.Screen name="bank" options={{ headerShown: false }} />
      <Stack.Screen name="neuro" options={{ headerShown: false }} />
      <Stack.Screen name="faq" options={{ headerShown: false }} />
      <Stack.Screen name="pravila" options={{ headerShown: false }} />
    </Stack>
  );
} 