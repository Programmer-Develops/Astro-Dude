import React, { useState, useEffect, useRef } from "react";
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
  Dimensions,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const generateStars = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2.5 + 0.5,
    opacity: Math.random() * 0.8 + 0.2,
    twinkleDuration: 1000 + Math.random() * 3000,
  }));

const STARS = generateStars(120);

const TwinklingStar = ({ star }) => {
  const opacity = useRef(new Animated.Value(star.opacity)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.1,
          duration: star.twinkleDuration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: star.opacity,
          duration: star.twinkleDuration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: star.x,
        top: star.y,
        width: star.size,
        height: star.size,
        borderRadius: star.size / 2,
        backgroundColor: "#FFFFFF",
        opacity,
      }}
    />
  );
};

const HomeScreen = ({ navigation }) => {
  // Orbit ring rotation
  const orbitAngle = useRef(new Animated.Value(0)).current;
  // Outer ring (reverse)
  const orbitAngle2 = useRef(new Animated.Value(0)).current;
  // Pulse scale for the glow
  const pulseScale = useRef(new Animated.Value(1)).current;
  // Fade-in for the whole header
  const headerFade = useRef(new Animated.Value(0)).current;
  // Slide-up for menu items
  const menuSlide = useRef(new Animated.Value(40)).current;
  const menuFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Orbit animation (clockwise)
    Animated.loop(
      Animated.timing(orbitAngle, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Counter-clockwise outer ring
    Animated.loop(
      Animated.timing(orbitAngle2, {
        toValue: -1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, {
          toValue: 1.15,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Entry animations
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(menuSlide, {
        toValue: 0,
        duration: 900,
        delay: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(menuFade, {
        toValue: 1,
        duration: 900,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const orbitRotate = orbitAngle.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const orbitRotate2 = orbitAngle2.interpolate({
    inputRange: [-1, 0],
    outputRange: ["-360deg", "0deg"],
  });

  const menuItems = [
    {
      title: "Meteors",
      subtitle: "Learn about meteor showers",
      icon: "☄️",
      route: "Meteors",
      color: "#FF6B35",
      glow: "#FF6B3540",
    },
    {
      title: "Upcoming Launches",
      subtitle: "Stay updated with space launches",
      icon: "🚀",
      route: "Launch",
      color: "#E63950",
      glow: "#E6395040",
    },
    {
      title: "Star Map",
      subtitle: "Explore the night sky",
      icon: "🌌",
      route: "StarMap",
      color: "#7B61FF",
      glow: "#7B61FF40",
    },
    {
      title: "Spacecrafts",
      subtitle: "Discover space missions",
      icon: "🛰️",
      route: "SpaceCraft",
      color: "#00C9A7",
      glow: "#00C9A740",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {STARS.map((star) => (
          <TwinklingStar key={star.id} star={star} />
        ))}
      </View>

      <View style={[styles.nebula, styles.nebula1]} pointerEvents="none" />
      <View style={[styles.nebula, styles.nebula2]} pointerEvents="none" />
      <View style={[styles.nebula, styles.nebula3]} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.header, { opacity: headerFade }]}>
          <View style={styles.logoWrapper}>
            <Animated.View
              style={[
                styles.orbitRing,
                styles.orbitOuter,
                { transform: [{ rotate: orbitRotate2 }] },
              ]}
            >
              <View style={styles.orbitDotOuter} />
            </Animated.View>

            <Animated.View
              style={[
                styles.orbitRing,
                styles.orbitInner,
                { transform: [{ rotate: orbitRotate }] },
              ]}
            >
              <View style={styles.orbitDotInner} />
            </Animated.View>

            <Animated.View
              style={[styles.logoGlow, { transform: [{ scale: pulseScale }] }]}
            />

            <Image
              source={require("../assets/Logo.png")}
              style={styles.logo}
            />
          </View>

          <Text style={styles.appName}>ASTRO DUDE</Text>
          <View style={styles.taglineRow}>
            <View style={styles.taglineLine} />
            <Text style={styles.tagline}>UNVEIL THE UNIVERSE</Text>
            <View style={styles.taglineLine} />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.menuWrapper,
            { opacity: menuFade, transform: [{ translateY: menuSlide }] },
          ]}
        >
          <Text style={styles.sectionLabel}>MISSION CONTROL</Text>
          <ScrollView
            style={styles.menuScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.menuContent}
          >
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.75}
                style={[styles.menuCard, { shadowColor: item.color }]}
                onPress={() => navigation.navigate(item.route)}
              >
                <View style={[styles.cardStrip, { backgroundColor: item.color }]} />

                <View style={[styles.iconBubble, { backgroundColor: item.glow }]}>
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                </View>

                <View style={styles.cardText}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>

                <View style={[styles.arrowBtn, { borderColor: item.color + "80" }]}>
                  <Text style={[styles.arrowIcon, { color: item.color }]}>›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        <View style={styles.footer}>
          <View style={styles.footerDot} />
          <Text style={styles.footerText}>Explore the cosmos with Astro Explorer</Text>
          <View style={styles.footerDot} />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#03020F",
  },
  safeArea: {
    flex: 1,
  },

  // ── Nebula blobs ──
  nebula: {
    position: "absolute",
    borderRadius: 999,
  },
  nebula1: {
    width: 320,
    height: 320,
    top: -80,
    left: -80,
    backgroundColor: "#1A0A4A",
    opacity: 0.7,
    // blur approximated via multiple layers
  },
  nebula2: {
    width: 240,
    height: 240,
    top: 60,
    right: -60,
    backgroundColor: "#0A1A3A",
    opacity: 0.6,
  },
  nebula3: {
    width: 280,
    height: 280,
    bottom: 120,
    left: -40,
    backgroundColor: "#0A2A1A",
    opacity: 0.45,
  },

  // ── Header ──
  header: {
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 24) + 10 : 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },

  // ── Logo animation ──
  logoWrapper: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  orbitRing: {
    position: "absolute",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  orbitOuter: {
    width: 138,
    height: 138,
    borderRadius: 69,
    borderWidth: 1,
    borderColor: "#7B61FF50",
    borderStyle: "dashed",
  },
  orbitInner: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 1,
    borderColor: "#00C9A760",
    borderStyle: "dashed",
  },
  orbitDotOuter: {
    position: "absolute",
    top: -3,
    left: 60,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#A78BFF",
    shadowColor: "#7B61FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 8,
  },
  orbitDotInner: {
    position: "absolute",
    top: -3,
    left: 46,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#00FFCA",
    shadowColor: "#00C9A7",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 8,
  },
  logoGlow: {
    position: "absolute",
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "transparent",
    shadowColor: "#7B61FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: "#7B61FF30",
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#7B61FF80",
  },

  // ── Typography ──
  appName: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 8,
    marginBottom: 10,
    textShadowColor: "#7B61FF",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  taglineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  taglineLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#FFFFFF20",
    maxWidth: 50,
  },
  tagline: {
    fontSize: 11,
    color: "#00C9A7",
    letterSpacing: 4,
    fontWeight: "600",
  },

  // ── Menu ──
  menuWrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionLabel: {
    fontSize: 10,
    color: "#FFFFFF30",
    letterSpacing: 4,
    fontWeight: "700",
    marginBottom: 14,
    marginLeft: 4,
  },
  menuScroll: {
    flex: 1,
  },
  menuContent: {
    paddingBottom: 16,
    gap: 12,
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0E0E24",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#FFFFFF08",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  cardStrip: {
    width: 3,
    alignSelf: "stretch",
    opacity: 0.9,
  },
  iconBubble: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    margin: 14,
  },
  menuIcon: {
    fontSize: 22,
  },
  cardText: {
    flex: 1,
    paddingVertical: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 12,
    color: "#FFFFFF55",
    letterSpacing: 0.2,
  },
  arrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  arrowIcon: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "300",
  },

  // ── Footer ──
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#FFFFFF08",
  },
  footerDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#FFFFFF20",
  },
  footerText: {
    fontSize: 11,
    color: "#FFFFFF30",
    letterSpacing: 1,
    textAlign: "center",
  },
});

export default HomeScreen;