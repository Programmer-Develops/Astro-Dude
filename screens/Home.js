import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
  Animated,
  Easing,
  ScrollView,
} from "react-native";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rotationValue: new Animated.Value(0),
    };
  }

  // Function to start the logo rotation animation
  startLogoAnimation() {
    Animated.loop(
      Animated.timing(this.state.rotationValue, {
        toValue: 1,
        duration: 2000, // 2 seconds for one full rotation
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }

  componentDidMount() {
    this.startLogoAnimation();
  }

  render() {
    const { rotationValue } = this.state;

    // Calculate the interpolated rotation angle
    const interpolatedRotation = rotationValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <SafeAreaView style={styles.droidSafeArea} />
        <View style={styles.container2}>
          <Animated.Image
            source={require("../assets/Logo.png")}
            style={{
              alignSelf: "center",
              width: 150,
              height: 150,
              justifyContent: "center",
              borderRadius: 75,
              // transform: [{ rotate: interpolatedRotation }],
              marginBottom: 20,
            }}
          />
          <View style={styles.titleBar}>
            <Text style={styles.titleText}>"Unveil The Universe"</Text>
          </View>
          <TouchableOpacity
            style={styles.routeCard}
            onPress={() => this.props.navigation.navigate("Meteors")}
          >
            <Text style={styles.routeText}>Meteors</Text>
            <Text style={styles.knowMore}>{"Know More --->"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.routeCard}
            onPress={() => this.props.navigation.navigate("DailyPic")}
          >
            <Text style={styles.routeText}>Daily Pics</Text>
            <Text style={styles.knowMore}>{"Know More --->"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.routeCard}
            onPress={() => this.props.navigation.navigate("StarMap")}
          >
            <Text style={styles.routeText}>Star Map</Text>
            <Text style={styles.knowMore}>{"Know More --->"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.routeCard}
            onPress={() => this.props.navigation.navigate("SpaceCraft")}
          >
            <Text style={styles.routeText}>Spacecrafts</Text>
            <Text style={styles.knowMore}>{"Know More --->"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E", // Dark background color
  },
  container2: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  routeCard: {
    backgroundColor: "#2C2C2C",
    borderRadius: 8,
    marginVertical: 8,
    padding: 16,
    width: 300,
    maxWidth: 520,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titleBar: {
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "monospace",
    color: "#FFFFFF", // White text color
    marginBottom: 10,
    letterSpacing: 5
  },
  routeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF", // White text color
  },
  knowMore: {
    marginTop: 10,
    color: "#007BFF", // Blue text color
  },
});

