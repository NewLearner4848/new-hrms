import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  useColorScheme,
  StyleSheet,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSession } from "@/shared/ctx";
import Colors from "@/constants/Colors";
import { View } from "./Themed";
import CustomAlert from "./CustomAlert";
import { router } from "expo-router";

interface LogoutButtonProps {
  style?: StyleProp<ViewStyle>;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ style }) => {
  const { signOut } = useSession();
  const colorScheme = useColorScheme();
  const [alertVisible, setAlertVisible] = useState(false);

  const handleLogout = () => {
    setAlertVisible(true);
  };

  const confirmLogout = () => {
    setAlertVisible(false);
    router.replace("/login");
    signOut();
  };

  return (
    <>
      <View
        onTouchStart={handleLogout}
        style={[
          styles.logOutBtn,
          { borderColor: Colors[colorScheme ?? "light"].border },
        ]}
      >
        <TouchableOpacity style={style}>
          <FontAwesome
            name="sign-out"
            size={29}
            color={Colors[colorScheme ?? "light"].text}
          />
        </TouchableOpacity>
      </View>

      <CustomAlert
        visible={alertVisible}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        buttons={[
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', onPress: confirmLogout, style: 'destructive' },
        ]}
        onClose={() => setAlertVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  logOutBtn: {
    padding: 5,
    marginHorizontal: 15,
    borderWidth: 1,
    borderRadius: 50,
  },
});

export default LogoutButton;
