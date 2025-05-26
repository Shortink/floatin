import { Link } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* TODO: Add animated bubbles here */}
      <Text style={{ fontSize: 24, marginBottom: 40 }}>Welcome</Text>
      <Link href="/signup" asChild>
        <TouchableOpacity style={{ padding: 10, backgroundColor: '#ccc', marginBottom: 20 }}>
          <Text>Sign Up</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/login" asChild>
        <TouchableOpacity style={{ padding: 10, backgroundColor: '#ccc' }}>
          <Text>Log In</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
