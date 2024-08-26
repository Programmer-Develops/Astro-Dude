import React, { Component } from 'react';
import {Text,View,TouchableOpacity,StyleSheet, Platform,SafeAreaView} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class Game extends Component {
    render() {
        return(
            <SafeAreaProvider>
                <SafeAreaView style={styles.droidSafeArea} />
                <View style={styles.container}>
                    <View style={styles.container2}>
                        <Text style={styles.titleText}>Coming Soon</Text>
                    </View>
                </View>
            </SafeAreaProvider>
        )
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
      marginTop:'20%'
      
    },
    droidSafeArea: {
      marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    titleText: {
      fontSize: 20,
      fontWeight: "bold",
      fontFamily: "monospace",
      letterSpacing:10,
      color: "#FFFFFF", // White text color
      marginBottom: 10
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