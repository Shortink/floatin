import { Tabs } from "expo-router";
import { View } from "react-native";
import HomeIcon from "../../assets/icons/home.svg";
import ChatIcon from "../../assets/icons/chat.svg";
import EventIcon from "../../assets/icons/event.svg";
import MatchesIcon from "../../assets/icons/matches.svg";
import ProfileIcon from "../../assets/icons/profile.svg";

export default function AppTabsLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#FFF6F3" }}>
      <Tabs
        backBehavior="history"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#66BFD2",
          tabBarInactiveTintColor: "#999",
          tabBarStyle: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: 100,
            overflow: "hidden",
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
            marginBottom: 8,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <View
                  style={{
                    height: 3,
                    width: 35,
                    backgroundColor: focused ? "#66BFD2" : "transparent",
                    marginBottom: 4,
                    borderRadius: 2,
                  }}
                />
                <HomeIcon
                  width={26}
                  height={26}
                  fill={focused ? "#66BFD2" : "#999"}
                />189375
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="events"
          options={{
            title: "Events",
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <View
                  style={{
                    height: 3,
                    width: 35,
                    backgroundColor: focused ? "#66BFD2" : "transparent",
                    marginBottom: 4,
                    borderRadius: 2,
                  }}
                />
                <EventIcon
                  width={26}
                  height={26}
                  fill={focused ? "#66BFD2" : "#999"}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <View
                  style={{
                    height: 3,
                    width: 35,
                    backgroundColor: focused ? "#66BFD2" : "transparent",
                    marginBottom: 4,
                    borderRadius: 2,
                  }}
                />
                <ChatIcon
                  width={26}
                  height={26}
                  fill={focused ? "#66BFD2" : "#999"}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="likes"
          options={{
            title: "Matches",
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <View
                  style={{
                    height: 3,
                    width: 35,
                    backgroundColor: focused ? "#66BFD2" : "transparent",
                    marginBottom: 4,
                    borderRadius: 2,
                  }}
                />
                <MatchesIcon
                  width={26}
                  height={26}
                  fill={focused ? "#66BFD2" : "#999"}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <View
                  style={{
                    height: 3,
                    width: 35,
                    backgroundColor: focused ? "#66BFD2" : "transparent",
                    marginBottom: 4,
                    borderRadius: 2,
                  }}
                />
                <ProfileIcon
                  width={26}
                  height={26}
                  fill={focused ? "#66BFD2" : "#999"}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="[userId]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="gallery/[userId]"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </View>
  );
}
