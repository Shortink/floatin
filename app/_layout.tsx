"use client";

import { Slot, useRouter, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "./../context/auth";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font"

function RootContent() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

   const [fontsLoaded] = useFonts({
    "Poppins-BlackItalic": require("../assets/fonts/Poppins-BlackItalic.ttf"),
    "Nunito": require("../assets/fonts/Nunito-VariableFont_wght.ttf")
  })
  
  useEffect(() => {
    setLoading(false);
  }, []);

  const publicRoutes = ["/login", "/signup", "/welcome", "/reset"];

  useEffect(() => {
    if (!loading && fontsLoaded) {
      if (!user && !publicRoutes.includes(pathname)) {
        router.replace("/welcome");
      } else if (user && publicRoutes.includes(pathname)) {
        const hasOnboarded = user.user_metadata?.has_completed_onboarding;

        if (!hasOnboarded && pathname !== "/onboarding") {
          router.replace("/onboarding");
        } else if (hasOnboarded) {
          router.replace("/(tabs)/home");
        }
      }
    }
  }, [loading, fontsLoaded, user, pathname, router]);

  if (loading) {
    return (
      <LinearGradient colors={["#f7f0ff", "#b9a5ec"]} style={{flex: 1}}>
        <ActivityIndicator size="large" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#f7f0ff", "#b9a5ec"]} style={{flex: 1}}>
      <Slot />
    </LinearGradient>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootContent />
    </AuthProvider>
  );
}
