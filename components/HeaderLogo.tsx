import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";

interface HeaderLogoProps {
  style?: StyleProp<ImageStyle>; // Add style prop
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ style }) => {
  // Add type and props
  return (
    <Image
      source={require("../resources/hrms-app-logo.png")}
      style={[{ width: 250, marginLeft: 10, height: 50 }, style]} // Combine styles
      resizeMode="contain"
    />
  );
};

export default HeaderLogo;
