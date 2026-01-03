import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
  Animated,
  Easing,
  ScrollView,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = ({ navigation }) => {
  const [rotationValue] = useState(new Animated.Value(0));

  const startLogoAnimation = () => {
    Animated.loop(
      Animated.timing(rotationValue, {
        toValue: 1,
        duration: 3000, 
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  useEffect(() => {
    startLogoAnimation();
  }, []);

  const interpolatedRotation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const menuItems = [
    // {
    //   title: "Chat with Astro Dude",
    //   subtitle: "Ask anything about space",
    //   icon: "🚀",
    //   route: "Chat",
    //   color: "#4CAF50",
    // },
    {
      title: "Meteors",
      subtitle: "Learn about meteor showers",
      icon: "☄️",
      route: "Meteors",
      color: "#FF9800",
    },
    // {
    //   title: "Daily Space Pics",
    //   subtitle: "NASA's astronomy picture of the day",
    //   icon: "🖼️",
    //   route: "DailyPic",
    //   color: "#2196F3",
    // },
    {
      title: "Star Map",
      subtitle: "Explore the night sky",
      icon: "🌌",
      route: "StarMap",
      color: "#9C27B0",
    },
    {
      title: "Spacecrafts",
      subtitle: "Discover space missions",
      icon: "🛰️",
      route: "SpaceCraft",
      color: "#607D8B",
    },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.droidSafeArea} />
      {/* Header Section */}
      <View style={styles.header}>
        <Animated.Image
          source={require("../assets/Logo.png")}
          style={[
            styles.logo,
            { transform: [{ rotate: interpolatedRotation }] }
          ]}
        />
        <Text style={styles.titleText}>Astro Explorer</Text>
        <Text style={styles.subtitleText}>Unveil The Universe</Text>
      </View>

      {/* Menu Section */}
      <ScrollView 
        style={styles.menuContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuContent}
      >
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuCard, { borderLeftColor: item.color }]}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={styles.menuIconContainer}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>➔</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Explore the cosmos with Astro Explorer</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F23", 
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#1A1A2E",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 1,
    top: -100
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#4CAF50",
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 16,
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuContent: {
    paddingBottom: 20,
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    marginVertical: 8,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: "#000000ff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2A2A4A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    color: "#888",
  },
  arrowContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#2A2A4A",
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  footer: {
    padding: 10,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#2A2A4A",
  },
  footerText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});

export default HomeScreen;