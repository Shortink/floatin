import { Tabs } from "expo-router";

export default function AppTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#333", // Dark color for active tab
        tabBarInactiveTintColor: "#888", // Grey for inactive tab
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#eee",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen name="index" options={{title: "Home",}}/>
      <Tabs.Screen name="likes" options={{title: "Likes",}}/>
      <Tabs.Screen name="events" options={{title: "Events",}}/>
      <Tabs.Screen name="chat" options={{title: "Chat",}}/>
    </Tabs>
  );
}
