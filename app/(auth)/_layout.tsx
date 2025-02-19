import { Text, useColorScheme } from "react-native";
import { Redirect, Stack } from "expo-router";

import { useSession } from "@/shared/ctx";
import Colors from "@/constants/Colors";
import HeaderLogo from "@/components/HeaderLogo";
import LogoutButton from "@/components/LogoutButton";

export default function AppLayout() {
  const { session, isLoading } = useSession();
  const colorScheme = useColorScheme();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].tint,
        },
        headerTintColor: Colors[colorScheme ?? "light"].text,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitle: "",
        headerLeft: () => <HeaderLogo />,
        headerRight: () => <LogoutButton />,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
