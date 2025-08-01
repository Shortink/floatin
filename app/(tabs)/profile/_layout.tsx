import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* <Stack.Screen name="[userId]" options={{ headerShown: false }} /> */}
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="gallery" options={{ headerShown: false }} />
    </Stack>
  );
}
